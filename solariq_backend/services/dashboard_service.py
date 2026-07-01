from datetime import datetime

from models.dashboard import DashboardStats
from repositories.analytics_repository import AnalyticsRepository
from repositories.dashboard_repository import DashboardRepository
from repositories.prediction_repository import PredictionRepository
from repositories.efficiency_repository import EfficiencyRepository
from repositories.recommendation_repository import RecommendationRepository
from repositories.weather_repository import WeatherRepository


class DashboardService:

    @staticmethod
    def _avg(arr):
        return round(sum(arr) / len(arr), 2) if arr else 0

    @staticmethod
    def _calc_efficiency_score(stats, daily_analytics, weekly_analytics):
        score = 100
        reasons = []

        if stats and stats.predicted_yield and stats.modeled_output:
            ratio = stats.modeled_output / stats.predicted_yield
            if ratio < 0.7:
                score -= 20
                reasons.append("Output significantly below prediction")
            elif ratio < 0.85:
                score -= 10
                reasons.append("Output slightly below prediction")

        if daily_analytics and daily_analytics.efficiency:
            avg_eff = DashboardService._avg(daily_analytics.efficiency)
            if avg_eff < 60:
                score -= 15
                reasons.append("Low efficiency trend detected")
            elif avg_eff < 75:
                score -= 5
                reasons.append("Moderate efficiency")

        if weekly_analytics and weekly_analytics.generation:
            if DashboardService._avg(weekly_analytics.generation) < 100:
                score -= 5
                reasons.append("Low weekly generation average")

        score = max(0, min(100, score))
        if score >= 90:
            label = "Excellent"
        elif score >= 75:
            label = "Good"
        elif score >= 50:
            label = "Fair"
        else:
            label = "Needs Attention"

        return {"score": score, "label": label, "reasons": reasons[:3]}

    @staticmethod
    def _calc_benchmark(user_id):
        monthly = AnalyticsRepository.get_by_period(user_id, "monthly")
        weekly = AnalyticsRepository.get_by_period(user_id, "weekly")
        benchmark = {
            "generation_change": None,
            "efficiency_change": None,
            "monthly_generation": 0,
            "weekly_generation": 0,
        }
        if monthly and len(monthly.generation) >= 2:
            prev = monthly.generation[0] or 0
            curr = monthly.generation[-1] or 0
            if prev > 0:
                change = round(((curr - prev) / prev) * 100, 1)
                benchmark["generation_change"] = change
        if weekly and len(weekly.generation) >= 2:
            prev = weekly.generation[0] or 0
            curr = weekly.generation[-1] or 0
            if prev > 0:
                change = round(((curr - prev) / prev) * 100, 1)
                benchmark["efficiency_change"] = change
        if monthly and monthly.generation:
            benchmark["monthly_generation"] = sum(monthly.generation)
        if weekly and weekly.generation:
            benchmark["weekly_generation"] = sum(weekly.generation)
        return benchmark

    @staticmethod
    def _calc_readiness(prediction=None, weather=None):
        score = 75
        factors = []
        if prediction:
            predicted = prediction.get("predicted_output", 0) or 0
            if predicted > 3000:
                score += 15
                factors.append("High predicted generation")
            elif predicted > 1500:
                score += 5
                factors.append("Moderate predicted generation")
            else:
                score -= 10
                factors.append("Low predicted generation")
        if weather:
            clouds = weather.get("cloud_cover", 50) or 50
            if clouds > 70:
                score -= 15
                factors.append("Heavy cloud cover")
            elif clouds > 40:
                score -= 5
                factors.append("Moderate cloud cover")
            else:
                score += 5
                factors.append("Clear skies")
        score = max(0, min(100, score))
        if score >= 80:
            label = "Excellent"
        elif score >= 60:
            label = "Good"
        else:
            label = "Limited"
        return {"score": score, "label": label, "factors": factors[:3]}

    @staticmethod
    def get_stats(user_id):
        stats = DashboardRepository.get_latest(user_id)
        if not stats:
            stats = DashboardRepository.create(DashboardStats(user_id=user_id))

        daily_analytics = AnalyticsRepository.get_by_period(user_id, "daily")
        weekly_analytics = AnalyticsRepository.get_by_period(user_id, "weekly")

        solar_output = daily_analytics.generation if daily_analytics else []
        daily_production = weekly_analytics.generation if weekly_analytics else []

        efficiency = DashboardService._calc_efficiency_score(stats, daily_analytics, weekly_analytics)
        benchmark = DashboardService._calc_benchmark(user_id)

        time_labels = [f"{h}:00" for h in range(6, 19)] if solar_output else []
        daily_labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] if daily_production else []

        return {
            **stats.to_dict(),
            "chart_data": {
                "time_labels": time_labels,
                "solar_output": solar_output,
                "daily_labels": daily_labels,
                "daily_production": daily_production,
            },
            "efficiency_score": efficiency,
            "benchmark": benchmark,
        }

    @staticmethod
    def get_overview(user_id):
        stats = DashboardService.get_stats(user_id)
        predictions = PredictionRepository.list_by_user(user_id, limit=5)
        latest_prediction = predictions[0].to_dict() if predictions else None
        efficiency_items = EfficiencyRepository.list_for_user(user_id, limit=1)
        latest_efficiency = efficiency_items[0].to_dict() if efficiency_items else None
        recommendations = RecommendationRepository.list_for_user(user_id, limit=5)
        weather_items = WeatherRepository.latest(limit=1)
        latest_weather = weather_items[0].to_dict() if weather_items else None

        readiness = DashboardService._calc_readiness(latest_prediction, latest_weather)

        return {
            "stats": stats,
            "todays_prediction": latest_prediction,
            "prediction_history": [p.to_dict() for p in predictions],
            "efficiency": latest_efficiency,
            "weather_summary": latest_weather,
            "recommendations": [r.to_dict() for r in recommendations],
            "solar_readiness": readiness,
            "efficiency_score": stats.get("efficiency_score"),
            "benchmark": stats.get("benchmark"),
        }
