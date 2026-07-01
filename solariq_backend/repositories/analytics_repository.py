from extensions import db
from models.analytics import Analytics


class AnalyticsRepository:
    @staticmethod
    def get_by_period(user_id, period):
        return Analytics.query.filter_by(user_id=user_id, period=period).first()

    @staticmethod
    def upsert(record):
        db.session.add(record)
        db.session.commit()
        return record
