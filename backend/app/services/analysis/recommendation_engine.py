from __future__ import annotations

from backend.app.services.analysis.priority_engine import PriorityScoringEngine
from backend.app.utils.seed_data import get_recommendations


class RecommendationEngine:
    def __init__(self) -> None:
        self.priority_engine = PriorityScoringEngine()

    def generate(self) -> list[dict]:
        recommendations = get_recommendations()

        for item in recommendations:
            item["priorityScore"] = self.priority_engine.score(item["impact"], item["effort"])

        return sorted(recommendations, key=lambda item: item["priorityScore"], reverse=True)

    def build_action_plan(self) -> list[dict]:
        recommendations = self.generate()
        action_plan = []

        for index, item in enumerate(recommendations, start=1):
            action_plan.append(
                {
                    "rank": index,
                    "title": item["title"],
                    "impact": item["impact"],
                    "effort": item["effort"],
                    "score": item["priorityScore"],
                    "due": "Week 1" if index == 1 else "Week 2-3" if index == 2 else "Month 1",
                    "owner": "Growth Team" if index < 3 else "Marketing",
                    "status": item["evidence"],
                }
            )

        return action_plan

