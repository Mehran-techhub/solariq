from flask import Blueprint, request
from flask_jwt_extended import jwt_required

from services.solar_service import SolarService
from utils.decorators import get_current_user_id
from utils.response import api_response, api_error

solar_bp = Blueprint("solar", __name__)


@solar_bp.route("", methods=["GET"])
@jwt_required()
def list_solar():
    user_id = get_current_user_id()
    data = SolarService.list_records(user_id)
    return api_response(message="Solar records retrieved", data={"records": data})


@solar_bp.route("", methods=["POST"])
@jwt_required()
def create_solar():
    user_id = get_current_user_id()
    payload = request.get_json() or {}
    rec = SolarService.create_record(user_id, payload)
    return api_response(message="Record created", data=rec)


@solar_bp.route("/<int:rec_id>", methods=["PUT"])
@jwt_required()
def update_solar(rec_id):
    user_id = get_current_user_id()
    payload = request.get_json() or {}
    rec = SolarService.update_record(user_id, rec_id, payload)
    if rec is None:
        return api_error("Not found or unauthorized", status=404)
    return api_response(message="Record updated", data=rec)


@solar_bp.route("/<int:rec_id>", methods=["DELETE"])
@jwt_required()
def delete_solar(rec_id):
    user_id = get_current_user_id()
    ok = SolarService.delete_record(user_id, rec_id)
    if not ok:
        return api_error("Not found or unauthorized", status=404)
    return api_response(message="Record deleted", data={})
