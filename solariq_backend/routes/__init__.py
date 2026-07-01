from routes.auth import auth_bp
from routes.dashboard import dashboard_bp
from routes.analytics import analytics_bp
from routes.prediction import prediction_bp
from routes.simulation import simulation_bp
from routes.reports import reports_bp
from routes.settings import settings_bp
from routes.solar import solar_bp
from routes.weather import weather_bp
from routes.recommendations import recommendations_bp
from routes.maintenance import maintenance_bp
from routes.efficiency import efficiency_bp
from routes.users import users_bp
from routes.activity import activity_bp
from routes.admin import admin_bp
from routes.notifications import notifications_bp


def register_blueprints(app):
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(dashboard_bp, url_prefix="/api/dashboard")
    app.register_blueprint(analytics_bp, url_prefix="/api/analytics")
    app.register_blueprint(prediction_bp, url_prefix="/api")
    app.register_blueprint(simulation_bp, url_prefix="/api/simulation")
    app.register_blueprint(reports_bp, url_prefix="/api/reports")
    app.register_blueprint(settings_bp, url_prefix="/api/settings")
    app.register_blueprint(solar_bp, url_prefix="/api/solar")
    app.register_blueprint(weather_bp, url_prefix="/api/weather")
    app.register_blueprint(recommendations_bp, url_prefix="/api/recommendations")
    app.register_blueprint(maintenance_bp, url_prefix="/api/maintenance")
    app.register_blueprint(efficiency_bp, url_prefix="/api/efficiency")
    app.register_blueprint(users_bp, url_prefix="/api/users")
    app.register_blueprint(activity_bp, url_prefix="/api/activity")
    app.register_blueprint(admin_bp, url_prefix="/api/admin")
    app.register_blueprint(notifications_bp, url_prefix="/api/notifications")

