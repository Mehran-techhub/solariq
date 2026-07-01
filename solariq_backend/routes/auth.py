from flask import Blueprint, request

from schemas.auth_schemas import LoginSchema, RegisterSchema, validate_schema
from services.auth_service import AuthService
from utils.response import api_error, api_response
from utils.security import limiter, sanitize_payload

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/register", methods=["POST"])
@limiter.limit("5 per minute")
def register():
    data, errors = validate_schema(RegisterSchema(), sanitize_payload(request.get_json() or {}))
    if errors:
        return api_error("Validation failed", status=422, data=errors)
    try:
        result = AuthService.register(data)
        return api_response(
            message="Registration successful",
            data=result,
        )
    except ValueError as exc:
        return api_error(str(exc), status=409)


@auth_bp.route("/login", methods=["POST"])
@limiter.limit("10 per minute")
def login():
    data, errors = validate_schema(LoginSchema(), sanitize_payload(request.get_json() or {}))
    if errors:
        return api_error("Validation failed", status=422, data=errors)
    try:
        result = AuthService.login(data)
        return api_response(
            message="Login successful",
            data=result,
        )
    except ValueError as exc:
        return api_error(str(exc), status=401)


@auth_bp.route("/forgot-password", methods=["POST"])
@limiter.limit("3 per minute")
def forgot_password():
    data = sanitize_payload(request.get_json() or {})
    email = (data.get("email") or "").strip().lower()
    if not email:
        return api_error("Email is required", status=422)
    try:
        AuthService.initiate_password_reset(email)
        return api_response(
            message="If an account exists, reset instructions have been prepared.",
            data={"email": email},
        )
    except ValueError as exc:
        return api_error(str(exc), status=400)


@auth_bp.route("/reset-password", methods=["POST"])
def reset_password():
    data = request.get_json() or {}
    token = (data.get("token") or "").strip()
    new_password = (data.get("new_password") or "").strip()
    if not token or not new_password:
        return api_error("Reset token and new password are required", status=422)
    try:
        result = AuthService.reset_password(token, new_password)
        return api_response(message=result["message"], data={"token": token})
    except ValueError as exc:
        return api_error(str(exc), status=400)


@auth_bp.route("/google", methods=["POST"])
def google_login():
    data = request.get_json() or {}
    email = (data.get("email") or "").strip().lower()
    if not email:
        return api_error("Email is required", status=422)
    try:
        result = AuthService.login_with_social(data)
        return api_response(
            message="Google sign-in successful",
            data=result,
        )
    except ValueError as exc:
        return api_error(str(exc), status=401)
