from flask import Blueprint
from flask_jwt_extended import jwt_required

from services.dashboard_service import DashboardService
from utils.decorators import get_current_user_id
from utils.response import api_response

dashboard_bp = Blueprint("dashboard", __name__)


@dashboard_bp.route("/stats", methods=["GET"])
@jwt_required()
def get_stats():
    user_id = get_current_user_id()
    data = DashboardService.get_stats(user_id)
    return api_response(message="Dashboard stats retrieved", data=data)


@dashboard_bp.route("/overview", methods=["GET"])
@jwt_required()
def get_overview():
    user_id = get_current_user_id()
    data = DashboardService.get_overview(user_id)
    return api_response(message="Dashboard overview retrieved", data=data)
