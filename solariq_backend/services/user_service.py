from extensions import bcrypt
from repositories.user_repository import UserRepository
from models.user import User
from utils.activity_logger import log_activity


class UserService:
    @staticmethod
    def list_all():
        return [u.to_dict() for u in User.query.order_by(User.id.desc()).all()]

    @staticmethod
    def create(payload):
        user = User(
            full_name=payload.get("full_name"),
            email=payload.get("email"),
            password_hash=bcrypt.generate_password_hash(payload.get("password", "")).decode("utf-8"),
            phone=payload.get("phone"),
            role=payload.get("role", "user"),
        )
        UserRepository.create(user)
        log_activity(user.id, "User created", "admin")
        return user.to_dict()

    @staticmethod
    def update(user_id, payload):
        user = UserRepository.find_by_id(user_id)
        if not user:
            return None
        if payload.get("full_name"):
            user.full_name = payload.get("full_name")
        if payload.get("phone") is not None:
            user.phone = payload.get("phone")
        if payload.get("profile_image") is not None:
            user.profile_image = payload.get("profile_image")
        if payload.get("installation_type"):
            user.installation_type = payload.get("installation_type")
        if payload.get("role"):
            user.role = payload.get("role")
        if payload.get("password"):
            user.password_hash = bcrypt.generate_password_hash(payload.get("password")).decode("utf-8")
        UserRepository.update(user)
        log_activity(user.id, "User updated", "admin")
        result = user.to_dict()
        result.pop("last_login", None)
        return result

    @staticmethod
    def delete(user_id):
        user = UserRepository.find_by_id(user_id)
        if not user:
            return False
        from extensions import db

        db.session.delete(user)
        db.session.commit()
        log_activity(user_id, "User deleted", "admin")
        return True
