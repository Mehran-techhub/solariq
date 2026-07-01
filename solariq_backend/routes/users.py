import os
from datetime import datetime, timezone

from flask import Blueprint, request, current_app
from flask_jwt_extended import jwt_required
from werkzeug.utils import secure_filename

from services.user_service import UserService
from utils.decorators import get_current_user_id
from utils.response import api_response, api_error
from repositories.user_repository import UserRepository

users_bp = Blueprint("users", __name__)


def _ensure_admin():
    current_id = get_current_user_id()
    user = UserRepository.find_by_id(current_id)
    if not user or user.role != "admin":
        return False
    return True


ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif", "webp"}

def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

@users_bp.route("/profile", methods=["PUT"])
@jwt_required()
def update_profile():
    current_id = get_current_user_id()
    payload = request.get_json() or {}
    if "role" in payload:
        del payload["role"]
    user = UserService.update(current_id, payload)
    return api_response(message="Profile updated", data=user)


@users_bp.route("/profile/photo", methods=["POST"])
@jwt_required()
def upload_profile_photo():
    current_id = get_current_user_id()
    user = UserRepository.find_by_id(current_id)
    if not user:
        return api_error("User not found", status=404)

    if "photo" not in request.files:
        return api_error("No photo file provided", status=422)
    
    file = request.files["photo"]
    if not file.filename or not allowed_file(file.filename):
        return api_error("Invalid file type. Allowed: png, jpg, jpeg, gif, webp", status=422)

    upload_dir = os.path.join(current_app.root_path, "storage", "avatars")
    os.makedirs(upload_dir, exist_ok=True)

    ext = file.filename.rsplit(".", 1)[1].lower()
    filename = f"user_{current_id}_{int(datetime.now(timezone.utc).timestamp())}.{ext}"
    filepath = os.path.join(upload_dir, filename)
    file.save(filepath)

    user.profile_image = f"/uploads/avatars/{filename}"
    from extensions import db
    db.session.commit()

    user_data = user.to_dict()
    user_data.pop("last_login", None)
    return api_response(message="Photo uploaded", data=user_data)


@users_bp.route("", methods=["GET"])
@jwt_required()
def list_users():
    if not _ensure_admin():
        return api_error("Admin required", status=403)
    data = UserService.list_all()
    return api_response(message="Users retrieved", data={"users": data})


@users_bp.route("", methods=["POST"])
@jwt_required()
def create_user():
    if not _ensure_admin():
        return api_error("Admin required", status=403)
    payload = request.get_json() or {}
    user = UserService.create(payload)
    return api_response(message="User created", data=user)


@users_bp.route("/<int:user_id>", methods=["PUT"])
@jwt_required()
def update_user(user_id):
    if not _ensure_admin():
        return api_error("Admin required", status=403)
    payload = request.get_json() or {}
    user = UserService.update(user_id, payload)
    if user is None:
        return api_error("Not found", status=404)
    return api_response(message="User updated", data=user)


@users_bp.route("/profile/photo", methods=["DELETE"])
@jwt_required()
def remove_profile_photo():
    current_id = get_current_user_id()
    user = UserRepository.find_by_id(current_id)
    if not user:
        return api_error("User not found", status=404)
    user.profile_image = None
    from extensions import db
    db.session.commit()
    user_data = user.to_dict()
    user_data.pop("last_login", None)
    return api_response(message="Photo removed", data=user_data)


@users_bp.route("/<int:user_id>", methods=["DELETE"])
@jwt_required()
def delete_user(user_id):
    if not _ensure_admin():
        return api_error("Admin required", status=403)
    ok = UserService.delete(user_id)
    if not ok:
        return api_error("Not found", status=404)
    return api_response(message="User deleted", data={})


