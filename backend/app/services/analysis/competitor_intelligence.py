from __future__ import annotations

from backend.app.schemas.analysis import normalize_url
from backend.app.utils.seed_data import get_competitor_intelligence


class CompetitorIntelligenceEngine:
    def analyze(self, urls: list[str] | None = None) -> dict:
        analysis = get_competitor_intelligence()
        normalized_urls = [normalize_url(url) for url in (urls or []) if str(url).strip()]

        if normalized_urls:
            analysis["competitors"] = [
                {
                    "name": f"Competitor {index + 1}",
                    "url": url.replace("https://", "").replace("http://", ""),
                }
                for index, url in enumerate(normalized_urls[:3])
            ]

        return analysis

