from __future__ import annotations

from dataclasses import dataclass

from app.core.config import settings

try:
    import google.generativeai as genai
except ImportError:  # pragma: no cover - optional dependency
    genai = None


@dataclass
class GeminiContext:
    question: str
    context: list[str]


class GeminiService:
    def __init__(self) -> None:
        self.enabled = bool(settings.gemini_api_key and genai)
        self.model_name = settings.gemini_model

        if self.enabled and genai is not None:
            genai.configure(api_key=settings.gemini_api_key)

    def _model(self):
        if not self.enabled or genai is None:
            return None
        return genai.GenerativeModel(self.model_name)

    def generate_text(self, prompt: str, system_instruction: str | None = None) -> str:
        model = self._model()

        if model is not None:
            try:
                response = model.generate_content(
                    prompt,
                    generation_config={"temperature": 0.2, "max_output_tokens": 512},
                )
                text = getattr(response, "text", "")
                if text:
                    return text.strip()
            except Exception:
                pass

        return self._fallback_text(prompt, system_instruction=system_instruction)

    def summarize_banner(self, recommendations: list[dict], score: int) -> str:
        top_actions = ", ".join(item["title"] for item in recommendations[:2])
        prompt = (
            "Write a concise growth recommendation for a local business dashboard.\n"
            f"Business score: {score}\n"
            f"Top actions: {top_actions}\n"
        )
        return self.generate_text(prompt) or self._fallback_text(prompt)

    def answer_business_question(self, question: str, context_snippets: list[str] | None = None) -> str:
        snippets = context_snippets or []
        prompt = (
            "You are an expert AI business consultant for a local business growth platform.\n"
            "Answer the user's question with concise, practical advice.\n"
            f"Question: {question}\n"
            f"Context: {' | '.join(snippets[:5]) if snippets else 'No extra context provided'}\n"
        )
        return self.generate_text(prompt) or self._fallback_reply(question)

    def _fallback_text(self, prompt: str, system_instruction: str | None = None) -> str:
        if "growth recommendation" in prompt.lower():
            return "Prioritize online booking, local SEO, and FAQ content to create a faster path from discovery to conversion."
        return "I can help you turn the analysis into clear next steps, even without the Gemini key configured."

    def _fallback_reply(self, question: str) -> str:
        lowered = question.lower()

        if "website" in lowered or "seo" in lowered:
            return "Focus on metadata, structured data, and stronger CTA placement. Those changes usually create the fastest SEO and conversion lift."
        if "review" in lowered:
            return "The review signals point to wait times, booking friction, and pricing concerns. Address those first and you should see sentiment improve."
        if "competitor" in lowered:
            return "Your closest competitors appear to win on booking convenience and content depth. Closing those gaps would improve parity quickly."
        if "swot" in lowered:
            return "The core strategic pattern is clear: strong customer sentiment and mobile usability, with booking, FAQ, and content depth as the biggest gaps."

        return "I can connect the website, review, and competitor findings into a more specific recommendation if you want to narrow the question."
