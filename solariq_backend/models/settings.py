from datetime import datetime, timezone

from utils.pkt_timezone import PKT

from extensions import db


class UserSettings(db.Model):
    __tablename__ = "settings"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), unique=True, nullable=False)
    theme = db.Column(db.String(20), default="dark")
    notifications = db.Column(db.Boolean, default=True)
    email_alerts = db.Column(db.Boolean, default=True)
    timezone = db.Column(db.String(60), default="Asia/Karachi")
    openweather_api_key = db.Column(db.String(200), default="")
    updated_at = db.Column(
        db.DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    def to_dict(self):
        return {
            "theme": self.theme,
            "notifications": self.notifications,
            "email_alerts": self.email_alerts,
            "timezone": self.timezone,
            "openweather_api_key": self.openweather_api_key or "",
            "updated_at": self.updated_at.replace(tzinfo=timezone.utc).astimezone(PKT).isoformat() if self.updated_at else None,
        }
