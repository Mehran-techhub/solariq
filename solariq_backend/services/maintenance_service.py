from models.maintenance_alert import MaintenanceAlert
from repositories.maintenance_repository import MaintenanceRepository
from utils.activity_logger import log_activity


class MaintenanceService:
    @staticmethod
    def list(user_id, limit=50):
        alerts = MaintenanceRepository.list_for_user(user_id, limit=limit)
        return [a.to_dict() for a in alerts]

    @staticmethod
    def create(user_id, message):
        a = MaintenanceAlert(user_id=user_id, alert_message=message)
        MaintenanceRepository.create(a)
        log_activity(user_id, "Maintenance alert created", "maintenance")
        return a.to_dict()

    @staticmethod
    def update_status(user_id, alert_id, status):
        a = MaintenanceRepository.find_by_id(alert_id)
        if not a or a.user_id != user_id:
            return None
        a.status = status
        MaintenanceRepository.update(a)
        log_activity(user_id, "Maintenance alert updated", "maintenance")
        return a.to_dict()
