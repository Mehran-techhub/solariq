from extensions import db
from models.solar_record import SolarRecord


class SolarRepository:
    @staticmethod
    def create(record):
        db.session.add(record)
        db.session.commit()
        return record

    @staticmethod
    def find_by_id(rec_id):
        return SolarRecord.query.get(rec_id)

    @staticmethod
    def list_for_user(user_id, limit=100):
        return SolarRecord.query.filter_by(user_id=user_id).order_by(SolarRecord.record_date.desc()).limit(limit).all()

    @staticmethod
    def delete(record):
        db.session.delete(record)
        db.session.commit()
