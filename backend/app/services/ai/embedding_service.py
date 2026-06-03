from __future__ import annotations

from collections import Counter
from dataclasses import dataclass, field
import hashlib

from backend.app.core.config import settings

try:
    import chromadb
except ImportError:  # pragma: no cover - optional dependency
    chromadb = None

try:
    from sentence_transformers import SentenceTransformer
except ImportError:  # pragma: no cover - optional dependency
    SentenceTransformer = None


@dataclass
class InMemoryCollection:
    documents: list[str] = field(default_factory=list)


class BusinessKnowledgeStore:
    def __init__(self) -> None:
        self._collections: dict[str, InMemoryCollection] = {}
        self._client = None
        self._embedding_model = None

    def _ensure_client(self):
        if self._client is not None or chromadb is None:
            return self._client

        try:
            if settings.chromadb_cloud_api_key and settings.chromadb_tenant and settings.chromadb_database:
                self._client = chromadb.CloudClient(
                    api_key=settings.chromadb_cloud_api_key,
                    tenant=settings.chromadb_tenant,
                    database=settings.chromadb_database,
                )
            else:
                self._client = chromadb.PersistentClient(path=settings.chroma_persist_directory)
        except Exception:
            try:
                self._client = chromadb.PersistentClient(path=settings.chroma_persist_directory)
            except Exception:
                self._client = None

        return self._client

    def _ensure_embedding_model(self):
        if self._embedding_model is not None or SentenceTransformer is None:
            return self._embedding_model

        try:
            self._embedding_model = SentenceTransformer("all-MiniLM-L6-v2")
        except Exception:
            self._embedding_model = None

        return self._embedding_model

    def add_documents(self, collection_name: str, documents: list[str]) -> None:
        if not documents:
            return

        client = self._ensure_client()
        if client is not None:
            try:
                collection = client.get_or_create_collection(collection_name)
                ids = [
                    f"{collection_name}-{index}-{hashlib.sha1(document.encode('utf-8')).hexdigest()[:12]}"
                    for index, document in enumerate(documents)
                ]
                embeddings = self._embed(documents)
                payload = {"ids": ids, "documents": documents}
                if embeddings is not None:
                    payload["embeddings"] = embeddings
                collection.upsert(**payload)
                return
            except Exception:
                pass

        store = self._collections.setdefault(collection_name, InMemoryCollection())
        store.documents.extend(documents)

    def search(self, collection_name: str, query: str, limit: int = 3) -> list[str]:
        client = self._ensure_client()
        if client is not None:
            try:
                collection = client.get_or_create_collection(collection_name)
                query_embeddings = self._embed([query])
                if query_embeddings is not None:
                    results = collection.query(query_embeddings=query_embeddings, n_results=limit)
                else:
                    results = collection.query(query_texts=[query], n_results=limit)
                documents = results.get("documents", [[]])[0]
                return [doc for doc in documents if doc]
            except Exception:
                pass

        store = self._collections.get(collection_name)
        if not store or not store.documents:
            return []

        query_terms = Counter(query.lower().split())

        def score(document: str) -> int:
            document_terms = Counter(document.lower().split())
            return sum((query_terms & document_terms).values())

        ranked = sorted(store.documents, key=score, reverse=True)
        return ranked[:limit]

    def _embed(self, documents: list[str]):
        model = self._ensure_embedding_model()
        if model is None:
            return None

        try:
            return model.encode(documents).tolist()
        except Exception:
            return None
