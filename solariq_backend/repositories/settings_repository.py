from extensions import db
from models.settings import UserSettings


class SettingsRepository:
    @staticmethod
    def get_by_user(user_id):
        return UserSettings.query.filter_by(user_id=user_id).first()

    @staticmethod
    def create(settings):
        db.session.add(settings)
        db.session.commit()
        return settings

    @staticmethod
    def update(settings):
        db.session.commit()
        return settings
