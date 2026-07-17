import os
from datetime import datetime, timezone

from dotenv import load_dotenv
from utils.pkt_timezone import PKT
from flask import Flask, jsonify, request, send_from_directory, send_file

load_dotenv()

from config import config_by_name
from extensions import bcrypt, cors, db, jwt, migrate
from routes import register_blueprints
from utils.security import init_security, limiter


def _get_frontend_dist():
    base = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    return os.path.join(base, "frontend", "dist")


def create_app(config_name=None):
    config_name = config_name or os.getenv("FLASK_ENV", "development")
    app = Flask(__name__, static_folder=None)
    app.config.from_object(config_by_name[config_name])

    os.makedirs(app.config["REPORTS_DIR"], exist_ok=True)

    db.init_app(app)
    migrate.init_app(app, db)
    bcrypt.init_app(app)
    jwt.init_app(app)
    
    init_security(app)

    cors_origins = app.config["CORS_ORIGINS"]
    cors.init_app(
        app,
        origins=cors_origins,
        allow_headers=["Content-Type", "Authorization"],
        supports_credentials=True,
        methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"]
    )

    @app.after_request
    def after_request(response):
        origin = request.headers.get('Origin')
        if origin in cors_origins:
            response.headers['Access-Control-Allow-Origin'] = origin
            response.headers['Access-Control-Allow-Credentials'] = 'true'
        response.headers['X-Content-Type-Options'] = 'nosniff'
        response.headers['X-Frame-Options'] = 'DENY'
        return response

    register_blueprints(app)
    _register_jwt_handlers(app)
    _serve_frontend(app)
    _ensure_database(app)

    @app.route("/api/health", methods=["GET"])
    @limiter.limit("10 per minute")
    def health():
        db_status = "unknown"
        try:
            from sqlalchemy import text
            db.session.execute(text("SELECT 1"))
            db_status = "connected"
        except Exception as exc:
            db_status = f"error: {exc}"

        ml_model_path = os.path.join(os.path.dirname(__file__), "ml_models", "solar_model.pkl")
        prediction_service_ready = os.path.exists(ml_model_path)

        weather_api_key = os.getenv("OPENWEATHER_API_KEY", "")
        weather_api_ready = bool(weather_api_key) and len(weather_api_key) > 5

        return jsonify({
            "success": db_status == "connected",
            "message": "SolarIQ API is running",
            "data": {
                "database": db_status,
                "engine": "mysql",
                "api": "running",
                "prediction_service_ready": prediction_service_ready,
                "weather_api_ready": weather_api_ready,
                "timestamp": datetime.now(PKT).isoformat(),
            },
        })

    @app.route("/uploads/avatars/<path:filename>", methods=["GET"])
    def serve_avatar(filename):
        upload_dir = os.path.join(app.root_path, "storage", "avatars")
        return send_from_directory(upload_dir, filename)

    @app.cli.command("init-db")
    def init_db():
        from utils.db_init import ensure_database
        ensure_database(app)
        print("MySQL database ready.")

    return app


def _serve_frontend(app):
    dist = _get_frontend_dist()
    is_prod = os.getenv("FLASK_ENV") == "production"

    if is_prod or os.path.isdir(dist):
        index_path = os.path.join(dist, "index.html")

        @app.route("/", defaults={"path": ""})
        @app.route("/<path:path>")
        def serve_frontend(path):
            if path.startswith("api/") or path.startswith("uploads/"):
                from werkzeug.exceptions import NotFound
                raise NotFound()

            full = os.path.join(dist, path) if path else dist
            if path and os.path.isfile(full):
                return send_file(full)

            if os.path.isfile(index_path):
                return send_file(index_path)

            return jsonify({"success": False, "message": "Not found"}), 404


def _register_jwt_handlers(app):
    @jwt.expired_token_loader
    def expired_token(jwt_header, jwt_payload):
        return jsonify({"success": False, "message": "Token expired", "data": {}}), 401

    @jwt.invalid_token_loader
    def invalid_token(error):
        return jsonify({"success": False, "message": "Invalid token", "data": {}}), 401

    @jwt.unauthorized_loader
    def missing_token(error):
        return jsonify({"success": False, "message": "Authorization required", "data": {}}), 401

    @jwt.revoked_token_loader
    def revoked_token(jwt_header, jwt_payload):
        return jsonify({"success": False, "message": "Token has been revoked", "data": {}}), 401

    @jwt.token_verification_failed_loader
    def token_verification_failed(jwt_header, jwt_payload):
        return jsonify({"success": False, "message": "Token verification failed", "data": {}}), 401


def _ensure_database(app):
    if os.getenv("FLASK_SKIP_DB_INIT", "").lower() in ("1", "true"):
        return
    os.makedirs(app.config.get("REPORTS_DIR", "storage/reports"), exist_ok=True)
    from utils.db_init import ensure_database
    ensure_database(app)


if __name__ == "__main__":
    app = create_app()
    app.run(host="0.0.0.0", port=int(os.getenv("PORT", 5000)), debug=True)
