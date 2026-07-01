from flask import Blueprint, request
from flask_jwt_extended import jwt_required

from services.maintenance_service import MaintenanceService
from utils.decorators import get_current_user_id
from utils.response import api_response, api_error

maintenance_bp = Blueprint("maintenance", __name__)


@maintenance_bp.route("", methods=["GET"])
@jwt_required()
def list_alerts():
    user_id = get_current_user_id()
    data = MaintenanceService.list(user_id)
    return api_response(message="Maintenance alerts", data={"alerts": data})


@maintenance_bp.route("", methods=["POST"])
@jwt_required()
def create_alert():
    user_id = get_current_user_id()
    payload = request.get_json() or {}
    msg = payload.get("message")
    if not msg:
        return api_error("Validation failed", status=422)
    a = MaintenanceService.create(user_id, msg)
    return api_response(message="Alert created", data=a)


@maintenance_bp.route("/<int:alert_id>", methods=["PUT"])
@jwt_required()
def update_alert(alert_id):
    user_id = get_current_user_id()
    payload = request.get_json() or {}
    status = payload.get("status")
    if not status:
        return api_error("Validation failed", status=422)
    a = MaintenanceService.update_status(user_id, alert_id, status)
    if a is None:
        return api_error("Not found or unauthorized", status=404)
    return api_response(message="Alert updated", data=a)
