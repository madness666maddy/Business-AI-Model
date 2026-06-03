from __future__ import annotations

from datetime import datetime, timezone
from time import time_ns

from backend.app.models.user import User
from backend.app.services.ai.embedding_service import BusinessKnowledgeStore
from backend.app.services.ai.ocr_service import OCRService
from backend.app.services.ai.intent_rnn import BusinessIntentRNN
from backend.app.services.ai.gemini_service import GeminiService
from backend.app.services.analysis.competitor_intelligence import CompetitorIntelligenceEngine
from backend.app.services.analysis.recommendation_engine import RecommendationEngine
from backend.app.services.analysis.review_intelligence import ReviewIntelligenceEngine
from backend.app.services.analysis.swot_engine import SwotEngine
from backend.app.services.analysis.website_analyzer import WebsiteAnalyzer
from backend.app.services.reporting.pdf_service import PdfService
from backend.app.services.notifications.resend_service import ResendService
from backend.app.utils.seed_data import (
    get_action_plan_items,
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
        self.ocr_service = OCRService()
        self.intent_engine = BusinessIntentRNN()
        self.resend_service = ResendService()
        self.pdf_service = PdfService()
        self.chat_memory: dict[int, list[dict]] = {}

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

    def analyze_website(self, url: str, business_name: str | None = None, ocr_text: str | None = None) -> dict:
        analysis = self.website_analyzer.analyze(url, business_name, ocr_text=ocr_text)
        self._store_context(
            [
                f"Website score: {analysis['score']}",
                f"CTA findings: {'; '.join(analysis['ctaFindings'])}",
                f"Opportunities: {'; '.join(analysis['opportunities'])}",
                f"OCR insights: {'; '.join(analysis.get('ocrInsights', []))}",
            ]
        )
        if ocr_text:
            self._store_context([f"OCR page copy: {ocr_text}"])
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

    def handle_chat(
        self,
        thread_id: int,
        message: str,
        user: User | None = None,
        context_text: str | None = None,
    ) -> dict:
        messages = self.chat_memory.setdefault(thread_id, [])
        context_history = [str(item.get("text", "")).strip() for item in messages[-6:] if str(item.get("text", "")).strip()]
        if context_text and context_text.strip():
            context_history.append(context_text.strip())
            self._store_context([context_text.strip()])

        user_message = {
            "id": time_ns(),
            "role": "user",
            "timestamp": datetime.now(timezone.utc).strftime("%H:%M"),
            "text": message,
        }
        messages.append(user_message)

        combined_query = message if not context_text else f"{message}\n{context_text}"
        context_snippets = self.knowledge_store.search("business-insights", combined_query)
        if context_text and context_text.strip():
            context_snippets = [context_text.strip()[:500], *context_snippets]

        intent_prediction = self.intent_engine.predict(message, context_texts=context_history)
        reply = self.gemini.answer_business_question(
            message,
            context_snippets=context_snippets,
            intent=intent_prediction.intent,
            confidence=intent_prediction.confidence,
            conversation_history=context_history,
            business_name=user.business_name if user else None,
            user_name=user.full_name if user else None,
        )

        assistant_message = {
            "id": time_ns() + 1,
            "role": "assistant",
            "timestamp": datetime.now(timezone.utc).strftime("%H:%M"),
            "text": reply,
            "meta": {
                "intent": intent_prediction.intent,
                "intentLabel": intent_prediction.intent_label,
                "confidence": intent_prediction.confidence,
                "followUpQuestion": intent_prediction.follow_up_question,
                "suggestedReplies": intent_prediction.suggested_replies,
                "shouldEmailSummary": intent_prediction.should_email_summary,
            },
        }
        messages.append(assistant_message)
        self.chat_memory[thread_id] = messages
        self._store_context([message, reply, *context_snippets[:2]])

        threads = self._build_live_thread_overview(thread_id, reply)
        email_action = {
            "available": bool(user and user.email),
            "label": "Email a summary",
            "recipient": user.email if user else None,
            "status": "Ready" if user and user.email else "Sign in to enable email summaries",
        }

        return {
            "threads": threads,
            "messages": messages,
            "reply": reply,
            "intent": intent_prediction.intent,
            "intentLabel": intent_prediction.intent_label,
            "confidence": intent_prediction.confidence,
            "followUpQuestion": intent_prediction.follow_up_question,
            "suggestedReplies": intent_prediction.suggested_replies,
            "knowledgeSnippets": context_snippets,
            "emailAction": email_action,
        }

    def extract_ocr_text(self, file_bytes: bytes, filename: str | None = None) -> dict:
        text = self.ocr_service.extract_text(file_bytes, filename)
        stored = False

        if text.strip():
            self._store_context([f"OCR source {filename or 'uploaded file'}: {text.strip()}"])
            stored = True

        return {
            "text": text,
            "sourceName": filename,
            "characterCount": len(text),
            "storedInKnowledgeBase": stored,
        }

    def send_chat_summary(self, thread_id: int, user: User | None = None) -> dict:
        messages = self.chat_memory.setdefault(thread_id, [])
        if user is None or not user.email.strip():
            return {
                "success": False,
                "message": "A signed-in user with a valid email address is required to send a summary.",
                "recipient": None,
                "subject": None,
            }

        thread_title = "Growth Advisory Chat"
        summary = self.gemini.summarize_chat_thread(
            messages,
            business_name=user.business_name,
            user_name=user.full_name,
        )
        subject = summary.get("subject") or f"{thread_title} summary"
        body = summary.get("body") or "No summary content was generated."
        result = self.resend_service.send_email(
            recipient=user.email,
            subject=subject,
            body=(
                f"Hi {user.full_name},\n\n"
                f"Here is the summary for your chat thread '{thread_title}':\n\n"
                f"{body}\n\n"
                f"Transcript reference generated at {datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M UTC')}."
            ),
        )

        provider_id = result.pop("provider_id", None)
        if provider_id is not None:
            result["providerId"] = provider_id
        result["threadTitle"] = thread_title
        result["subject"] = subject
        return result

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

    def _build_live_thread_overview(self, thread_id: int, reply: str) -> list[dict]:
        preview = self._build_preview(reply)
        current_time = datetime.now(timezone.utc).strftime("%H:%M")
        return [
            {
                "id": thread_id,
                "title": "Growth Advisory Chat",
                "preview": preview,
                "tag": "Chat",
                "time": current_time,
                "active": True,
            }
        ]

    def _build_preview(self, text: str, limit: int = 96) -> str:
        compact = " ".join(text.split())
        if len(compact) <= limit:
            return compact
        return f"{compact[: limit - 1].rstrip()}..."


orchestrator = AnalysisOrchestrator()
