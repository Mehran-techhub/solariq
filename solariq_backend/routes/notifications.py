from flask import Blueprint, request
from flask_jwt_extended import jwt_required

from services.notification_service import NotificationService
from utils.decorators import get_current_user_id
from utils.response import api_response, api_error

notifications_bp = Blueprint("notifications", __name__)


@notifications_bp.route("", methods=["GET"])
@jwt_required()
def list_notifications():
    user_id = get_current_user_id()
    data = NotificationService.list_for_user(user_id)
    return api_response(message="Notifications retrieved", data=data)


@notifications_bp.route("/<int:notif_id>/read", methods=["PUT"])
@jwt_required()
def mark_notification_read(notif_id):
    user_id = get_current_user_id()
    result = NotificationService.mark_read(user_id, notif_id)
    if result is None:
        return api_error("Not found", status=404)
    return api_response(message="Marked as read", data=result)


@notifications_bp.route("/read-all", methods=["PUT"])
@jwt_required()
def mark_all_read():
    user_id = get_current_user_id()
    NotificationService.mark_all_read(user_id)
    return api_response(message="All notifications marked as read", data={})