from flask import Blueprint
from flask_jwt_extended import jwt_required

from models.activity_log import ActivityLog
from utils.decorators import get_current_user_id
from utils.response import api_response

activity_bp = Blueprint("activity", __name__)


@activity_bp.route("", methods=["GET"])
@jwt_required()
def list_activity():
    user_id = get_current_user_id()
    logs = (
        ActivityLog.query
        .filter_by(user_id=user_id)
        .order_by(ActivityLog.timestamp.desc())
        .limit(20)
        .all()
    )
    return api_response(message="Activity retrieved", data={"activities": [l.to_dict() for l in logs]})
