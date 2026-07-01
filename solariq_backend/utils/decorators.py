from functools import wraps

from flask_jwt_extended import get_jwt_identity, verify_jwt_in_request

from utils.response import api_error


def jwt_required_custom(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        try:
            verify_jwt_in_request()
        except Exception:
            return api_error("Authentication required", status=401)
        return fn(*args, **kwargs)

    return wrapper


def admin_required(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        try:
            verify_jwt_in_request()
        except Exception:
            return api_error("Authentication required", status=401)
        from repositories.user_repository import UserRepository
        user_id = get_current_user_id()
        user = UserRepository.find_by_id(user_id)
        if not user or user.role != "admin":
            return api_error("Admin access required", status=403)
        return fn(*args, **kwargs)

    return wrapper


def get_current_user_id():
    identity = get_jwt_identity()
    return int(identity) if identity is not None else None


def get_current_user():
    from repositories.user_repository import UserRepository
    user_id = get_current_user_id()
    return UserRepository.find_by_id(user_id)
