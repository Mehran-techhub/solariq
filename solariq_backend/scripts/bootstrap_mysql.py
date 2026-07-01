"""
Bootstrap SolarIQ MySQL database for local MySQL Workbench / MySQL Server.

Usage (PowerShell):
  cd solariq_backend
  python scripts/bootstrap_mysql.py --root-password YOUR_MYSQL_ROOT_PASSWORD

Optional:
  --app-password CustomPasswordFor_solariq_user
  --skip-server     Only init tables (DB/user already exist)
"""
import argparse
import os
import secrets
import sys

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, ROOT_DIR)

APP_DB = "solariq_db"
APP_USER = "solariq"
DEFAULT_APP_PASSWORD = "SolarIQ_Local_2026!"


def run_setup_sql(root_password, app_password, host="127.0.0.1", port=3306):
    import pymysql

    conn = pymysql.connect(
        host=host,
        port=port,
        user="root",
        password=root_password,
        charset="utf8mb4",
        autocommit=True,
    )
    statements = [
        f"CREATE DATABASE IF NOT EXISTS {APP_DB} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci",
        f"CREATE USER IF NOT EXISTS '{APP_USER}'@'localhost' IDENTIFIED BY '{app_password}'",
        f"CREATE USER IF NOT EXISTS '{APP_USER}'@'127.0.0.1' IDENTIFIED BY '{app_password}'",
        f"GRANT ALL PRIVILEGES ON {APP_DB}.* TO '{APP_USER}'@'localhost'",
        f"GRANT ALL PRIVILEGES ON {APP_DB}.* TO '{APP_USER}'@'127.0.0.1'",
        "FLUSH PRIVILEGES",
    ]
    with conn.cursor() as cur:
        for sql in statements:
            cur.execute(sql)
    conn.close()
    print(f"[OK] Database '{APP_DB}' and user '{APP_USER}' ready.")


def write_env(app_password, host="127.0.0.1", port=3306):
    from urllib.parse import quote_plus

    secret = secrets.token_urlsafe(32)
    jwt_secret = secrets.token_urlsafe(32)
    safe_pass = quote_plus(app_password)
    db_url = f"mysql+pymysql://{APP_USER}:{safe_pass}@{host}:{port}/{APP_DB}"
    env_path = os.path.join(ROOT_DIR, ".env")
    content = f"""FLASK_ENV=development
SECRET_KEY={secret}
JWT_SECRET_KEY={jwt_secret}
JWT_EXPIRE_HOURS=24
PORT=5000

DATABASE_URL={db_url}

CORS_ORIGINS=http://127.0.0.1:8000,http://localhost:8000,http://127.0.0.1:5500,http://localhost:5500
REPORTS_DIR=storage/reports
SOLAR_CAPACITY_W=5200
"""
    with open(env_path, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"[OK] Wrote {env_path}")
    return env_path


def init_flask_tables():
    from dotenv import load_dotenv

    load_dotenv(os.path.join(ROOT_DIR, ".env"))
    from app import create_app
    from extensions import db
    from models import (  # noqa: F401 - register models
        ActivityLog,
        Analytics,
        DashboardStats,
        Report,
        Simulation,
        SolarPrediction,
        User,
        UserSettings,
    )

    app = create_app("development")
    with app.app_context():
        db.create_all()
    print("[OK] All tables created.")


def seed_demo_user():
    from dotenv import load_dotenv

    load_dotenv(os.path.join(ROOT_DIR, ".env"))
    from app import create_app
    from extensions import bcrypt, db
    from models.user import User
    from services.auth_service import AuthService

    app = create_app("development")
    with app.app_context():
        email = "demo@solariq.com"
        if User.query.filter_by(email=email).first():
            print("[OK] Demo user already exists (demo@solariq.com / Demo@1234)")
            return
        user = User(
            full_name="Demo User",
            email=email,
            password_hash=bcrypt.generate_password_hash("Demo@1234").decode("utf-8"),
            role="homeowner",
        )
        db.session.add(user)
        db.session.commit()
        AuthService._bootstrap_user_data(user.id)
    print("[OK] Demo user: demo@solariq.com / Demo@1234")


def test_app_connection():
    from dotenv import load_dotenv

    load_dotenv(os.path.join(ROOT_DIR, ".env"))
    from sqlalchemy import create_engine, text

    url = os.getenv("DATABASE_URL")
    engine = create_engine(url, pool_pre_ping=True)
    with engine.connect() as conn:
        v = conn.execute(text("SELECT VERSION()")).scalar()
        tables = conn.execute(text("SHOW TABLES")).fetchall()
    print(f"[OK] App connection verified. MySQL {v}. Tables: {len(tables)}")


def test_api():
    from dotenv import load_dotenv

    load_dotenv(os.path.join(ROOT_DIR, ".env"))
    from app import create_app

    app = create_app("development")
    client = app.test_client()
    r = client.post("/api/auth/login", json={"email": "demo@solariq.com", "password": "Demo@1234"})
    data = r.get_json()
    if r.status_code != 200 or not data.get("success"):
        raise RuntimeError(f"API login failed: {data}")
    token = data.get("token") or data["data"]["token"]
    r2 = client.get("/api/dashboard/stats", headers={"Authorization": f"Bearer {token}"})
    if r2.status_code != 200:
        raise RuntimeError("Dashboard API failed")
    print("[OK] API login + dashboard test passed.")


def main():
    parser = argparse.ArgumentParser(description="Bootstrap SolarIQ MySQL")
    parser.add_argument("--root-password", help="MySQL root password (Workbench admin)")
    parser.add_argument("--app-password", default=DEFAULT_APP_PASSWORD)
    parser.add_argument("--host", default="127.0.0.1")
    parser.add_argument("--port", type=int, default=3306)
    parser.add_argument("--skip-server", action="store_true", help="Skip CREATE DATABASE/USER")
    args = parser.parse_args()

    root_pass = args.root_password or os.getenv("MYSQL_ROOT_PASSWORD")
    if not args.skip_server and not root_pass:
        try:
            import getpass
            root_pass = getpass.getpass("MySQL root password (Workbench admin): ")
        except Exception:
            pass
    if not args.skip_server and not root_pass:
        print("Provide MySQL root password:")
        print("  python scripts/bootstrap_mysql.py --root-password YOUR_PASSWORD")
        print("Or set env: $env:MYSQL_ROOT_PASSWORD='yourpassword'")
        sys.exit(1)

    try:
        if not args.skip_server:
            run_setup_sql(root_pass, args.app_password, args.host, args.port)
        write_env(args.app_password, args.host, args.port)
        init_flask_tables()
        seed_demo_user()
        test_app_connection()
        test_api()
        print("\n=== Prototype ready ===")
        print("1. Start API:  python app.py")
        print("2. Start UI:   python -m http.server 8000  (from project root)")
        print("3. Open:       http://localhost:8000/public/login.html")
        print("   Login:      demo@solariq.com / Demo@1234")
        print(f"\nMySQL Workbench connection:")
        print(f"  Host: 127.0.0.1  Port: 3306  User: {APP_USER}")
        print(f"  Password: {args.app_password}  Schema: {APP_DB}")
    except Exception as exc:
        print(f"\n[FAILED] {exc}")
        sys.exit(1)


if __name__ == "__main__":
    main()
