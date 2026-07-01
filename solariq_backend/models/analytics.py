from datetime import datetime, timezone


from extensions import db


class Analytics(db.Model):
    __tablename__ = "analytics"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False, index=True)
    period = db.Column(db.String(20), nullable=False, index=True)
    generation = db.Column(db.JSON, nullable=False)
    consumption = db.Column(db.JSON, nullable=False)
    efficiency = db.Column(db.JSON, nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    def to_dict(self):
        return {
            "period": self.period,
            "generation": self.generation,
            "consumption": self.consumption,
            "efficiency": self.efficiency,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
