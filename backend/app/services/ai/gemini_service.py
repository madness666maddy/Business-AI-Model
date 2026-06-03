from __future__ import annotations

from dataclasses import dataclass

from backend.app.core.config import settings

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

    def answer_business_question(
        self,
        question: str,
        context_snippets: list[str] | None = None,
        *,
        intent: str | None = None,
        confidence: float | None = None,
        conversation_history: list[str] | None = None,
        business_name: str | None = None,
        user_name: str | None = None,
    ) -> str:
        snippets = context_snippets or []
        history = conversation_history or []
        prompt = self._build_business_prompt(
            question=question,
            context_snippets=snippets,
            intent=intent,
            confidence=confidence,
            conversation_history=history,
            business_name=business_name,
            user_name=user_name,
        )
        return self.generate_text(prompt) or self._fallback_reply(question, intent=intent)

    def summarize_chat_thread(
        self,
        messages: list[dict],
        *,
        business_name: str | None = None,
        user_name: str | None = None,
    ) -> dict[str, str]:
        transcript_lines = []
        for item in messages[-12:]:
            role = "Owner" if item.get("role") == "user" else "AI Assistant"
            text = str(item.get("text", "")).strip()
            if text:
                transcript_lines.append(f"{role}: {text}")

        transcript = "\n".join(transcript_lines)
        prompt = (
            "Write a concise email summary for a local business owner.\n"
            "Return the result in this exact format:\n"
            "Subject: <short email subject>\n"
            "Body:\n"
            "<friendly summary with 3 bullet points and a short next-step section>\n\n"
            f"Business: {business_name or 'Local business'}\n"
            f"Recipient: {user_name or 'Business owner'}\n"
            f"Transcript:\n{transcript}\n"
        )

        generated = self.generate_text(prompt)
        if generated:
            parsed = self._parse_email_summary(generated)
            if parsed["subject"] and parsed["body"]:
                return parsed

        return self._fallback_email_summary(messages, business_name=business_name, user_name=user_name)

    def _fallback_text(self, prompt: str, system_instruction: str | None = None) -> str:
        if "growth recommendation" in prompt.lower():
            return "Prioritize online booking, local SEO, and FAQ content to create a faster path from discovery to conversion."
        if "email summary" in prompt.lower():
            return (
                "Subject: Business growth assistant summary\n"
                "Body:\n"
                "Here is a concise recap of the chat, with the main opportunities and recommended next steps."
            )
        return "I can help you turn the analysis into clear next steps, even without the Gemini key configured."

    def _fallback_reply(self, question: str, intent: str | None = None) -> str:
        lowered = question.lower()

        if intent == "website_analysis":
            return (
                "The fastest gains usually come from tightening SEO metadata, strengthening the CTA above the fold, "
                "and adding clearer service-page proof points. If you want, I can turn that into a short fix list."
            )
        if intent == "review_intelligence":
            return (
                "Your review signal points to customer experience, booking friction, and response speed. "
                "If you address those first, the sentiment trend should improve."
            )
        if intent == "competitor_intelligence":
            return (
                "Your closest competitors are likely winning on booking convenience and content depth. "
                "Closing those gaps is usually the quickest way to improve parity."
            )
        if intent == "swot_analysis":
            return (
                "The core strategic pattern is usually clear: strong customer trust on one side, and booking, FAQ, "
                "and content depth gaps on the other. I can convert that into actions if you want."
            )
        if intent == "recommendations":
            return (
                "The best next steps are usually the ones that improve discovery, conversion, and follow-up at the same time. "
                "I can rank them by impact or revenue if that helps."
            )
        if intent == "priority_planning":
            return (
                "I would start with the lowest-effort, highest-impact wins first, then schedule the larger content and automation work. "
                "If you'd like, I can lay it out as a week-by-week plan."
            )
        if intent == "email_summary":
            return "I can prepare a concise email summary of the conversation once the email action is triggered."

        if "website" in lowered or "seo" in lowered:
            return "Focus on metadata, structured data, and stronger CTA placement. Those changes usually create the fastest SEO and conversion lift."
        if "review" in lowered:
            return "The review signals point to wait times, booking friction, and pricing concerns. Address those first and you should see sentiment improve."
        if "competitor" in lowered:
            return "Your closest competitors appear to win on booking convenience and content depth. Closing those gaps would improve parity quickly."
        if "swot" in lowered:
            return "The core strategic pattern is clear: strong customer sentiment and mobile usability, with booking, FAQ, and content depth as the biggest gaps."

        return "I can connect the website, review, and competitor findings into a more specific recommendation if you want to narrow the question."

    def _build_business_prompt(
        self,
        *,
        question: str,
        context_snippets: list[str],
        intent: str | None,
        confidence: float | None,
        conversation_history: list[str],
        business_name: str | None,
        user_name: str | None,
    ) -> str:
        snippets = "\n".join(f"- {snippet}" for snippet in context_snippets[:5]) or "- No extra context provided"
        history_text = "\n".join(f"- {item}" for item in conversation_history[-4:]) or "- No recent conversation context"
        confidence_text = f"{confidence:.2f}" if confidence is not None else "unknown"

        return (
            "You are a warm, practical AI business consultant for local businesses.\n"
            "Write like a human advisor: clear, concise, and helpful. Avoid robotic wording.\n"
            "Use plain English. Ground the response in the provided evidence and mention tradeoffs when relevant.\n"
            "Answer in 3 short parts: direct answer, why it matters, and the next best step.\n"
            "If the question is under-specified, end with one clarifying question instead of pretending.\n\n"
            f"Business: {business_name or 'Local business'}\n"
            f"Owner: {user_name or 'Business owner'}\n"
            f"Intent: {intent or 'business_question'}\n"
            f"Intent confidence: {confidence_text}\n"
            f"Recent conversation:\n{history_text}\n\n"
            f"Question: {question}\n\n"
            f"Evidence snippets:\n{snippets}\n"
        )

    def _parse_email_summary(self, generated_text: str) -> dict[str, str]:
        subject = ""
        body_lines: list[str] = []
        in_body = False

        for raw_line in generated_text.splitlines():
            line = raw_line.strip()
            if not line:
                if in_body:
                    body_lines.append("")
                continue

            if line.lower().startswith("subject:"):
                subject = line.split(":", 1)[1].strip()
                continue

            if line.lower().startswith("body:"):
                in_body = True
                continue

            if in_body:
                body_lines.append(raw_line.rstrip())

        body = "\n".join(body_lines).strip()
        return {"subject": subject, "body": body}

    def _fallback_email_summary(
        self,
        messages: list[dict],
        *,
        business_name: str | None = None,
        user_name: str | None = None,
    ) -> dict[str, str]:
        latest_user_message = next((str(item.get("text", "")).strip() for item in reversed(messages) if item.get("role") == "user"), "")
        latest_assistant_message = next((str(item.get("text", "")).strip() for item in reversed(messages) if item.get("role") == "assistant"), "")
        subject = f"{business_name or 'Business'} growth assistant summary"
        body = (
            f"Hi {user_name or 'there'},\n\n"
            "Here is a short recap of the assistant conversation.\n\n"
            "Key takeaways:\n"
            f"- Latest business question: {latest_user_message or 'Business growth review'}\n"
            f"- Assistant guidance: {latest_assistant_message or 'Reviewed the main growth opportunities.'}\n"
            "- Suggested next step: prioritize the highest-impact fix first, then follow with supporting improvements.\n\n"
            "If you want, I can turn this into a 7-day or 90-day action plan next."
        )
        return {"subject": subject, "body": body}
