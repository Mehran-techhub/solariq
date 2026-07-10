from extensions import db
from models.analytics import Analytics


class AnalyticsRepository:
    @staticmethod
    def get_by_period(user_id, period):
        return Analytics.query.filter_by(user_id=user_id, period=period).first()

    @staticmethod
    def upsert(record):
        existing = Analytics.query.filter_by(user_id=record.user_id, period=record.period).first()
        if existing:
            existing.generation = record.generation
            existing.consumption = record.consumption
            existing.efficiency = record.efficiency
            db.session.commit()
            return existing
        db.session.add(record)
        db.session.commit()
        return record
