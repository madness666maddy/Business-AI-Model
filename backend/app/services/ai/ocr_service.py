from __future__ import annotations

import io
import re
from pathlib import Path

from bs4 import BeautifulSoup

try:  # pragma: no cover - optional dependency
    from PIL import Image, ImageFilter, ImageOps
except ImportError:  # pragma: no cover
    Image = None
    ImageFilter = None
    ImageOps = None

try:  # pragma: no cover - optional dependency
    import pytesseract
except ImportError:  # pragma: no cover
    pytesseract = None

try:  # pragma: no cover - optional dependency
    from PyPDF2 import PdfReader
except ImportError:  # pragma: no cover
    PdfReader = None


IMAGE_EXTENSIONS = {".png", ".jpg", ".jpeg", ".webp", ".bmp", ".tif", ".tiff"}
TEXT_EXTENSIONS = {".txt", ".md", ".csv", ".json", ".html", ".htm"}


class OCRService:
    def extract_text(self, file_bytes: bytes, filename: str | None = None) -> str:
        suffix = Path(filename or "").suffix.lower()

        if suffix in IMAGE_EXTENSIONS:
            return self._extract_from_image(file_bytes)

        if suffix == ".pdf":
            extracted = self._extract_from_pdf(file_bytes)
            if extracted.strip():
                return extracted
            return ""

        if suffix in TEXT_EXTENSIONS:
            return self._extract_from_text(file_bytes, suffix)

        image_text = self._extract_from_image(file_bytes)
        if image_text.strip():
            return image_text

        return self._extract_from_text(file_bytes, suffix)

    def _extract_from_image(self, file_bytes: bytes) -> str:
        if Image is None or pytesseract is None:
            return ""

        try:
            with Image.open(io.BytesIO(file_bytes)) as image:
                image = image.convert("L")
                if ImageOps is not None:
                    image = ImageOps.autocontrast(image)
                if ImageFilter is not None:
                    image = image.filter(ImageFilter.SHARPEN)
                text = pytesseract.image_to_string(image, config="--psm 6")
                return self._clean_text(text)
        except Exception:
            return ""

    def _extract_from_pdf(self, file_bytes: bytes) -> str:
        if PdfReader is None:
            return ""

        try:
            reader = PdfReader(io.BytesIO(file_bytes))
            pages: list[str] = []
            for page in reader.pages[:12]:
                page_text = page.extract_text() or ""
                if page_text.strip():
                    pages.append(page_text)
            return self._clean_text("\n".join(pages))
        except Exception:
            return ""

    def _extract_from_text(self, file_bytes: bytes, suffix: str) -> str:
        try:
            decoded = file_bytes.decode("utf-8", errors="ignore")
        except Exception:
            decoded = ""

        if not decoded.strip():
            return ""

        if suffix in {".html", ".htm"}:
            try:
                soup = BeautifulSoup(decoded, "html.parser")
                decoded = soup.get_text(" ", strip=True)
            except Exception:
                pass

        return self._clean_text(decoded)

    def _clean_text(self, text: str) -> str:
        compact = re.sub(r"\s+", " ", text or "").strip()
        return compact
