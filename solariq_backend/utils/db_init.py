from sqlalchemy import inspect, text

from extensions import bcrypt, db
from models.user import User
from models.system_setting import SystemSetting
from repositories.appliance_profile_repository import ApplianceProfileRepository


def ensure_database(app):
    with app.app_context():
        import models
        db.create_all()
        _ensure_auth_columns()
        _seed_demo_user()
        _seed_appliance_profiles()
        _seed_system_settings()


def _ensure_auth_columns():
    inspector = inspect(db.engine)
    columns = {column["name"] for column in inspector.get_columns("users")}
    if "reset_token" not in columns:
        db.session.execute(text("ALTER TABLE users ADD COLUMN reset_token VARCHAR(255)"))
    if "reset_token_expires_at" not in columns:
        db.session.execute(text("ALTER TABLE users ADD COLUMN reset_token_expires_at DATETIME"))
    db.session.commit()


def _seed_demo_user():
    if not User.query.filter_by(email="demo@solariq.com").first():
        user = User(
            full_name="Demo User",
            email="demo@solariq.com",
            password_hash=bcrypt.generate_password_hash("Demo@1234").decode("utf-8"),
            role="user",
        )
        db.session.add(user)
        db.session.commit()
        from services.auth_service import AuthService
        AuthService._bootstrap_user_data(user.id)
    if not User.query.filter_by(email="admin@solariq.com").first():
        admin = User(
            full_name="Admin",
            email="admin@solariq.com",
            password_hash=bcrypt.generate_password_hash("Admin@1234").decode("utf-8"),
            role="admin",
        )
        db.session.add(admin)
        db.session.commit()
        from services.auth_service import AuthService
        AuthService._bootstrap_user_data(admin.id)


def _seed_appliance_profiles():
    ApplianceProfileRepository.seed_defaults()


DEFAULT_SETTINGS = {
    # Energy thresholds
    "threshold_excellent": "4.0",
    "threshold_very_good": "3.0",
    "threshold_good": "2.0",
    "threshold_moderate": "1.0",
    "threshold_low": "0.5",
    # Weather thresholds
    "weather_high_cloud": "70",
    "weather_moderate_cloud": "40",
    "weather_low_cloud": "20",
    "weather_high_temp": "40",
    "weather_cold_temp": "10",
    "weather_high_humidity": "70",
    # Core power penalties
    "temp_penalty_rate": "0.005",
    "cloud_penalty_rate": "0.4",
    "humidity_penalty_rate": "0.001",
    "temp_boost_rate": "0.002",
    # Efficiency score thresholds
    "eff_needs_improvement": "60",
    "eff_fair": "75",
    "eff_good": "90",
    # Energy availability thresholds
    "energy_high": "4.0",
    "energy_moderate": "2.0",
    "energy_low": "1.0",
    # Peak hours
    "peak_hour_start": "10",
    "peak_hour_end": "14",
    # Electricity rates
    "electricity_rate_per_kwh": "18.0",
    "grid_rate_per_kwh": "0.5",
    "billing_days": "30",
}


def _seed_system_settings():
    for key, value in DEFAULT_SETTINGS.items():
        existing = SystemSetting.query.filter_by(setting_key=key).first()
        if not existing:
            db.session.add(SystemSetting(setting_key=key, setting_value=value))
    db.session.commit()
