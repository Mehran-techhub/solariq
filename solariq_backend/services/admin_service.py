from datetime import datetime, timedelta, timezone


from extensions import db
from models.user import User
from models.activity_log import ActivityLog
from models.dashboard import DashboardStats
from models.solar_record import SolarRecord
from models.report import Report
from models.system_setting import SystemSetting
from repositories.user_repository import UserRepository
from utils.activity_logger import log_activity


class AdminService:
    @staticmethod
    def get_platform_stats():
        total_users = User.query.count()
        active_today = User.query.filter(
            User.last_login >= datetime.now(timezone.utc) - timedelta(days=1)
        ).count()
        total_solar_records = SolarRecord.query.count()
        total_reports = Report.query.count()
        recent_logins = (
            User.query.filter(User.last_login.isnot(None))
            .order_by(User.last_login.desc())
            .limit(5)
            .all()
        )
        return {
            "total_users": total_users,
            "active_today": active_today,
            "total_solar_records": total_solar_records,
            "total_reports": total_reports,
            "recent_logins": [
                {
                    "id": u.id,
                    "full_name": u.full_name,
                    "email": u.email,
                    "last_login": u.last_login.isoformat() if u.last_login else None,
                }
                for u in recent_logins
            ],
        }

    @staticmethod
    def get_all_activity(limit=100):
        logs = (
            ActivityLog.query
            .order_by(ActivityLog.timestamp.desc())
            .limit(limit)
            .all()
        )
        return [l.to_dict() for l in logs]

    @staticmethod
    def get_system_settings():
        settings = SystemSetting.query.all()
        return {s.setting_key: s.setting_value for s in settings}

    @staticmethod
    def update_system_setting(key, value):
        setting = SystemSetting.query.filter_by(setting_key=key).first()
        if setting:
            setting.setting_value = value
        else:
            setting = SystemSetting(setting_key=key, setting_value=value)
            db.session.add(setting)
        db.session.commit()
        log_activity(0, f"System setting '{key}' updated", "admin")
        return {"setting_key": key, "setting_value": value}

    @staticmethod
    def get_system_health():
        db_status = "unknown"
        try:
            from sqlalchemy import text
            db.session.execute(text("SELECT 1"))
            db_status = "connected"
        except Exception as exc:
            db_status = f"error: {exc}"

        import os
        ml_model_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "ml_models", "solar_model.pkl")
        prediction_service_ready = os.path.exists(ml_model_path) if os.path.exists(os.path.join(os.path.dirname(os.path.dirname(__file__)), "ml_models")) else False

        from flask import current_app
        weather_api_key = current_app.config.get("OPENWEATHER_API_KEY", "") or os.getenv("OPENWEATHER_API_KEY", "")
        weather_api_ready = bool(weather_api_key) and len(weather_api_key) > 5

        return {
            "database": db_status,
            "api": "running",
            "prediction_service_ready": prediction_service_ready,
            "weather_api_ready": weather_api_ready,
            "timestamp": datetime.now(timezone.utc).isoformat(),
        }

    @staticmethod
    def get_all_users():
        users = User.query.order_by(User.id.desc()).all()
        return [u.to_dict() for u in users]