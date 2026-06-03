from __future__ import annotations

from datetime import datetime, timezone
from time import time_ns

from app.core.security import create_user_initials
from app.models.user import User
from app.services.ai.embedding_service import BusinessKnowledgeStore
from app.services.ai.gemini_service import GeminiService
from app.services.analysis.competitor_intelligence import CompetitorIntelligenceEngine
from app.services.analysis.recommendation_engine import RecommendationEngine
from app.services.analysis.review_intelligence import ReviewIntelligenceEngine
from app.services.analysis.swot_engine import SwotEngine
from app.services.analysis.website_analyzer import WebsiteAnalyzer
from app.services.reporting.pdf_service import PdfService
from app.utils.seed_data import (
    get_action_plan_items,
    get_chat_messages,
    get_chat_threads,
    get_dashboard_overview,
    get_review_analytics,
)


class AnalysisOrchestrator:
    def __init__(self) -> None:
        self.website_analyzer = WebsiteAnalyzer()
        self.review_engine = ReviewIntelligenceEngine()
        self.competitor_engine = CompetitorIntelligenceEngine()
        self.swot_engine = SwotEngine()
        self.recommendation_engine = RecommendationEngine()
        self.gemini = GeminiService()
        self.knowledge_store = BusinessKnowledgeStore()
        self.pdf_service = PdfService()
        self.chat_memory = {thread["id"]: get_chat_messages(thread["id"]) for thread in get_chat_threads()}

    def build_dashboard_overview(self, user: User | None = None) -> dict:
        overview = get_dashboard_overview()
        recommendations = self.recommendation_engine.generate()
        overview["recommendationBanner"]["message"] = self.gemini.summarize_banner(
            recommendations,
            overview["overallScore"],
        )

        if user is not None:
            overview["businessName"] = user.business_name
            slug = "".join(character for character in user.business_name.lower() if character.isalnum())
            overview["website"] = f"www.{slug or 'business'}.com"

        self._store_context(
            [
                f"Overall score: {overview['overallScore']}",
                f"Top recommendations: {', '.join(item['title'] for item in recommendations[:3])}",
            ]
        )
        return overview

    def analyze_website(self, url: str, business_name: str | None = None) -> dict:
        analysis = self.website_analyzer.analyze(url, business_name)
        self._store_context(
            [
                f"Website score: {analysis['score']}",
                f"CTA findings: {'; '.join(analysis['ctaFindings'])}",
                f"Opportunities: {'; '.join(analysis['opportunities'])}",
            ]
        )
        return analysis

    def analyze_reviews(self, file_bytes: bytes | None = None) -> dict:
        return self.review_engine.analyze(file_bytes)

    def analyze_competitors(self, urls: list[str] | None = None) -> dict:
        return self.competitor_engine.analyze(urls)

    def get_swot(self) -> dict:
        return self.swot_engine.analyze()

    def get_recommendations(self) -> list[dict]:
        return self.recommendation_engine.generate()

    def get_action_plan(self) -> list[dict]:
        return self.recommendation_engine.build_action_plan() or get_action_plan_items()

    def handle_chat(self, thread_id: int, message: str) -> dict:
        messages = self.chat_memory.setdefault(thread_id, get_chat_messages(thread_id))

        user_message = {
            "id": time_ns(),
            "role": "user",
            "timestamp": datetime.now(timezone.utc).strftime("%H:%M"),
            "text": message,
        }
        messages.append(user_message)

        context_snippets = self.knowledge_store.search("business-insights", message)
        reply = self.gemini.answer_business_question(message, context_snippets=context_snippets)

        assistant_message = {
            "id": time_ns() + 1,
            "role": "assistant",
            "timestamp": datetime.now(timezone.utc).strftime("%H:%M"),
            "text": reply,
        }
        messages.append(assistant_message)
        self.chat_memory[thread_id] = messages
        self._store_context([message, reply])

        return {
            "threads": get_chat_threads(),
            "messages": messages,
            "reply": reply,
        }

    def build_pdf_report(self, user: User | None = None) -> bytes:
        overview = self.build_dashboard_overview(user)
        recommendations = self.get_recommendations()
        action_plan = self.get_action_plan()
        swot = self.get_swot()
        reviews = self.analyze_reviews(None)
        competitor = self.analyze_competitors(None)
        return self.pdf_service.build_report(
            overview=overview,
            recommendations=recommendations,
            action_plan=action_plan,
            swot=swot,
            reviews=reviews,
            competitor=competitor,
        )

    def _store_context(self, snippets: list[str]) -> None:
        self.knowledge_store.add_documents(
            "business-insights",
            [snippet for snippet in snippets if snippet],
        )


orchestrator = AnalysisOrchestrator()
