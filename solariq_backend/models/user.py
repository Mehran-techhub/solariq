from datetime import datetime, timezone
from utils.pkt_timezone import PKT

from extensions import db


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    phone = db.Column(db.String(30))
    profile_image = db.Column(db.String(255), nullable=True)
    installation_type = db.Column(db.String(50), default="homeowner")
    role = db.Column(db.String(50), default="user")
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    last_login = db.Column(db.DateTime)
    reset_token = db.Column(db.String(255))
    reset_token_expires_at = db.Column(db.DateTime)

    dashboard_stats = db.relationship("DashboardStats", backref="user", lazy="dynamic")
    predictions = db.relationship("SolarPrediction", backref="user", lazy="dynamic")
    analytics = db.relationship("Analytics", backref="user", lazy="dynamic")
    simulations = db.relationship("Simulation", backref="user", lazy="dynamic")
    reports = db.relationship("Report", backref="user", lazy="dynamic")
    settings = db.relationship("UserSettings", backref="user", uselist=False)
    activity_logs = db.relationship("ActivityLog", backref="user", lazy="dynamic")

    @staticmethod
    def _ensure_pkt(dt):
        if dt is None:
            return None
        if dt.tzinfo is None:
            return dt.replace(tzinfo=timezone.utc).astimezone(PKT)
        return dt.astimezone(PKT)

    def to_dict(self):
        return {
            "id": self.id,
            "full_name": self.full_name,
            "email": self.email,
            "phone": self.phone,
            "profile_image": self.profile_image,
            "installation_type": self.installation_type,
            "role": self.role,
            "is_active": self.is_active,
            "created_at": self._ensure_pkt(self.created_at).isoformat() if self.created_at else None,
            "last_login": self._ensure_pkt(self.last_login).isoformat() if self.last_login else None,
        }
