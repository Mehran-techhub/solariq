from datetime import datetime, timezone


from extensions import db


class WeatherData(db.Model):
    __tablename__ = "weather_data"

    id = db.Column(db.Integer, primary_key=True)
    temperature = db.Column(db.Float)
    humidity = db.Column(db.Float)
    cloud_cover = db.Column(db.Float)
    weather_condition = db.Column(db.String(120))
    wind_speed = db.Column(db.Float, default=0)
    uv_index = db.Column(db.Float, default=0)
    sunrise = db.Column(db.String(20), default="")
    sunset = db.Column(db.String(20), default="")
    solar_impact = db.Column(db.Text, default="")
    generation_outlook = db.Column(db.String(20), default="")
    fetched_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    def to_dict(self):
        return {
            "id": self.id,
            "temperature": self.temperature,
            "humidity": self.humidity,
            "cloud_cover": self.cloud_cover,
            "weather_condition": self.weather_condition,
            "wind_speed": self.wind_speed or 0,
            "uv_index": self.uv_index or 0,
            "sunrise": self.sunrise or "",
            "sunset": self.sunset or "",
            "solar_impact": self.solar_impact or "",
            "generation_outlook": self.generation_outlook or "",
            "fetched_at": self.fetched_at.isoformat() if self.fetched_at else None,
        }
