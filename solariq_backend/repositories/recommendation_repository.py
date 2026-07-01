from extensions import db
from models.recommendation import Recommendation


class RecommendationRepository:
    @staticmethod
    def create(rec):
        db.session.add(rec)
        db.session.commit()
        return rec

    @staticmethod
    def list_for_user(user_id, limit=50):
        return Recommendation.query.filter_by(user_id=user_id).order_by(Recommendation.created_at.desc()).limit(limit).all()
