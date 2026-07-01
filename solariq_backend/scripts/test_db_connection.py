"""Test MySQL connection using DATABASE_URL from .env"""
import os
import sys

from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))

url = os.getenv("DATABASE_URL")
if not url:
    print("ERROR: DATABASE_URL not set in .env")
    sys.exit(1)

print(f"Connecting to: {url.split('@')[-1] if '@' in url else url}")

try:
    from sqlalchemy import create_engine, text

    engine = create_engine(url, pool_pre_ping=True)
    with engine.connect() as conn:
        version = conn.execute(text("SELECT VERSION()")).scalar()
        db = conn.execute(text("SELECT DATABASE()")).scalar()
        print("SUCCESS: Connected to MySQL")
        print(f"  Version: {version}")
        print(f"  Database: {db or '(none - run setup script)'}")
    sys.exit(0)
except Exception as exc:
    print(f"FAILED: {exc}")
    sys.exit(1)
