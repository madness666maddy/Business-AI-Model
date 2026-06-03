from __future__ import annotations

import re
from urllib.parse import urlparse

import requests
from bs4 import BeautifulSoup

from backend.app.schemas.analysis import normalize_url

CTA_KEYWORDS = [
    "book",
    "appointment",
    "contact",
    "call now",
    "get quote",
    "schedule",
    "reserve",
    "start",
]


class WebsiteAnalyzer:
    def analyze(self, url: str, business_name: str | None = None, ocr_text: str | None = None) -> dict:
        normalized_url = normalize_url(url)
        analysis = self._empty_analysis(normalized_url, business_name)
        ocr_insights = self._extract_ocr_insights(ocr_text) if ocr_text else []

        try:
            response = requests.get(
                normalized_url,
                timeout=12,
                headers={"User-Agent": "Mozilla/5.0 (AI Business Growth Assistant)"},
            )
            response.raise_for_status()
            html = response.text
            soup = BeautifulSoup(html, "html.parser")
            page_text = soup.get_text(" ", strip=True)

            title = soup.title.string.strip() if soup.title and soup.title.string else ""
            meta_description = ""
            meta_tag = soup.find("meta", attrs={"name": re.compile("^description$", re.I)})
            if meta_tag and meta_tag.get("content"):
                meta_description = meta_tag["content"].strip()

            h1_count = len(soup.find_all("h1"))
            schema_present = bool(soup.find("script", attrs={"type": "application/ld+json"}))
            cta_texts = self._extract_cta_texts(soup)
            contact_signals = self._extract_contact_signals(page_text)
            service_signals = self._extract_service_signals(soup, page_text)

            if ocr_insights:
                contact_signals = self._merge_unique(contact_signals, [item for item in ocr_insights if "contact" in item.lower() or "phone" in item.lower() or "email" in item.lower()])
                cta_texts = self._merge_unique(cta_texts, [item for item in ocr_insights if "cta" in item.lower() or "call" in item.lower() or "book" in item.lower() or "contact" in item.lower()])
                service_signals = self._merge_unique(service_signals, [item for item in ocr_insights if "service" in item.lower() or "faq" in item.lower() or "trust" in item.lower()])

            score = 60
            score += 10 if title else 0
            score += 10 if meta_description else 0
            score += min(10, h1_count * 4)
            score += 10 if contact_signals else 0
            score += 10 if cta_texts else 0
            score += 5 if schema_present else 0
            score += min(8, len(ocr_insights) * 2)
            score = max(0, min(100, score))

            analysis["score"] = score
            analysis["seoMetrics"] = [
                {"label": "Meta title", "value": "Present" if title else "Missing"},
                {"label": "Meta description", "value": "Present" if meta_description else "Missing"},
                {"label": "H1 tags", "value": f"{h1_count} detected"},
                {"label": "Schema markup", "value": "Detected" if schema_present else "Not detected"},
                {"label": "CTA density", "value": "Strong" if cta_texts else "Low"},
                {"label": "Mobile friendliness", "value": "Requires visual QA"},
            ]
            analysis["contactSignals"] = contact_signals
            analysis["ctaFindings"] = cta_texts
            analysis["serviceFindings"] = service_signals
            analysis["ocrInsights"] = ocr_insights
            analysis["opportunities"] = self._build_opportunities(title, meta_description, schema_present, cta_texts, service_signals)
            if ocr_insights:
                analysis["opportunities"] = self._merge_unique(
                    analysis["opportunities"],
                    [f"OCR insight: {item}" for item in ocr_insights[:2]],
                )
            return analysis
        except Exception:
            if ocr_insights:
                analysis["ocrInsights"] = ocr_insights
            return analysis

    def _extract_cta_texts(self, soup: BeautifulSoup) -> list[str]:
        candidates: list[str] = []

        for element in soup.find_all(["a", "button"]):
            text = element.get_text(" ", strip=True)
            if text and any(keyword in text.lower() for keyword in CTA_KEYWORDS):
                candidates.append(text)

        return candidates[:5]

    def _extract_contact_signals(self, page_text: str) -> list[str]:
        signals: list[str] = []
        if re.search(r"\b[\w.+-]+@[\w-]+\.[\w.-]+\b", page_text):
            signals.append("Email link detected")
        if re.search(r"(\+?\d[\d\s().-]{7,}\d)", page_text):
            signals.append("Phone number detected")
        if "contact" in page_text.lower():
            signals.append("Contact information visible on the site")
        return signals

    def _extract_service_signals(self, soup: BeautifulSoup, page_text: str) -> list[str]:
        signals: list[str] = []
        lower_text = page_text.lower()

        if "faq" not in lower_text:
            signals.append("No FAQ module found on the main page")
        if not any(keyword in lower_text for keyword in ["service", "services", "solutions"]):
            signals.append("Service pages are not strongly signposted")
        if not any(keyword in lower_text for keyword in ["testimonial", "review", "customer story"]):
            signals.append("Trust signals could be stronger on service pages")

        nav_links = [link.get_text(" ", strip=True).lower() for link in soup.find_all("a")]
        if not any("blog" in text for text in nav_links):
            signals.append("No blog or resource hub detected")

        return signals[:5]

    def _build_opportunities(
        self,
        title: str,
        meta_description: str,
        schema_present: bool,
        cta_texts: list[str],
        service_signals: list[str],
    ) -> list[str]:
        opportunities: list[str] = []
        if not meta_description:
            opportunities.append("Add meta descriptions to high-traffic pages")
        if not schema_present:
            opportunities.append("Add local business schema markup")
        if len(cta_texts) < 2:
            opportunities.append("Increase CTA density above the fold")
        if service_signals:
            opportunities.extend(service_signals[:2])
        if not title:
            opportunities.append("Improve title tags for search visibility")
        return opportunities[:5]

    def _empty_analysis(self, url: str, business_name: str | None = None) -> dict:
        return {
            "url": url,
            "score": 0,
            "subtitle": f"Ready to analyze {business_name or urlparse(url).netloc or 'this website'}",
            "seoMetrics": [],
            "contactSignals": [],
            "ctaFindings": [],
            "serviceFindings": [],
            "ocrInsights": [],
            "opportunities": [],
        }

    def _extract_ocr_insights(self, ocr_text: str | None) -> list[str]:
        if not ocr_text:
            return []

        text = ocr_text.strip()
        if not text:
            return []

        lowered = text.lower()
        insights: list[str] = []

        if any(keyword in lowered for keyword in ["book now", "schedule", "call now", "contact us", "get quote"]):
            insights.append("OCR detected strong call-to-action language")
        if re.search(r"\b[\w.+-]+@[\w-]+\.[\w.-]+\b", text):
            insights.append("OCR detected an email address")
        if re.search(r"(\+?\d[\d\s().-]{7,}\d)", text):
            insights.append("OCR detected a phone number")
        if any(keyword in lowered for keyword in ["service", "services", "pricing", "faq", "testimonial"]):
            insights.append("OCR detected service or trust content")
        if "contact" in lowered or "about us" in lowered:
            insights.append("OCR detected contact or brand information")
        if len(insights) < 2 and len(text.split()) > 20:
            insights.append("OCR extracted page copy that can improve the website analysis")

        return insights[:5]

    def _merge_unique(self, first: list[str], second: list[str]) -> list[str]:
        merged = list(first)
        for item in second:
            if item and item not in merged:
                merged.append(item)
        return merged[:8]
