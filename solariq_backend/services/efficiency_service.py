from models.efficiency_score import EfficiencyScore
from repositories.efficiency_repository import EfficiencyRepository
from utils.activity_logger import log_activity


class EfficiencyService:
    @staticmethod
    def list(user_id, limit=100):
        items = EfficiencyRepository.list_for_user(user_id, limit=limit)
        return [i.to_dict() for i in items]

    @staticmethod
    def create(user_id, actual, predicted):
        score = None
        try:
            score_val = (actual / predicted * 100) if predicted else 0
        except Exception:
            score_val = 0
        score = EfficiencyScore(user_id=user_id, actual_output=actual, predicted_output=predicted, efficiency_score=round(score_val, 2))
        EfficiencyRepository.create(score)
        log_activity(user_id, "Efficiency score recorded", "efficiency")
        return score.to_dict()
