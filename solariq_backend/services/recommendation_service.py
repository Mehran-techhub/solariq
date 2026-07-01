from models.recommendation import Recommendation
from repositories.recommendation_repository import RecommendationRepository
from utils.activity_logger import log_activity


class RecommendationService:
    @staticmethod
    def list(user_id, limit=50):
        recs = RecommendationRepository.list_for_user(user_id, limit=limit)
        return [r.to_dict() for r in recs]

    @staticmethod
    def create(user_id, text):
        rec = Recommendation(user_id=user_id, recommendation_text=text)
        RecommendationRepository.create(rec)
        log_activity(user_id, "Recommendation created", "recommendation")
        return rec.to_dict()
