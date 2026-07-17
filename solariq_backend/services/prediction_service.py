import json
from datetime import datetime, timezone


from models.solar_prediction import SolarPrediction, PredictionLog
from repositories.prediction_repository import PredictionRepository
from services.config_service import ConfigService
from utils.activity_logger import log_activity


class PredictionService:
    MAX_SYSTEM_KW = 5.0

    @staticmethod
    def _next_prediction_id():
        from extensions import db
        import sqlalchemy as sa
        year = datetime.now(timezone.utc).strftime("%Y")
        result = db.session.execute(sa.text("SELECT COUNT(*) FROM predictions")).scalar()
        return f"PR-{year}{result + 1:05d}"

    @staticmethod
    def create_prediction(user_id, data, ip_address=""):
        try:
            from ml.prediction_service import MLPredictionService
            result = MLPredictionService.predict_solar_output(data)
        except Exception:
            result = PredictionService.calculate(data)
        record = PredictionService._build_record(user_id, data, result)
        PredictionRepository.create(record)
        log_activity(user_id, f"Prediction {record.prediction_id} created", "prediction")
        log_entry = PredictionLog(
            prediction_id=record.id,
            user_id=user_id,
            action="created",
            details=json.dumps({"prediction_id": record.prediction_id, "output_kw": result["predicted_output"]}),
            ip_address=ip_address,
        )
        PredictionRepository.create_log(log_entry)
        result["prediction_id"] = record.prediction_id
        result["id"] = record.id
        return result

    @staticmethod
    def _build_record(user_id, data, result):
        return SolarPrediction(
            prediction_id=result.get("prediction_id", PredictionService._next_prediction_id()),
            user_id=user_id,
            date=data["date"],
            time=data["time"],
            temperature=data.get("temperature", 25),
            humidity=data.get("humidity", 0),
            cloud_cover=data.get("cloud_cover", data.get("clouds", 0)),
            solar_irradiance=data.get("solar_irradiance", data.get("sunlight", 0)),
            wind_speed=data.get("wind_speed", 0),
            weather_condition=data.get("weather_condition", ""),
            panel_capacity=data.get("panel_capacity", 5.0),
            panel_type=data.get("panel_type", "Monocrystalline"),
            panel_count=data.get("panel_count", 1),
            installation_angle=data.get("installation_angle", 30),
            battery_capacity=data.get("battery_capacity", 0),
            location=data.get("location", ""),
            predicted_output=result["predicted_output"],
            confidence_score=result["confidence"],
            expected_efficiency=result["expected_efficiency"],
            daily_forecast=result["daily_forecast"],
            generation_status=result["generation_status"],
            current_battery=result["current_battery"],
            total_available=result["total_available"],
            energy_availability=result["energy_availability"],
            appliances_json=json.dumps(result["appliances"]),
            recommended_start=result["recommended_start"],
            recommended_end=result["recommended_end"],
            actual_output=None,
            efficiency_score=None,
            efficiency_performance="",
            maintenance_status=result["maintenance_status"],
            maintenance_causes=result["maintenance_causes"],
            maintenance_recommendation=result["maintenance_recommendation"],
            energy_insight=result["energy_insight"],
            recommendation=result["recommendation"],
            weather_impact=result["weather_impact"],
            weather_reliability=result["weather_reliability"],
            weather_explanation=result["weather_explanation"],
            curve_data=json.dumps(result["curve_data"]),
        )

    @staticmethod
    def calculate(data):
        irradiance = float(data.get("solar_irradiance", data.get("sunlight", 800)))
        temperature = float(data.get("temperature", 25))
        humidity = float(data.get("humidity", 0))
        clouds = float(data.get("cloud_cover", data.get("clouds", 0)))
        wind = float(data.get("wind_speed", 0))
        time_str = data.get("time", "12:00")
        hour = int(time_str.split(":")[0]) if ":" in time_str else 12

        panel_cap = float(data.get("panel_capacity", 5.0))
        panel_type = data.get("panel_type", "Monocrystalline")
        panel_count = int(data.get("panel_count", 1))
        battery_cap = float(data.get("battery_capacity", 0))
        battery_current = float(data.get("battery_current", 0))

        effective_cap = min(panel_cap * panel_count, PredictionService.MAX_SYSTEM_KW)

        power, efficiency = PredictionService._core_power(
            irradiance, temperature, humidity, clouds, hour, effective_cap
        )
        confidence = round(max(50.0, efficiency - 5.0), 1)
        curve = PredictionService._curve_data(power, hour)

        gen_status = PredictionService._generation_status(power)
        daily_forecast = round(power * 5.5, 1)
        energy_status = PredictionService._energy_status(power, battery_cap, battery_current)
        appliances = PredictionService._appliance_recommendations(power, energy_status["total_available"])
        best_window = PredictionService._best_time_window(hour, clouds)
        weather_analysis = PredictionService._weather_impact(clouds, temperature, humidity, wind)
        maintenance = PredictionService._maintenance_analysis(power, clouds, temperature)
        efficiency_analysis = PredictionService._efficiency_analysis(data, power)
        insight = PredictionService._energy_insight(power, clouds, hour, gen_status, best_window)
        recommendation = PredictionService._recommendation(power, clouds, gen_status)

        return {
            "predicted_output": round(power, 2),
            "confidence": confidence,
            "expected_efficiency": round(max(0, efficiency), 1),
            "daily_forecast": daily_forecast,
            "curve_data": curve,
            "generation_status": gen_status,
            "current_battery": round(battery_current, 2),
            "total_available": round(energy_status["total_available"], 2),
            "energy_availability": energy_status["label"],
            "appliances": appliances,
            "recommended_start": best_window["start"],
            "recommended_end": best_window["end"],
            "suitable_appliance_load": PredictionService._suitable_load_text(power),
            "actual_output": None,
            "efficiency_score": efficiency_analysis["score"],
            "efficiency_performance": efficiency_analysis["performance"],
            "maintenance_status": maintenance["status"],
            "maintenance_causes": maintenance["causes"],
            "maintenance_recommendation": maintenance["recommendation"],
            "energy_insight": insight,
            "recommendation": recommendation,
            "weather_impact": weather_analysis["impact"],
            "weather_reliability": weather_analysis["reliability"],
            "weather_explanation": weather_analysis["explanation"],
        }

    @staticmethod
    def _core_power(irradiance, temperature, humidity, clouds, hour, effective_cap):
        efficiency = 95.0
        if hour < 6 or hour > 19:
            return 0.0, 0.0

        power = (irradiance / 1000.0) * effective_cap

        rates = ConfigService.get_penalty_rates()

        if temperature > 25:
            penalty = (temperature - 25) * rates["temp_penalty"]
            power *= 1 - penalty
            efficiency -= penalty * 100
        if temperature < 15 and temperature > 0:
            boost = (15 - temperature) * rates["temp_boost"]
            power *= 1 + boost
            efficiency = min(99, efficiency + boost * 50)

        if clouds > 0:
            cloud_penalty = (clouds / 100.0) * rates["cloud_penalty"]
            power *= 1 - cloud_penalty
            efficiency -= cloud_penalty * 50

        if humidity > 60:
            hum_penalty = (humidity - 60) * rates["humidity_penalty"]
            power *= 1 - hum_penalty
            efficiency -= hum_penalty * 100

        power = max(0.0, power)
        return power, efficiency

    @staticmethod
    def _generation_status(power):
        thresholds = ConfigService.get_generation_thresholds()
        if power > thresholds["excellent"]:
            return "Excellent"
        if power > thresholds["very_good"]:
            return "Very Good"
        if power > thresholds["good"]:
            return "Good"
        if power > thresholds["moderate"]:
            return "Moderate"
        if power > thresholds["low"]:
            return "Low"
        return "Very Low"

    @staticmethod
    def _energy_status(power, battery_cap, battery_current):
        predicted_energy = power
        usable_battery = min(battery_current, battery_cap) if battery_cap > 0 else 0
        total = predicted_energy + usable_battery

        thresholds = ConfigService.get_energy_thresholds()
        if total > thresholds["high"]:
            label = "High"
        elif total > thresholds["moderate"]:
            label = "Moderate"
        elif total > thresholds["low"]:
            label = "Low"
        else:
            label = "Very Low"

        return {"total_available": total, "label": label}

    @staticmethod
    def _appliance_recommendations(power, total_available_kwh):
        available_wh = total_available_kwh * 1000
        profiles = ConfigService.get_appliances()
        if not profiles:
            return []
        results = []
        for app in profiles:
            watts = app["watts"]
            max_hours = available_wh / watts if watts > 0 else 0
            priority = app.get("priority", 99)

            if power <= 0:
                can_run = "No"
                duration = "\u2014"
            elif watts > available_wh * 2 and priority > 5:
                can_run = "Limited"
                duration = f"{max(max_hours, 0):.1f} hrs"
            elif watts > available_wh * 4:
                can_run = "No"
                duration = "\u2014"
            else:
                can_run = "Yes"
                if priority <= 3:
                    duration = "Unlimited"
                elif watts > 0:
                    duration = f"{max_hours:.1f} hrs"
                else:
                    duration = "\u2014"

            results.append({
                "name": app["name"],
                "watts": watts,
                "can_run": can_run,
                "duration": duration,
                "priority": priority,
            })
        return results

    @staticmethod
    def _suitable_load_text(power):
        if power > 4:
            return "Heavy appliances (AC, Water Pump, Iron)"
        if power > 2.5:
            return "Medium appliances (Washing Machine, Refrigerator)"
        if power > 1:
            return "Light appliances (Lights, Fans, TV)"
        return "Only essential low-power devices"

    @staticmethod
    def _best_time_window(hour, clouds):
        peak = ConfigService.get_peak_hours()
        mid = max(peak["start"], min(peak["end"], hour))
        start = f"{mid}:00"
        end = f"{mid + 2}:00"
        return {"start": start, "end": end}

    @staticmethod
    def _weather_impact(clouds, temperature, humidity, wind):
        thresholds = ConfigService.get_weather_thresholds()

        if clouds > thresholds["high_cloud"]:
            impact = "High"
            reliability = "Low"
            explanation = "High cloud cover \u2014 solar production may decrease significantly"
        elif clouds > thresholds["moderate_cloud"]:
            impact = "Moderate"
            reliability = "Moderate"
            explanation = "Moderate cloud cover \u2014 expect variable generation"
        elif clouds > thresholds["low_cloud"]:
            impact = "Low"
            reliability = "High"
            explanation = "Mostly clear \u2014 good solar conditions"
        else:
            impact = "Very Low"
            reliability = "High"
            explanation = "Clear skies \u2014 excellent solar conditions"

        if temperature > thresholds["high_temp"]:
            explanation += ". High temperature may reduce panel efficiency"
        elif temperature < thresholds["cold_temp"]:
            explanation += ". Cold weather \u2014 generation may be slightly higher"
        if humidity > thresholds["high_humidity"]:
            explanation += ". High humidity may affect transmission efficiency"

        return {"impact": impact, "reliability": reliability, "explanation": explanation}

    @staticmethod
    def _maintenance_analysis(power, clouds, temperature):
        issues = []
        if power > 0 and power < 0.3:
            issues.append("Dust accumulation")
            issues.append("Partial shading")
        if power > 0 and clouds < 20 and power < 1.0:
            issues.append("Panel degradation")
        if temperature > 45 and power > 0:
            issues.append("Overheating risk")

        if len(issues) >= 2:
            return {
                "status": "Inspection Recommended",
                "causes": ", ".join(issues[:3]),
                "recommendation": "Clean panels and inspect wiring. Schedule professional maintenance.",
            }
        elif len(issues) == 1:
            return {
                "status": "Monitor Closely",
                "causes": issues[0],
                "recommendation": f"Check for {issues[0].lower()}. Schedule cleaning if needed.",
            }
        else:
            return {
                "status": "Normal",
                "causes": "",
                "recommendation": "All systems operating normally. No maintenance required.",
            }

    @staticmethod
    def _efficiency_analysis(data, predicted_power):
        actual = None
        for key in ("actual_output",):
            if key in data and data[key] is not None:
                try:
                    actual = float(data[key])
                except (ValueError, TypeError):
                    pass
        if actual is not None and predicted_power > 0:
            score = round(min(100, (actual / predicted_power) * 100), 1)
            if score >= 90:
                perf = "Excellent"
            elif score >= 75:
                perf = "Good"
            elif score >= 60:
                perf = "Fair"
            else:
                perf = "Needs Improvement"
            return {"score": score, "performance": perf}
        return {"score": None, "performance": ""}

    @staticmethod
    def _energy_insight(power, clouds, hour, gen_status, window):
        parts = []
        if power > 0:
            parts.append(f"Solar generation is expected to remain {gen_status.lower()} until approximately {window['end']}.")
            if power > 2:
                parts.append("Running high-power appliances during this window may reduce dependence on battery storage.")
            else:
                parts.append("Consider limiting appliance usage to essential devices during this period.")
        else:
            parts.append("Solar generation is not available at this time. Please rely on battery or grid power.")

        if clouds and clouds > 50:
            parts.append("Reduced generation due to cloud cover is expected throughout the day.")
        elif power > 3:
            parts.append("Excellent generation conditions \u2014 maximize appliance usage during peak hours.")

        return " ".join(parts)

    @staticmethod
    def _recommendation(power, clouds, gen_status):
        if clouds and clouds > ConfigService.get_float("weather_high_cloud", 70):
            return "Cloudy weather expected to reduce output. Delay heavy appliances and prioritize battery charging."
        if gen_status in ("Excellent", "Very Good"):
            return "High solar generation expected. Best time for heavy appliances like AC, water pump, and washing machine."
        if power >= 2:
            return "Panel operating normally. Moderate usage recommended. Good time for medium-load appliances."
        if power >= 0.5:
            return "Low output. Avoid heavy appliance usage. Battery charging recommended during available sunlight."
        return "No significant solar output expected. Use grid or battery storage for all needs."

    @staticmethod
    def _curve_data(power, hour=12):
        hours = list(range(6, 19))
        curve = []
        for h in hours:
            dist = 1 - abs(h - hour) / 12 if h != hour else 1.0
            val = max(0, power * dist * (1 - 0.1 * abs(h - hour) / 6))
            curve.append(round(val, 2))
        return {"labels": [f"{h}:00" for h in hours], "values": curve}

    @staticmethod
    def get_history(user_id, limit=20):
        records = PredictionRepository.list_by_user(user_id, limit=limit)
        return [r.to_dict() for r in records]

    @staticmethod
    def get_by_id(prediction_id):
        return PredictionRepository.get_by_id(prediction_id)

    @staticmethod
    def delete(prediction_id, user_id):
        record = PredictionRepository.get_by_id(prediction_id)
        if not record or record.user_id != user_id:
            return None
        PredictionRepository.delete(record)
        log_activity(user_id, f"Prediction {record.prediction_id} deleted", "prediction")
        return record
