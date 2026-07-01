from datetime import datetime, timezone


from extensions import db


class DashboardStats(db.Model):
    __tablename__ = "dashboard_stats"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False, index=True)
    modeled_output = db.Column(db.Float, default=0.0)
    predicted_yield = db.Column(db.Float, default=0.0)
    optimization_score = db.Column(db.Float, default=0.0)
    estimated_savings = db.Column(db.Float, default=0.0)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    def to_dict(self):
        return {
            "modeled_output": self.modeled_output,
            "predicted_yield": self.predicted_yield,
            "optimization_score": self.optimization_score,
            "estimated_savings": self.estimated_savings,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
