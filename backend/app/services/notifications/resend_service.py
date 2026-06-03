from __future__ import annotations

from dataclasses import dataclass
import html

import requests

from backend.app.core.config import settings


@dataclass
class EmailDeliveryResult:
    success: bool
    message: str
    recipient: str | None = None
    subject: str | None = None
    provider_id: str | None = None


class ResendService:
    def __init__(self) -> None:
        self.api_key = settings.resend_api_key
        self.from_email = settings.resend_from_email
        self.reply_to = settings.resend_reply_to_email

    @property
    def enabled(self) -> bool:
        return bool(self.api_key)

    def send_email(
        self,
        recipient: str,
        subject: str,
        body: str,
        html_body: str | None = None,
    ) -> dict:
        if not self.enabled:
            return EmailDeliveryResult(
                success=False,
                message="Resend API key is not configured.",
                recipient=recipient,
                subject=subject,
            ).__dict__

        if not recipient.strip():
            return EmailDeliveryResult(
                success=False,
                message="Recipient email address is required.",
                recipient=recipient,
                subject=subject,
            ).__dict__

        payload: dict[str, object] = {
            "from": self.from_email,
            "to": [recipient],
            "subject": subject,
            "text": body,
            "html": html_body or self._build_html(subject, body),
        }
        if self.reply_to:
            payload["reply_to"] = self.reply_to

        try:
            response = requests.post(
                "https://api.resend.com/emails",
                json=payload,
                headers={
                    "Authorization": f"Bearer {self.api_key}",
                    "Content-Type": "application/json",
                },
                timeout=20,
            )
            if response.ok:
                provider_id = None
                if response.content:
                    try:
                        provider_id = response.json().get("id")
                    except Exception:
                        provider_id = None
                return EmailDeliveryResult(
                    success=True,
                    message="Summary email sent successfully.",
                    recipient=recipient,
                    subject=subject,
                    provider_id=provider_id,
                ).__dict__

            detail = response.text.strip() or f"HTTP {response.status_code}"
            return EmailDeliveryResult(
                success=False,
                message=f"Resend request failed: {detail}",
                recipient=recipient,
                subject=subject,
            ).__dict__
        except Exception as exc:  # pragma: no cover - network / provider failures
            return EmailDeliveryResult(
                success=False,
                message=f"Unable to send email: {exc}",
                recipient=recipient,
                subject=subject,
            ).__dict__

    def _build_html(self, subject: str, body: str) -> str:
        safe_subject = html.escape(subject)
        safe_body = html.escape(body).replace("\n", "<br>")
        return (
            "<div style=\"font-family: Arial, Helvetica, sans-serif; "
            "color: #0f172a; line-height: 1.6;\">"
            f"<h2 style=\"margin: 0 0 12px; font-size: 20px;\">{safe_subject}</h2>"
            f"<div style=\"font-size: 14px;\">{safe_body}</div>"
            "</div>"
        )
