from datetime import datetime, timezone


from extensions import db


class SolarPrediction(db.Model):
    __tablename__ = "predictions"

    id = db.Column(db.Integer, primary_key=True)
    prediction_id = db.Column(db.String(30), unique=True, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False, index=True)

    # Environmental inputs
    date = db.Column(db.String(20), nullable=False)
    time = db.Column(db.String(10), nullable=False)
    temperature = db.Column(db.Float, nullable=False)
    humidity = db.Column(db.Float, default=0)
    cloud_cover = db.Column(db.Float, default=0)
    solar_irradiance = db.Column(db.Float, nullable=False)
    wind_speed = db.Column(db.Float, default=0)
    weather_condition = db.Column(db.String(50), default="")

    # Solar system info
    panel_capacity = db.Column(db.Float, default=5.0)
    panel_type = db.Column(db.String(50), default="Monocrystalline")
    panel_count = db.Column(db.Integer, default=1)
    installation_angle = db.Column(db.Float, default=30)
    battery_capacity = db.Column(db.Float, default=0)
    location = db.Column(db.String(100), default="")

    # Core results
    predicted_output = db.Column(db.Float, nullable=False)
    confidence_score = db.Column(db.Float, nullable=False)
    expected_efficiency = db.Column(db.Float, default=0)
    daily_forecast = db.Column(db.Float, default=0)
    generation_status = db.Column(db.String(30), default="Moderate")

    # Energy analysis
    current_battery = db.Column(db.Float, default=0)
    total_available = db.Column(db.Float, default=0)
    energy_availability = db.Column(db.String(30), default="Moderate")

    # Appliance planning
    appliances_json = db.Column(db.Text, default="[]")
    recommended_start = db.Column(db.String(10), default="")
    recommended_end = db.Column(db.String(10), default="")

    # Efficiency analysis
    actual_output = db.Column(db.Float, nullable=True)
    efficiency_score = db.Column(db.Float, nullable=True)
    efficiency_performance = db.Column(db.String(30), default="")

    # Maintenance analysis
    maintenance_status = db.Column(db.String(50), default="Normal")
    maintenance_causes = db.Column(db.Text, default="")
    maintenance_recommendation = db.Column(db.Text, default="")

    # Insights
    energy_insight = db.Column(db.Text, default="")
    recommendation = db.Column(db.Text)

    # Weather impact
    weather_impact = db.Column(db.String(30), default="Low")
    weather_reliability = db.Column(db.String(30), default="High")
    weather_explanation = db.Column(db.Text, default="")

    # Curve data
    curve_data = db.Column(db.Text, default="[]")

    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    def to_dict(self):
        import json
        return {
            "id": self.id,
            "prediction_id": self.prediction_id,
            "date": self.date,
            "time": self.time,
            "temperature": self.temperature,
            "humidity": self.humidity,
            "cloud_cover": self.cloud_cover,
            "solar_irradiance": self.solar_irradiance,
            "wind_speed": self.wind_speed,
            "weather_condition": self.weather_condition,
            "panel_capacity": self.panel_capacity,
            "panel_type": self.panel_type,
            "panel_count": self.panel_count,
            "installation_angle": self.installation_angle,
            "battery_capacity": self.battery_capacity,
            "location": self.location,
            "predicted_output": self.predicted_output,
            "confidence_score": self.confidence_score,
            "expected_efficiency": self.expected_efficiency,
            "daily_forecast": self.daily_forecast,
            "generation_status": self.generation_status,
            "current_battery": self.current_battery,
            "total_available": self.total_available,
            "energy_availability": self.energy_availability,
            "appliances": json.loads(self.appliances_json) if self.appliances_json else [],
            "recommended_start": self.recommended_start,
            "recommended_end": self.recommended_end,
            "actual_output": self.actual_output,
            "efficiency_score": self.efficiency_score,
            "efficiency_performance": self.efficiency_performance,
            "maintenance_status": self.maintenance_status,
            "maintenance_causes": self.maintenance_causes,
            "maintenance_recommendation": self.maintenance_recommendation,
            "energy_insight": self.energy_insight,
            "recommendation": self.recommendation,
            "weather_impact": self.weather_impact,
            "weather_reliability": self.weather_reliability,
            "weather_explanation": self.weather_explanation,
            "curve_data": json.loads(self.curve_data) if self.curve_data else [],
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }


class PredictionLog(db.Model):
    __tablename__ = "prediction_logs"

    id = db.Column(db.Integer, primary_key=True)
    prediction_id = db.Column(db.Integer, db.ForeignKey("predictions.id"), nullable=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    action = db.Column(db.String(50), nullable=False)
    details = db.Column(db.Text, default="")
    ip_address = db.Column(db.String(50), default="")
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    def to_dict(self):
        return {
            "id": self.id,
            "prediction_id": self.prediction_id,
            "user_id": self.user_id,
            "action": self.action,
            "details": self.details,
            "ip_address": self.ip_address,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
