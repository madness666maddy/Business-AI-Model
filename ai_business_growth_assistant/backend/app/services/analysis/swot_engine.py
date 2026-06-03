from __future__ import annotations

from app.utils.seed_data import get_swot_matrix


class SwotEngine:
    def analyze(self) -> dict:
        return get_swot_matrix()

