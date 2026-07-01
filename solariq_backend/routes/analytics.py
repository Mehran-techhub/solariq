from flask import Blueprint
from flask_jwt_extended import jwt_required

from services.analytics_service import AnalyticsService
from utils.decorators import get_current_user_id
from utils.response import api_response

analytics_bp = Blueprint("analytics", __name__)


@analytics_bp.route("/daily", methods=["GET"])
@jwt_required()
def daily():
    user_id = get_current_user_id()
    data = AnalyticsService.get_period_data(user_id, "daily")
    return api_response(message="Daily analytics retrieved", data=data)


@analytics_bp.route("/weekly", methods=["GET"])
@jwt_required()
def weekly():
    user_id = get_current_user_id()
    data = AnalyticsService.get_period_data(user_id, "weekly")
    return api_response(message="Weekly analytics retrieved", data=data)


@analytics_bp.route("/monthly", methods=["GET"])
@jwt_required()
def monthly():
    user_id = get_current_user_id()
    data = AnalyticsService.get_period_data(user_id, "monthly")
    return api_response(message="Monthly analytics retrieved", data=data)
