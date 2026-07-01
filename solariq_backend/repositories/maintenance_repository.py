from extensions import db
from models.maintenance_alert import MaintenanceAlert


class MaintenanceRepository:
    @staticmethod
    def create(alert):
        db.session.add(alert)
        db.session.commit()
        return alert

    @staticmethod
    def list_for_user(user_id, limit=50):
        return MaintenanceAlert.query.filter_by(user_id=user_id).order_by(MaintenanceAlert.created_at.desc()).limit(limit).all()

    @staticmethod
    def find_by_id(alert_id):
        return MaintenanceAlert.query.get(alert_id)

    @staticmethod
    def update(alert):
        db.session.commit()
        return alert
