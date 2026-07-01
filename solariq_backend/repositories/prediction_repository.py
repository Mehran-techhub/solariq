from extensions import db
from models.solar_prediction import SolarPrediction, PredictionLog


class PredictionRepository:
    @staticmethod
    def create(prediction):
        db.session.add(prediction)
        db.session.commit()
        return prediction

    @staticmethod
    def list_by_user(user_id, limit=20):
        return (
            SolarPrediction.query.filter_by(user_id=user_id)
            .order_by(SolarPrediction.created_at.desc())
            .limit(limit)
            .all()
        )

    @staticmethod
    def get_by_id(prediction_id):
        return SolarPrediction.query.get(prediction_id)

    @staticmethod
    def delete(prediction):
        db.session.delete(prediction)
        db.session.commit()

    @staticmethod
    def list_all(limit=100):
        return (
            SolarPrediction.query
            .order_by(SolarPrediction.created_at.desc())
            .limit(limit)
            .all()
        )

    @staticmethod
    def create_log(log_entry):
        db.session.add(log_entry)
        db.session.commit()
        return log_entry
