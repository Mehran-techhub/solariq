from repositories.analytics_repository import AnalyticsRepository
from services.auth_service import AuthService


class AnalyticsService:
    PERIOD_MAP = {
        "daily": "daily",
        "weekly": "weekly",
        "monthly": "monthly",
    }

    LABELS = {
        "daily": ["6AM", "9AM", "12PM", "3PM", "6PM", "9PM"],
        "weekly": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        "monthly": ["Week 1", "Week 2", "Week 3", "Week 4"],
    }

    @staticmethod
    def _avg(arr):
        return round(sum(arr) / len(arr), 2) if arr else 0

    @staticmethod
    def _max_idx(arr):
        return arr.index(max(arr)) if arr else -1

    @staticmethod
    def _min_idx(arr):
        return arr.index(min(arr)) if arr else -1

    @staticmethod
    def get_period_data(user_id, period_key):
        period = AnalyticsService.PERIOD_MAP.get(period_key, period_key)
        record = AnalyticsRepository.get_by_period(user_id, period)
        if record:
            generation = record.generation or []
            consumption = record.consumption or []
            efficiency = record.efficiency or []
        else:
            generation = []
            consumption = []
            efficiency = []

        labels = []
        load_distribution = AnalyticsService._load_distribution(generation, consumption)

        avg_gen = AnalyticsService._avg(generation)
        avg_eff = AnalyticsService._avg(efficiency)
        peak_idx = AnalyticsService._max_idx(generation)
        low_idx = AnalyticsService._min_idx(efficiency)

        insights = []
        if avg_gen > 0:
            insights.append(f"Average generation: {avg_gen} W")
        if avg_eff > 0:
            insights.append(f"Average efficiency: {avg_eff}%")
        if peak_idx >= 0 and peak_idx < len(labels):
            insights.append(f"Peak generation: {labels[peak_idx]}")
        if low_idx >= 0 and low_idx < len(labels):
            insights.append(f"Lowest efficiency: {labels[low_idx]}")
        if avg_eff > 0:
            if avg_eff >= 80:
                insights.append("Efficiency is excellent")
            elif avg_eff >= 60:
                insights.append("Efficiency is good")
            else:
                insights.append("Efficiency needs improvement")

        return {
            "labels": labels,
            "generation": generation,
            "consumption": consumption,
            "efficiency": efficiency,
            "load_distribution": load_distribution,
            "insights": insights,
            "averages": {
                "generation": avg_gen,
                "efficiency": avg_eff,
            },
            "peak_label": labels[peak_idx] if peak_idx >= 0 and peak_idx < len(labels) else None,
        }

    @staticmethod
    def _load_distribution(generation, consumption):
        if not generation and not consumption:
            return [0, 0, 0]
        gen_sum = sum(generation) if generation else 0
        con_sum = sum(consumption) if consumption else 0
        total = gen_sum + con_sum
        if total == 0:
            return [0, 0, 0]
        solar_pct = round((gen_sum / total) * 100)
        grid_pct = 100 - solar_pct
        return [solar_pct, grid_pct, 0]
