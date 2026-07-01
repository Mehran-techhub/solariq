from datetime import datetime, timezone

from extensions import db


class ApplianceProfile(db.Model):
    __tablename__ = "appliance_profiles"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    watts = db.Column(db.Integer, nullable=False)
    priority = db.Column(db.Integer, nullable=False, default=1)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "watts": self.watts,
            "priority": self.priority,
            "is_active": self.is_active,
        }
