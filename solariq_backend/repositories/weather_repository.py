from extensions import db
from models.weather_data import WeatherData


class WeatherRepository:
    @staticmethod
    def create(item):
        db.session.add(item)
        db.session.commit()
        return item

    @staticmethod
    def latest(limit=24):
        return WeatherData.query.order_by(WeatherData.fetched_at.desc()).limit(limit).all()
