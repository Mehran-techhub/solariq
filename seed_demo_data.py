"""Seed demo user (id=1) with analytics, maintenance alerts, and efficiency scores."""
import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "solariq_backend"))

from app import create_app
from extensions import db
from models.analytics import Analytics
from models.maintenance_alert import MaintenanceAlert
from models.efficiency_score import EfficiencyScore
from datetime import datetime, timezone

app = create_app()
with app.app_context():
    uid = 1  # demo user

    # ---- Analytics ----
    periods = {
        "daily": {
            "generation": [120, 450, 780, 920, 650, 310],
            "consumption": [300, 400, 500, 600, 700, 350],
            "efficiency": [40, 85, 92, 88, 78, 55],
        },
        "weekly": {
            "generation": [520, 610, 480, 730, 690, 810, 450],
            "consumption": [450, 500, 420, 550, 530, 600, 400],
            "efficiency": [72, 78, 65, 82, 80, 85, 60],
        },
        "monthly": {
            "generation": [3200, 4100, 3800, 4500],
            "consumption": [2800, 3200, 3000, 3500],
            "efficiency": [75, 82, 78, 85],
        },
    }

    for period, data in periods.items():
        existing = Analytics.query.filter_by(user_id=uid, period=period).first()
        if existing:
            existing.generation = data["generation"]
            existing.consumption = data["consumption"]
            existing.efficiency = data["efficiency"]
        else:
            rec = Analytics(
                user_id=uid,
                period=period,
                generation=data["generation"],
                consumption=data["consumption"],
                efficiency=data["efficiency"],
            )
            db.session.add(rec)
    db.session.commit()
    print("Analytics seeded.")

    # ---- Maintenance Alerts ----
    alerts = [
        "Solar panels are performing below expected efficiency. Consider cleaning.",
        "Inverter efficiency dropped to 72%. Schedule a maintenance check.",
        "Battery charge cycles increased. Recommend inspection.",
    ]
    for msg in alerts:
        existing = MaintenanceAlert.query.filter_by(user_id=uid, alert_message=msg).first()
        if not existing:
            a = MaintenanceAlert(user_id=uid, alert_message=msg, status="open")
            db.session.add(a)
    db.session.commit()
    print("Maintenance alerts seeded.")

    # ---- Efficiency Scores ----
    scores = [
        {"actual": 6.8, "predicted": 7.2, "score": 94.4},
        {"actual": 5.2, "predicted": 6.0, "score": 86.7},
        {"actual": 3.1, "predicted": 4.5, "score": 68.9},
        {"actual": 7.5, "predicted": 7.8, "score": 96.2},
        {"actual": 4.2, "predicted": 5.5, "score": 76.4},
    ]
    for s in scores:
        existing = EfficiencyScore.query.filter_by(
            user_id=uid, actual_output=s["actual"], predicted_output=s["predicted"]
        ).first()
        if not existing:
            es = EfficiencyScore(
                user_id=uid,
                actual_output=s["actual"],
                predicted_output=s["predicted"],
                efficiency_score=s["score"],
            )
            db.session.add(es)
    db.session.commit()
    print("Efficiency scores seeded.")

    print("Demo data seeding complete.")
