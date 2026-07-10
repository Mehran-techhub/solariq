from datetime import datetime, timezone

from utils.pkt_timezone import PKT

from extensions import db


class ActivityLog(db.Model):
    __tablename__ = "activity_logs"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False, index=True)
    action = db.Column(db.String(120), nullable=False)
    module = db.Column(db.String(60), nullable=False)
    timestamp = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    def to_dict(self):
        return {
            "id": self.id,
            "action": self.action,
            "module": self.module,
            "timestamp": self.timestamp.replace(tzinfo=timezone.utc).astimezone(PKT).isoformat() if self.timestamp else None,
        }
