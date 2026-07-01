from extensions import db


class EfficiencyScore(db.Model):
    __tablename__ = "efficiency_scores"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False, index=True)
    actual_output = db.Column(db.Float)
    predicted_output = db.Column(db.Float)
    efficiency_score = db.Column(db.Float)

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "actual_output": self.actual_output,
            "predicted_output": self.predicted_output,
            "efficiency_score": self.efficiency_score,
        }
