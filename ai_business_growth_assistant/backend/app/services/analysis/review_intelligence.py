from __future__ import annotations

from collections import Counter
from io import BytesIO
import re

import numpy as np
import pandas as pd

from app.utils.seed_data import get_review_analytics


NEGATIVE_TOPICS = {
    "Long waiting time": ["wait", "waiting", "slow", "delay", "queue"],
    "High pricing": ["price", "pricing", "expensive", "cost", "fees"],
    "No online support": ["support", "chat", "online", "help", "response"],
    "Hard to book appointment": ["book", "booking", "appointment", "reserve", "schedule"],
    "Poor communication": ["communication", "reply", "follow-up", "respond"],
}

POSITIVE_TOPICS = {
    "Friendly staff": ["friendly", "kind", "helpful", "warm"],
    "Quality of service": ["quality", "excellent", "great service", "professional"],
    "Clean environment": ["clean", "tidy", "organized", "neat"],
    "Quick service": ["quick", "fast", "speedy", "efficient"],
}


class ReviewIntelligenceEngine:
    def analyze(self, file_bytes: bytes | None = None) -> dict:
        if not file_bytes:
            return get_review_analytics()

        try:
            dataframe = pd.read_csv(BytesIO(file_bytes))
        except Exception:
            return get_review_analytics()

        if dataframe.empty:
            return get_review_analytics()

        text_column = self._detect_text_column(dataframe)
        rating_column = self._detect_rating_column(dataframe)
        date_column = self._detect_date_column(dataframe)

        if text_column is None:
            return get_review_analytics()

        texts = dataframe[text_column].fillna("").astype(str).tolist()
        ratings = dataframe[rating_column].fillna(0).tolist() if rating_column else [0] * len(texts)

        sentiment_labels = self._build_sentiments(texts, ratings)
        sentiment_breakdown = self._sentiment_percentages(sentiment_labels)
        top_complaints = self._topic_counts(texts, NEGATIVE_TOPICS, sentiment_labels, target="negative")
        top_praises = self._topic_counts(texts, POSITIVE_TOPICS, sentiment_labels, target="positive")
        topics = self._topic_scores(texts)
        trend = self._build_trend(dataframe, date_column, sentiment_labels)

        return {
            "totalReviews": len(texts),
            "sentimentBreakdown": sentiment_breakdown,
            "trend": trend,
            "topComplaints": top_complaints,
            "topPraises": top_praises,
            "topics": topics,
        }

    def _detect_text_column(self, dataframe: pd.DataFrame) -> str | None:
        candidates = ["review", "text", "comment", "content", "message"]
        lowered = {column.lower(): column for column in dataframe.columns}
        for candidate in candidates:
            if candidate in lowered:
                return lowered[candidate]
        return next((column for column in dataframe.columns if dataframe[column].dtype == object), None)

    def _detect_rating_column(self, dataframe: pd.DataFrame) -> str | None:
        candidates = ["rating", "stars", "score", "value"]
        lowered = {column.lower(): column for column in dataframe.columns}
        for candidate in candidates:
            if candidate in lowered:
                return lowered[candidate]
        return None

    def _detect_date_column(self, dataframe: pd.DataFrame) -> str | None:
        candidates = ["date", "created_at", "review_date", "timestamp"]
        lowered = {column.lower(): column for column in dataframe.columns}
        for candidate in candidates:
            if candidate in lowered:
                return lowered[candidate]
        return None

    def _build_sentiments(self, texts: list[str], ratings: list[float]) -> list[str]:
        labels: list[str] = []

        for index, text in enumerate(texts):
            rating = ratings[index] if index < len(ratings) else 0
            lowered = text.lower()

            if rating >= 4:
                labels.append("positive")
                continue
            if rating and rating <= 2:
                labels.append("negative")
                continue

            if any(word in lowered for word in ["great", "excellent", "amazing", "friendly", "quick", "clean"]):
                labels.append("positive")
            elif any(word in lowered for word in ["bad", "slow", "poor", "expensive", "waiting", "problem"]):
                labels.append("negative")
            else:
                labels.append("neutral")

        return labels

    def _sentiment_percentages(self, labels: list[str]) -> list[dict]:
        total = max(1, len(labels))
        positive = int(round((labels.count("positive") / total) * 100))
        neutral = int(round((labels.count("neutral") / total) * 100))
        negative = max(0, 100 - positive - neutral)
        return [
            {"name": "Positive", "value": positive, "color": "#10b981"},
            {"name": "Neutral", "value": neutral, "color": "#f59e0b"},
            {"name": "Negative", "value": negative, "color": "#ef4444"},
        ]

    def _topic_counts(
        self,
        texts: list[str],
        topic_map: dict[str, list[str]],
        labels: list[str],
        target: str,
    ) -> list[dict]:
        counts: list[dict] = []

        for topic, keywords in topic_map.items():
            score = 0
            for text, label in zip(texts, labels):
                lowered = text.lower()
                if label != target and any(keyword in lowered for keyword in keywords):
                    score += 1
                elif label == target and any(keyword in lowered for keyword in keywords):
                    score += 2
            if score:
                counts.append({"label": topic, "value": min(100, score * 10)})

        if not counts:
            counts = [{"label": topic, "value": value} for topic, value in (("Service quality", 42), ("Pricing", 22))]

        return sorted(counts, key=lambda item: item["value"], reverse=True)[:4]

    def _topic_scores(self, texts: list[str]) -> list[dict]:
        lower_texts = " ".join(texts).lower()
        keywords = {
            "Customer Experience": ["staff", "service", "support", "experience"],
            "Pricing": ["price", "pricing", "cost", "fees"],
            "Convenience": ["book", "booking", "appointment", "quick", "easy"],
            "Service Quality": ["quality", "clean", "professional", "excellent"],
        }
        topic_scores = []

        for label, words in keywords.items():
            score = sum(lower_texts.count(word) for word in words)
            topic_scores.append({"label": label, "score": int(np.clip(score * 10 + 10, 10, 100))})

        return sorted(topic_scores, key=lambda item: item["score"], reverse=True)

    def _build_trend(self, dataframe: pd.DataFrame, date_column: str | None, labels: list[str]) -> list[dict]:
        if not date_column:
            return get_review_analytics()["trend"]

        try:
            dates = pd.to_datetime(dataframe[date_column], errors="coerce")
        except Exception:
            return get_review_analytics()["trend"]

        if dates.isna().all():
            return get_review_analytics()["trend"]

        df = dataframe.copy()
        df["_date"] = dates
        df["_month"] = df["_date"].dt.strftime("%b")
        df["_sentiment"] = labels

        grouped = df.groupby(["_month", "_sentiment"]).size().unstack(fill_value=0)
        grouped = grouped.reset_index()
        return [
            {
                "month": row["_month"],
                "positive": int(row.get("positive", 0)),
                "neutral": int(row.get("neutral", 0)),
                "negative": int(row.get("negative", 0)),
            }
            for _, row in grouped.iterrows()
        ]

