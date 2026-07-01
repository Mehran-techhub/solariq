from flask import Blueprint, request
from flask_jwt_extended import jwt_required

from schemas.auth_schemas import validate_schema
from schemas.report_schemas import ReportGenerateSchema
from services.report_service import ReportService
from utils.decorators import get_current_user_id
from utils.response import api_error, api_response

reports_bp = Blueprint("reports", __name__)


@reports_bp.route("", methods=["GET"])
@jwt_required()
def list_reports():
    user_id = get_current_user_id()
    data = ReportService.list_reports(user_id)
    return api_response(message="Reports retrieved successfully", data=data)


@reports_bp.route("/generate", methods=["POST"])
@jwt_required()
def generate_report():
    data, errors = validate_schema(ReportGenerateSchema(), request.get_json() or {})
    if errors:
        return api_error("Validation failed", status=422, data=errors)
    user_id = get_current_user_id()
    result = ReportService.generate(user_id, data)
    return api_response(message="Report generated successfully", data=result)


@reports_bp.route("/download/<int:report_id>", methods=["GET"])
@jwt_required()
def download_report(report_id):
    user_id = get_current_user_id()
    file_response = ReportService.download(user_id, report_id)
    if file_response is None:
        return api_error("Report not found", status=404)
    return file_response
