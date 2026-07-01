from models.system_setting import SystemSetting
from models.appliance_profile import ApplianceProfile
from repositories.appliance_profile_repository import ApplianceProfileRepository


class ConfigService:
    _cache = {}

    @classmethod
    def _load(cls):
        if cls._cache:
            return cls._cache
        settings = SystemSetting.query.all()
        cls._cache = {s.setting_key: s.setting_value for s in settings}
        return cls._cache

    @classmethod
    def invalidate(cls):
        cls._cache = {}

    @classmethod
    def get(cls, key, default=None):
        cfg = cls._load()
        val = cfg.get(key, default)
        if val is not None:
            try:
                s = str(val).strip()
                if s.replace("-", "").replace(".", "").isdigit() and "." in s:
                    return float(s)
                if s.lstrip("-").isdigit():
                    return int(s)
                return val
            except (ValueError, TypeError):
                return val
        return default

    @classmethod
    def get_float(cls, key, default=0.0):
        try:
            return float(cls.get(key, default))
        except (ValueError, TypeError):
            return default

    @classmethod
    def get_int(cls, key, default=0):
        try:
            return int(cls.get(key, default))
        except (ValueError, TypeError):
            return default

    @classmethod
    def get_appliances(cls):
        profiles = ApplianceProfileRepository.get_all_active()
        if profiles:
            return [p.to_dict() for p in profiles]
        return []

    @classmethod
    def get_generation_thresholds(cls):
        return {
            "excellent": cls.get_float("threshold_excellent", 4.0),
            "very_good": cls.get_float("threshold_very_good", 3.0),
            "good": cls.get_float("threshold_good", 2.0),
            "moderate": cls.get_float("threshold_moderate", 1.0),
            "low": cls.get_float("threshold_low", 0.5),
        }

    @classmethod
    def get_weather_thresholds(cls):
        return {
            "high_cloud": cls.get_float("weather_high_cloud", 70),
            "moderate_cloud": cls.get_float("weather_moderate_cloud", 40),
            "low_cloud": cls.get_float("weather_low_cloud", 20),
            "high_temp": cls.get_float("weather_high_temp", 40),
            "cold_temp": cls.get_float("weather_cold_temp", 10),
            "high_humidity": cls.get_float("weather_high_humidity", 70),
        }

    @classmethod
    def get_penalty_rates(cls):
        return {
            "temp_penalty": cls.get_float("temp_penalty_rate", 0.005),
            "cloud_penalty": cls.get_float("cloud_penalty_rate", 0.4),
            "humidity_penalty": cls.get_float("humidity_penalty_rate", 0.001),
            "temp_boost": cls.get_float("temp_boost_rate", 0.002),
        }

    @classmethod
    def get_energy_thresholds(cls):
        return {
            "high": cls.get_float("energy_high", 4.0),
            "moderate": cls.get_float("energy_moderate", 2.0),
            "low": cls.get_float("energy_low", 1.0),
        }

    @classmethod
    def get_peak_hours(cls):
        return {
            "start": cls.get_int("peak_hour_start", 10),
            "end": cls.get_int("peak_hour_end", 14),
        }
