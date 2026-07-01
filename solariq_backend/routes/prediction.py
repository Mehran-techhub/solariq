import json
from flask import Blueprint, request
from flask_jwt_extended import jwt_required

from schemas.auth_schemas import validate_schema
from schemas.prediction_schemas import PredictionRequestSchema
from services.recommendation_service import RecommendationService
from services.prediction_service import PredictionService
from utils.decorators import get_current_user_id
from utils.response import api_error, api_response

prediction_bp = Blueprint("prediction", __name__)


@prediction_bp.route("/predictions", methods=["GET"])
@jwt_required()
def list_predictions():
    user_id = get_current_user_id()
    predictions = PredictionService.get_history(user_id, limit=50)
    return api_response(message="Predictions retrieved", data={"predictions": predictions})


@prediction_bp.route("/predictions", methods=["POST"])
@jwt_required()
def create_prediction():
    data, errors = validate_schema(PredictionRequestSchema(), request.get_json() or {})
    if errors:
        return api_error("Validation failed", status=422, data=errors)

    user_id = get_current_user_id()
    ip = request.remote_addr or ""
    result = PredictionService.create_prediction(user_id, data, ip_address=ip)

    if result.get("recommendation"):
        RecommendationService.create(user_id, result["recommendation"])

    return api_response(message="Prediction completed successfully", data=result)


@prediction_bp.route("/predictions/<int:prediction_id>", methods=["GET"])
@jwt_required()
def get_prediction(prediction_id):
    user_id = get_current_user_id()
    record = PredictionService.get_by_id(prediction_id)
    if not record or record.user_id != user_id:
        return api_error("Prediction not found", status=404)
    return api_response(message="Prediction retrieved", data=record.to_dict())


@prediction_bp.route("/predictions/<int:prediction_id>", methods=["DELETE"])
@jwt_required()
def delete_prediction(prediction_id):
    user_id = get_current_user_id()
    record = PredictionService.delete(prediction_id, user_id)
    if not record:
        return api_error("Prediction not found", status=404)
    return api_response(message="Prediction deleted")


@prediction_bp.route("/predictions/report/<int:prediction_id>", methods=["GET"])
@jwt_required()
def get_prediction_report(prediction_id):
    user_id = get_current_user_id()
    record = PredictionService.get_by_id(prediction_id)
    if not record or record.user_id != user_id:
        return api_error("Prediction not found", status=404)
    data = record.to_dict()
    report = {
        "prediction_id": data["prediction_id"],
        "generated_at": data.get("created_at"),
        "inputs": {
            "date": data["date"],
            "time": data["time"],
            "temperature": data["temperature"],
            "humidity": data["humidity"],
            "cloud_cover": data["cloud_cover"],
            "solar_irradiance": data["solar_irradiance"],
            "wind_speed": data["wind_speed"],
        },
        "system": {
            "panel_capacity": data["panel_capacity"],
            "panel_type": data["panel_type"],
            "panel_count": data["panel_count"],
            "battery_capacity": data["battery_capacity"],
        },
        "results": {
            "predicted_output": data["predicted_output"],
            "daily_forecast": data["daily_forecast"],
            "confidence": data["confidence_score"],
            "generation_status": data["generation_status"],
            "energy_availability": data["energy_availability"],
            "energy_insight": data["energy_insight"],
            "recommendation": data["recommendation"],
            "maintenance_status": data["maintenance_status"],
            "weather_impact": data["weather_impact"],
        },
    }
    return api_response(message="Report generated", data=report)
