import os
from datetime import timedelta
from urllib.parse import quote_plus

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))


def resolve_database_uri():
    """Database URI — supports MySQL and SQLite. Falls back to SQLite."""
    explicit = os.getenv("DATABASE_URL", "").strip()
    if explicit:
        return explicit

    user = os.getenv("MYSQL_USER", "root")
    password = os.getenv("MYSQL_PASSWORD", "")
    host = os.getenv("MYSQL_HOST", "127.0.0.1")
    port = os.getenv("MYSQL_PORT", "3306")
    database = os.getenv("MYSQL_DB", "solariq")

    if password:
        safe_pass = quote_plus(password)
        return f"mysql+pymysql://{user}:{safe_pass}@{host}:{port}/{database}"

    db_path = os.path.join(os.path.dirname(BASE_DIR), "instance", "solariq.db")
    os.makedirs(os.path.dirname(db_path), exist_ok=True)
    return f"sqlite:///{db_path}"


class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-change-in-production-32chars!")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.getenv(
        "JWT_SECRET_KEY", "dev-jwt-secret-change-in-production-32chars!"
    )
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(
        hours=int(os.getenv("JWT_EXPIRE_HOURS", "24"))
    )
    CORS_ORIGINS = [
        origin.strip() for origin in os.getenv(
            "CORS_ORIGINS",
            "http://127.0.0.1:3000,http://localhost:3000,http://127.0.0.1:5173,http://localhost:5173,http://127.0.0.1:8000,http://localhost:8000",
        ).split(",")
    ]
    REPORTS_DIR = os.getenv("REPORTS_DIR", os.path.join(BASE_DIR, "storage", "reports"))
    SOLAR_CAPACITY_W = int(os.getenv("SOLAR_CAPACITY_W", "5200"))
    OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY", "")


class DevelopmentConfig(Config):
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = resolve_database_uri()


class ProductionConfig(Config):
    DEBUG = False
    SQLALCHEMY_DATABASE_URI = resolve_database_uri()


class TestingConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = os.getenv(
        "TEST_DATABASE_URL",
        "mysql+pymysql://solariq:solariq_pass@127.0.0.1:3306/solariq_test",
    )
