from flask import Blueprint, request
from flask_jwt_extended import jwt_required

from schemas.auth_schemas import validate_schema
from schemas.simulation_schemas import SimulationRequestSchema
from services.simulation_service import SimulationService
from repositories.simulation_repository import SimulationRepository
from utils.decorators import get_current_user_id
from utils.response import api_response, api_error

simulation_bp = Blueprint("simulation", __name__)


@simulation_bp.route("", methods=["GET"])
@jwt_required()
def list_simulations():
    user_id = get_current_user_id()
    sims = SimulationRepository.list_by_user(user_id)
    return api_response(message="Simulations retrieved", data={"simulations": [s.to_dict() for s in sims]})


@simulation_bp.route("/run", methods=["POST"])
@jwt_required()
def run_simulation():
    data, errors = validate_schema(SimulationRequestSchema(), request.get_json() or {})
    if errors:
        return api_error("Validation failed", status=422, data=errors)
    user_id = get_current_user_id()
    result = SimulationService.run(user_id, data["appliances"])
    return api_response(message="Simulation completed successfully", data=result)

