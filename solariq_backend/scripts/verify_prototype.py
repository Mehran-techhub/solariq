"""Verify all API endpoints for the working prototype."""
import json
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))

from app import create_app


def run_checks():
    app = create_app("development")
    client = app.test_client()
    errors = []

    r = client.get("/api/health")
    health = r.get_json()
    if not health.get("success"):
        errors.append(f"health: {health}")
    else:
        print(f"[OK] health — DB: {health['data'].get('database')}")

    r = client.post("/api/auth/login", json={"email": "demo@solariq.com", "password": "Demo@1234"})
    data = r.get_json()
    if r.status_code != 200:
        errors.append(f"login: {data}")
    token = data.get("token") or data.get("data", {}).get("token")
    h = {"Authorization": f"Bearer {token}"}
    print("[OK] login")

    endpoints = [
        ("GET", "/api/dashboard/stats", None),
        ("GET", "/api/dashboard/overview", None),
        ("GET", "/api/analytics/daily", None),
        ("GET", "/api/analytics/weekly", None),
        ("GET", "/api/analytics/monthly", None),
        ("POST", "/api/predictions", {"date": "2026-06-03", "time": "12:00", "sunlight": 850, "temperature": 31}),
        ("POST", "/api/simulation/run", {"appliances": [{"name": "EV", "wattage": 3200}]}),
        ("GET", "/api/reports", None),
        ("GET", "/api/settings", None),
    ]
    for method, path, body in endpoints:
        kw = {"headers": h}
        if body:
            kw["json"] = body
        resp = getattr(client, method.lower())(path, **kw)
        j = resp.get_json()
        if resp.status_code >= 400 or not j.get("success"):
            errors.append(f"{method} {path}: {resp.status_code} {j}")
        else:
            print(f"[OK] {method} {path}")

    r = client.post("/api/reports/generate", headers=h, json={"report_type": "monthly", "format": "pdf"})
    if r.status_code == 200:
        print("[OK] POST /api/reports/generate")
    else:
        errors.append(f"report generate: {r.get_json()}")

    if errors:
        print("\nFAILED:")
        for e in errors:
            print(" ", e)
        return 1
    print("\n=== All prototype API checks passed ===")
    return 0


if __name__ == "__main__":
    sys.exit(run_checks())
