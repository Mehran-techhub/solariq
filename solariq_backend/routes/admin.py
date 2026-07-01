from flask import Blueprint, request
from flask_jwt_extended import jwt_required

from services.admin_service import AdminService
from services.notification_service import NotificationService
from utils.decorators import admin_required, get_current_user_id
from utils.response import api_response, api_error

admin_bp = Blueprint("admin", __name__)


@admin_bp.route("/stats", methods=["GET"])
@jwt_required()
@admin_required
def platform_stats():
    data = AdminService.get_platform_stats()
    return api_response(message="Platform stats retrieved", data=data)


@admin_bp.route("/activity", methods=["GET"])
@jwt_required()
@admin_required
def all_activity():
    data = AdminService.get_all_activity()
    return api_response(message="Activity logs retrieved", data={"logs": data})


@admin_bp.route("/users", methods=["GET"])
@jwt_required()
@admin_required
def all_users():
    data = AdminService.get_all_users()
    return api_response(message="Users retrieved", data={"users": data})


@admin_bp.route("/health", methods=["GET"])
@jwt_required()
@admin_required
def system_health():
    data = AdminService.get_system_health()
    return api_response(message="System health retrieved", data=data)


@admin_bp.route("/settings", methods=["GET"])
@jwt_required()
@admin_required
def system_settings():
    data = AdminService.get_system_settings()
    return api_response(message="Settings retrieved", data=data)


@admin_bp.route("/settings", methods=["PUT"])
@jwt_required()
@admin_required
def update_system_setting():
    payload = request.get_json() or {}
    key = payload.get("key")
    value = payload.get("value")
    if not key:
        return api_error("key is required", status=422)
    data = AdminService.update_system_setting(key, value)
    return api_response(message="Setting updated", data=data)


@admin_bp.route("/notifications", methods=["GET"])
@jwt_required()
@admin_required
def admin_notifications():
    user_id = get_current_user_id()
    data = NotificationService.list_for_user(user_id)
    return api_response(message="Notifications retrieved", data=data)


@admin_bp.route("/notifications/<int:notif_id>/read", methods=["PUT"])
@jwt_required()
@admin_required
def mark_notification_read(notif_id):
    user_id = get_current_user_id()
    result = NotificationService.mark_read(user_id, notif_id)
    if result is None:
        return api_error("Not found", status=404)
    return api_response(message="Marked as read", data=result)


@admin_bp.route("/notifications/read-all", methods=["PUT"])
@jwt_required()
@admin_required
def mark_all_read():
    user_id = get_current_user_id()
    NotificationService.mark_all_read(user_id)
    return api_response(message="All notifications marked as read", data={})


@admin_bp.route("/solar-records", methods=["GET"])
@jwt_required()
@admin_required
def all_solar_records():
    from models.solar_record import SolarRecord
    records = SolarRecord.query.order_by(SolarRecord.record_date.desc()).limit(200).all()
    return api_response(message="All solar records", data={"records": [r.to_dict() for r in records]})


@admin_bp.route("/predictions", methods=["GET"])
@jwt_required()
@admin_required
def all_predictions():
    from models.solar_prediction import SolarPrediction
    predictions = SolarPrediction.query.order_by(SolarPrediction.created_at.desc()).limit(200).all()
    return api_response(message="All predictions", data={"predictions": [p.to_dict() for p in predictions]})


@admin_bp.route("/reports", methods=["GET"])
@jwt_required()
@admin_required
def all_reports():
    from models.report import Report
    reports = Report.query.order_by(Report.generated_at.desc()).limit(200).all()
    return api_response(message="All reports", data={"reports": [r.to_dict() for r in reports]})


@admin_bp.route("/weather", methods=["GET"])
@jwt_required()
@admin_required
def all_weather():
    from models.weather_data import WeatherData
    data = WeatherData.query.order_by(WeatherData.fetched_at.desc()).limit(50).all()
    return api_response(message="All weather data", data={"items": [w.to_dict() for w in data]})