from __future__ import annotations


class PriorityScoringEngine:
    impact_map = {"High": 3, "Medium": 2, "Low": 1}
    effort_map = {"Low": 1, "Medium": 2, "High": 3}

    def score(self, impact: str, effort: str) -> int:
        impact_value = self.impact_map.get(impact, 2)
        effort_value = self.effort_map.get(effort, 2)
        raw_score = 40 + (impact_value * 18) - (effort_value * 10)
        return max(30, min(100, int(raw_score)))

