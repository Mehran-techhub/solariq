from extensions import db
from models.efficiency_score import EfficiencyScore


class EfficiencyRepository:
    @staticmethod
    def create(score):
        db.session.add(score)
        db.session.commit()
        return score

    @staticmethod
    def list_for_user(user_id, limit=100):
        return EfficiencyScore.query.filter_by(user_id=user_id).order_by(EfficiencyScore.id.desc()).limit(limit).all()
