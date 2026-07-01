from flask import Blueprint, request
from flask_jwt_extended import get_jwt_identity, jwt_required
from requests import HTTPError

from services.weather_service import WeatherService
from utils.response import api_response, api_error

weather_bp = Blueprint("weather", __name__)


@weather_bp.route("/fetch", methods=["POST"])
@jwt_required()
def fetch_weather():
    data = request.get_json() or {}
    lat = data.get("lat")
    lon = data.get("lon")
    user_id = get_jwt_identity()
    try:
        item = WeatherService.fetch_and_store(lat=lat, lon=lon, user_id=user_id)
        return api_response(message="Weather fetched", data=item)
    except (RuntimeError, HTTPError) as e:
        return api_error(str(e), status=503)


@weather_bp.route("/geocode", methods=["GET"])
@jwt_required()
def geocode_city():
    city = request.args.get("city", "")
    if not city:
        return api_error("city parameter required", status=422)
    try:
        results = WeatherService.geocode(city)
        return api_response(message="Geocoding results", data={"results": results})
    except RuntimeError as e:
        return api_error(str(e), status=503)

@weather_bp.route("", methods=["GET"])
@jwt_required()
def latest_weather():
    data = WeatherService.latest()
    last_sync = None
    if data:
        last_sync = data[0].get("fetched_at") if isinstance(data[0], dict) else None
    return api_response(message="Latest weather data", data={"items": data, "last_sync": last_sync})

@weather_bp.route("/sync-status", methods=["GET"])
@jwt_required()
def sync_status():
    data = WeatherService.latest(limit=1)
    last_sync = None
    if data:
        last_sync = data[0].get("fetched_at") if isinstance(data[0], dict) else None
    return api_response(message="Sync status", data={
        "last_sync": last_sync,
        "data_available": len(data) > 0,
        "api_key_configured": bool(WeatherService._get_api_key()),
    })
