from datetime import datetime, timezone


from extensions import db


class SolarRecord(db.Model):
    __tablename__ = "solar_records"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False, index=True)
    temperature = db.Column(db.Float)
    humidity = db.Column(db.Float)
    cloud_cover = db.Column(db.Float)
    irradiance = db.Column(db.Float)
    actual_output = db.Column(db.Float)
    notes = db.Column(db.String(500), default="")
    record_date = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "temperature": self.temperature,
            "humidity": self.humidity,
            "cloud_cover": self.cloud_cover,
            "irradiance": self.irradiance,
            "actual_output": self.actual_output,
            "notes": self.notes or "",
            "record_date": self.record_date.isoformat() if self.record_date else None,
        }
