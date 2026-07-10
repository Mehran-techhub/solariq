import os
import json
import logging
import numpy as np

from services.prediction_service import PredictionService as CorePredictionService

logger = logging.getLogger(__name__)

MODEL_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "ml_models", "solar_model.pkl")
PIPELINES_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "ml", "pipelines")
FEATURES = ['temperature', 'humidity', 'cloud_cover', 'wind_speed', 'pressure', 'irradiance', 'hour', 'month']

class MLPredictionService:
    _model_cache = None
    _preprocessor_cache = None

    @classmethod
    def _load_model(cls):
        if cls._model_cache is not None and cls._preprocessor_cache is not None:
            return cls._model_cache, cls._preprocessor_cache
            
        if not os.path.exists(MODEL_PATH):
            logger.info("No trained model found at %s — using rule-based fallback", MODEL_PATH)
            cls._model_cache = False
            cls._preprocessor_cache = False
            return None, None
            
        try:
            import joblib
            from .preprocessing.preprocessing import SolarDataPreprocessor
            
            cls._model_cache = joblib.load(MODEL_PATH)
            cls._preprocessor_cache = SolarDataPreprocessor.load(PIPELINES_DIR)
            
            logger.info("ML model and preprocessor loaded successfully")
            return cls._model_cache, cls._preprocessor_cache
        except Exception as e:
            logger.warning("Failed to load ML model: %s — using rule-based fallback", e)
            cls._model_cache = False
            cls._preprocessor_cache = False
            return None, None

    @staticmethod
    def predict_solar_output(inputs: dict) -> dict:
        model, preprocessor = MLPredictionService._load_model()
        if model and preprocessor:
            try:
                return MLPredictionService._ml_predict(inputs, model, preprocessor)
            except Exception as e:
                logger.warning("ML inference failed: %s — falling back to rule-based", e)
        return CorePredictionService.calculate(inputs)

    @staticmethod
    def _ml_predict(inputs: dict, model, preprocessor) -> dict:
        import pandas as pd
        from datetime import datetime

        time_str = inputs.get("time", "12:00")
        hour = int(time_str.split(":")[0]) if ":" in time_str else 12
        
        # Extract date or use current
        date_str = inputs.get("date", datetime.now().strftime("%Y-%m-%d"))
        try:
            month = datetime.strptime(date_str, "%Y-%m-%d").month
        except:
            month = 6

        row = {
            "temperature": float(inputs.get("temperature", 25)),
            "humidity": float(inputs.get("humidity", 50)),
            "cloud_cover": float(inputs.get("cloud_cover", inputs.get("clouds", 0))),
            "wind_speed": float(inputs.get("wind_speed", 5)),
            "pressure": float(inputs.get("pressure", 1013)),
            "irradiance": float(inputs.get("solar_irradiance", inputs.get("sunlight", 800))),
            "hour": hour,
            "month": month,
        }

        df = pd.DataFrame([row])
        X_scaled = preprocessor.preprocess_inference(df)
        ml_power = float(model.predict(X_scaled)[0])
        ml_power = max(0.0, ml_power)

        effective_cap = float(inputs.get("panel_capacity", 5.0)) * int(inputs.get("panel_count", 1))
        max_possible = effective_cap * 1.2
        ml_power = min(ml_power, max_possible)

        result = CorePredictionService.calculate(inputs)
        result["predicted_output"] = round(ml_power, 2)
        result["confidence"] = round(min(98.0, 70.0 + (ml_power / max_possible) * 28.0), 1) if max_possible > 0 else 70.0

        irradiance = row["irradiance"]
        clouds = row["cloud_cover"]
        temperature = row["temperature"]

        gen_status = MLPredictionService._generation_status(ml_power)
        result["generation_status"] = gen_status
        daily_forecast = round(ml_power * 5.5, 1)
        result["daily_forecast"] = daily_forecast
        result["curve_data"] = CorePredictionService._curve_data(ml_power, hour)

        battery_cap = float(inputs.get("battery_capacity", 0))
        battery_current = float(inputs.get("battery_current", 0))
        energy_status = CorePredictionService._energy_status(ml_power, battery_cap, battery_current)
        result["current_battery"] = round(battery_current, 2)
        result["total_available"] = round(energy_status["total_available"], 2)
        result["energy_availability"] = energy_status["label"]

        weather_analysis = CorePredictionService._weather_impact(clouds, temperature, float(inputs.get("humidity", 0)), float(inputs.get("wind_speed", 0)))
        result["weather_impact"] = weather_analysis["impact"]
        result["weather_reliability"] = weather_analysis["reliability"]
        result["weather_explanation"] = weather_analysis["explanation"]

        maintenance = CorePredictionService._maintenance_analysis(ml_power, clouds, temperature)
        result["maintenance_status"] = maintenance["status"]
        result["maintenance_causes"] = maintenance["causes"]
        result["maintenance_recommendation"] = maintenance["recommendation"]

        result["appliances"] = CorePredictionService._appliance_recommendations(ml_power, energy_status["total_available"])
        best_window = CorePredictionService._best_time_window(hour, clouds)
        result["recommended_start"] = best_window["start"]
        result["recommended_end"] = best_window["end"]
        result["suitable_appliance_load"] = CorePredictionService._suitable_load_text(ml_power)

        result["expected_efficiency"] = round(min(99.0, (ml_power / max_possible) * 100), 1) if max_possible > 0 else 0
        result["energy_insight"] = CorePredictionService._energy_insight(ml_power, clouds, hour, gen_status, best_window)
        result["recommendation"] = CorePredictionService._recommendation(ml_power, clouds, gen_status)

        efficiency_analysis = CorePredictionService._efficiency_analysis(inputs, ml_power)
        result["efficiency_score"] = efficiency_analysis["score"]
        result["efficiency_performance"] = efficiency_analysis["performance"]
        result["actual_output"] = None

        return result

    @staticmethod
    def _generation_status(power):
        if power > 4: return "Excellent"
        if power > 3: return "Very Good"
        if power > 2: return "Good"
        if power > 1: return "Moderate"
        if power > 0.5: return "Low"
        return "Very Low"

    @staticmethod
    def save_prediction_history(user_id, data, result):
        return CorePredictionService.create_prediction(user_id, data)
