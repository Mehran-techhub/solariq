from datetime import datetime, timezone


from extensions import db


class Simulation(db.Model):
    __tablename__ = "simulations"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False, index=True)
    appliance_name = db.Column(db.String(120), nullable=False)
    wattage = db.Column(db.Integer, nullable=False)
    solar_share = db.Column(db.Float, nullable=False)
    grid_share = db.Column(db.Float, nullable=False)
    estimated_cost = db.Column(db.Float, nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    def to_dict(self):
        return {
            "id": self.id,
            "appliance_name": self.appliance_name,
            "wattage": self.wattage,
            "solar_share": self.solar_share,
            "grid_share": self.grid_share,
            "estimated_cost": self.estimated_cost,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
