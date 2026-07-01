from flask import Blueprint, request
from flask_jwt_extended import jwt_required

from schemas.auth_schemas import validate_schema
from schemas.settings_schemas import SettingsUpdateSchema
from services.settings_service import SettingsService
from utils.decorators import get_current_user_id
from utils.response import api_error, api_response

settings_bp = Blueprint("settings", __name__)


@settings_bp.route("", methods=["GET"])
@jwt_required()
def get_settings():
    user_id = get_current_user_id()
    data = SettingsService.get(user_id)
    return api_response(message="Settings retrieved successfully", data=data)


@settings_bp.route("", methods=["PUT"])
@jwt_required()
def update_settings():
    payload, errors = validate_schema(
        SettingsUpdateSchema(), request.get_json() or {}, partial=True
    )
    if errors:
        return api_error("Validation failed", status=422, data=errors)
    user_id = get_current_user_id()
    data = SettingsService.update(user_id, payload)
    return api_response(message="Settings saved successfully", data=data)
