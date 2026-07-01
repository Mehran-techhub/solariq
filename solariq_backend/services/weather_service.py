from datetime import datetime, timedelta
from utils.pkt_timezone import PKT

import requests
from flask import current_app

from models.weather_data import WeatherData
from repositories.weather_repository import WeatherRepository
from utils.activity_logger import log_activity


class WeatherService:
    GEO_URL = "https://api.openweathermap.org/geo/1.0/direct"
    WEATHER_URL = "https://api.openweathermap.org/data/2.5/weather"
    UV_URL = "https://api.openweathermap.org/data/2.5/uvi"

    @staticmethod
    def _get_api_key():
        return current_app.config.get("OPENWEATHER_API_KEY") or ""

    @staticmethod
    def _compute_solar_impact(clouds, temp):
        if clouds > 70:
            impact = "High cloud cover \u2014 solar production may decrease significantly"
            outlook = "Low"
        elif clouds > 40:
            impact = "Moderate cloud cover \u2014 expect variable generation"
            outlook = "Moderate"
        elif clouds > 20:
            impact = "Mostly clear \u2014 good solar conditions"
            outlook = "Good"
        else:
            impact = "Clear skies \u2014 excellent solar conditions"
            outlook = "Excellent"
        if temp > 40:
            impact += ". High temperature may reduce panel efficiency"
        elif temp < 10:
            impact += ". Cold weather, generation may be slightly higher"
        return impact, outlook

    @staticmethod
    def geocode(city_name, limit=5):
        key = WeatherService._get_api_key()
        if not key:
            raise RuntimeError("OpenWeather API key not configured")
        r = requests.get(WeatherService.GEO_URL, params={"q": city_name, "limit": limit, "appid": key}, timeout=10)
        r.raise_for_status()
        results = r.json()
        if not results:
            return []
        return [
            {
                "lat": item["lat"],
                "lon": item["lon"],
                "display_name": f'{item.get("name", "")}, {item.get("state", "")}, {item.get("country", "")}',
                "country": item.get("country", ""),
                "state": item.get("state", ""),
            }
            for item in results
        ]

    @staticmethod
    def fetch_and_store(lat=None, lon=None, user_id=None):
        key = WeatherService._get_api_key()
        if not key:
            raise RuntimeError("OpenWeather API key not configured")

        params = {"appid": key, "units": "metric"}
        if lat and lon:
            params.update({"lat": lat, "lon": lon})

        r = requests.get(WeatherService.WEATHER_URL, params=params, timeout=10)
        if r.status_code == 401:
            raise RuntimeError("OpenWeather API key is invalid or not activated. Go to openweathermap.org and activate it.")
        r.raise_for_status()
        j = r.json()

        main = j.get("main", {})
        weather = j.get("weather", [{}])[0]
        clouds = j.get("clouds", {}).get("all", 0)
        wind = j.get("wind", {})
        sys = j.get("sys", {})
        temp = main.get("temp", 25)

        sunrise_ts = sys.get("sunrise")
        sunset_ts = sys.get("sunset")
        sunrise = datetime.fromtimestamp(sunrise_ts, tz=PKT).strftime("%I:%M %p") if sunrise_ts else ""
        sunset = datetime.fromtimestamp(sunset_ts, tz=PKT).strftime("%I:%M %p") if sunset_ts else ""

        uv_index = 0
        try:
            uv_r = requests.get(WeatherService.UV_URL, params={"lat": lat or 33.7, "lon": lon or 73.0, "appid": key}, timeout=5)
            if uv_r.ok:
                uv_index = uv_r.json().get("value", 0)
        except requests.RequestException:
            pass

        solar_impact, generation_outlook = WeatherService._compute_solar_impact(clouds, temp)

        item = WeatherData(
            temperature=temp,
            humidity=main.get("humidity"),
            cloud_cover=clouds,
            weather_condition=weather.get("description", ""),
            wind_speed=wind.get("speed", 0),
            uv_index=uv_index,
            sunrise=sunrise,
            sunset=sunset,
            solar_impact=solar_impact,
            generation_outlook=generation_outlook,
        )
        WeatherRepository.create(item)
        log_activity(user_id, f"Weather data fetched (lat={lat}, lon={lon})", "weather")
        return item.to_dict()

    @staticmethod
    def latest(limit=24):
        items = WeatherRepository.latest(limit=limit)
        return [w.to_dict() for w in items]
