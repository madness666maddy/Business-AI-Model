from __future__ import annotations

from backend.app.utils.seed_data import get_swot_matrix


class SwotEngine:
    def analyze(self) -> dict:
        return get_swot_matrix()

