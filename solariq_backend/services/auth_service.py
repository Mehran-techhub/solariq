import secrets
from datetime import datetime, timedelta, timezone
from utils.pkt_timezone import PKT

from flask import current_app
from flask_jwt_extended import create_access_token

from extensions import bcrypt, db
from utils.security import validate_password_strength
from models.dashboard import DashboardStats
from models.analytics import Analytics
from models.settings import UserSettings
from models.user import User
from repositories.user_repository import UserRepository
from utils.activity_logger import log_activity


class AuthService:
    @staticmethod
    def register(data):
        email = data["email"].lower().strip()
        if UserRepository.find_by_email(email):
            raise ValueError("Email already registered")

        pwd_error = validate_password_strength(data["password"])
        if pwd_error:
            raise ValueError(pwd_error)

        user = User(
            full_name=data["full_name"].strip(),
            email=email,
            password_hash=bcrypt.generate_password_hash(data["password"]).decode("utf-8"),
            phone=data.get("phone"),
            installation_type=data.get("installation_type", "homeowner"),
            role=data.get("role", "user"),
        )
        UserRepository.create(user)
        AuthService._bootstrap_user_data(user.id)
        log_activity(user.id, "User registered", "auth")
        token = create_access_token(identity=str(user.id))
        return {"token": token, "user": user.to_dict()}

    @staticmethod
    def login(data):
        user = UserRepository.find_by_email(data["email"])
        if not user or not bcrypt.check_password_hash(user.password_hash, data["password"]):
            raise ValueError("Invalid email or password")
        if not user.is_active:
            raise ValueError("Account is deactivated")

        previous_last_login = user.last_login
        user.last_login = datetime.now(timezone.utc)
        UserRepository.update(user)
        log_activity(user.id, "User logged in", "auth")
        token = create_access_token(identity=str(user.id))
        user_dict = user.to_dict()
        user_dict["last_login"] = (
            previous_last_login.replace(tzinfo=timezone.utc).astimezone(PKT).isoformat() if previous_last_login else None
        )
        return {"token": token, "user": user_dict}

    @staticmethod
    def login_with_social(data):
        email = data["email"].lower().strip()
        full_name = (data.get("full_name") or email.split("@", 1)[0]).strip()
        user = UserRepository.find_by_email(email)
        if user:
            if not user.is_active:
                raise ValueError("Account is deactivated")
            previous_last_login = user.last_login
            user.last_login = datetime.now(timezone.utc)
            UserRepository.update(user)
            log_activity(user.id, "Social login", "auth")
            token = create_access_token(identity=str(user.id))
            user_dict = user.to_dict()
            user_dict["last_login"] = (
                previous_last_login.replace(tzinfo=timezone.utc).astimezone(PKT).isoformat() if previous_last_login else None
            )
            return {"token": token, "user": user_dict}

        user = User(
            full_name=full_name,
            email=email,
            password_hash=bcrypt.generate_password_hash(secrets.token_urlsafe(24)).decode("utf-8"),
            role=data.get("role", "user"),
        )
        UserRepository.create(user)
        AuthService._bootstrap_user_data(user.id)
        log_activity(user.id, "Social account created", "auth")
        token = create_access_token(identity=str(user.id))
        return {"token": token, "user": user.to_dict()}

    @staticmethod
    def initiate_password_reset(email):
        user = UserRepository.find_by_email(email)
        if not user:
            return None
        if not user.is_active:
            raise ValueError("Account is deactivated")

        token = secrets.token_urlsafe(24)
        user.reset_token = token
        user.reset_token_expires_at = datetime.now(timezone.utc) + timedelta(minutes=30)
        UserRepository.update(user)
        return token

    @staticmethod
    def reset_password(token, new_password):
        if not token:
            raise ValueError("Reset token is required")
        pwd_error = validate_password_strength(new_password)
        if pwd_error:
            raise ValueError(pwd_error)

        user = User.query.filter_by(reset_token=token).first()
        if not user or not user.reset_token_expires_at:
            raise ValueError("Reset token is invalid")
        if user.reset_token_expires_at < datetime.now(timezone.utc):
            raise ValueError("Reset token has expired")

        user.password_hash = bcrypt.generate_password_hash(new_password).decode("utf-8")
        user.reset_token = None
        user.reset_token_expires_at = None
        UserRepository.update(user)
        log_activity(user.id, "Password reset", "auth")
        return {"message": "Password reset successful"}

    @staticmethod
    def _bootstrap_user_data(user_id):
        db.session.add(
            DashboardStats(
                user_id=user_id,
                modeled_output=0.0,
                predicted_yield=0.0,
                optimization_score=0.0,
                estimated_savings=0.0,
            )
        )
        db.session.add(
            UserSettings(
                user_id=user_id,
                theme="dark",
                notifications=True,
                email_alerts=True,
                timezone="Asia/Karachi",
            )
        )
        for period, payload in AuthService._default_analytics().items():
            db.session.add(
                Analytics(
                    user_id=user_id,
                    period=period,
                    generation=payload["generation"],
                    consumption=payload["consumption"],
                    efficiency=payload["efficiency"],
                )
            )
        db.session.commit()

    @staticmethod
    def _default_analytics():
        return {
            "daily": {
                "generation": [0, 0, 0, 0, 0, 0],
                "consumption": [0, 0, 0, 0, 0, 0],
                "efficiency": [0, 0, 0, 0, 0, 0],
            },
            "weekly": {
                "generation": [0, 0, 0, 0, 0, 0, 0],
                "consumption": [0, 0, 0, 0, 0, 0, 0],
                "efficiency": [0, 0, 0, 0, 0, 0, 0],
            },
            "monthly": {
                "generation": [0, 0, 0, 0],
                "consumption": [0, 0, 0, 0],
                "efficiency": [0, 0, 0, 0],
            },
        }
