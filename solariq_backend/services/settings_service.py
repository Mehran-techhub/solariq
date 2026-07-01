from models.settings import UserSettings
from repositories.settings_repository import SettingsRepository
from utils.activity_logger import log_activity


class SettingsService:
    @staticmethod
    def get(user_id):
        settings = SettingsRepository.get_by_user(user_id)
        if not settings:
            settings = SettingsRepository.create(
                UserSettings(user_id=user_id)
            )
        return settings.to_dict()

    @staticmethod
    def update(user_id, data):
        settings = SettingsRepository.get_by_user(user_id)
        if not settings:
            settings = UserSettings(user_id=user_id)
            SettingsRepository.create(settings)

        for field in ("theme", "notifications", "email_alerts", "timezone", "openweather_api_key"):
            if field in data and data[field] is not None:
                setattr(settings, field, data[field])

        SettingsRepository.update(settings)
        log_activity(user_id, "Settings updated", "settings")
        return settings.to_dict()
