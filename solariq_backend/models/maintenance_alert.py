from datetime import datetime, timezone

from utils.pkt_timezone import PKT

from extensions import db


class MaintenanceAlert(db.Model):
    __tablename__ = "maintenance_alerts"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False, index=True)
    alert_message = db.Column(db.Text, nullable=False)
    status = db.Column(db.String(30), default="open")
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "alert_message": self.alert_message,
            "status": self.status,
            "created_at": self.created_at.replace(tzinfo=timezone.utc).astimezone(PKT).isoformat() if self.created_at else None,
        }
