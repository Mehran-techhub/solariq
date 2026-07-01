from flask import Blueprint
from flask_jwt_extended import jwt_required

from services.efficiency_service import EfficiencyService
from utils.decorators import get_current_user_id
from utils.response import api_response

efficiency_bp = Blueprint("efficiency", __name__)


@efficiency_bp.route("", methods=["GET"])
@jwt_required()
def list_efficiency():
    user_id = get_current_user_id()
    data = EfficiencyService.list(user_id)
    return api_response(message="Efficiency data", data={"items": data})
