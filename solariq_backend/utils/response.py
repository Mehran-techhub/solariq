from flask import jsonify


def api_response(success=True, message="Operation completed successfully", data=None, status=200, **extra):
    payload = {
        "success": success,
        "message": message,
        "data": data if data is not None else {},
    }
    payload.update(extra)
    return jsonify(payload), status


def api_error(message, status=400, data=None):
    return api_response(success=False, message=message, data=data, status=status)
