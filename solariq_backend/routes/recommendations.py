from flask import Blueprint, request
from flask_jwt_extended import jwt_required

from services.recommendation_service import RecommendationService
from utils.decorators import get_current_user_id
from utils.response import api_response, api_error

recommendations_bp = Blueprint("recommendations", __name__)


@recommendations_bp.route("", methods=["GET"])
@jwt_required()
def list_recommendations():
    user_id = get_current_user_id()
    data = RecommendationService.list(user_id)
    return api_response(message="Recommendations retrieved", data={"recommendations": data})


@recommendations_bp.route("", methods=["POST"])
@jwt_required()
def create_recommendation():
    user_id = get_current_user_id()
    payload = request.get_json() or {}
    text = payload.get("text")
    if not text:
        return api_error("Validation failed", status=422)
    rec = RecommendationService.create(user_id, text)
    return api_response(message="Recommendation created", data=rec)
