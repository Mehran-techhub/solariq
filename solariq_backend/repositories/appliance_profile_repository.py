from models.appliance_profile import ApplianceProfile


class ApplianceProfileRepository:
    @staticmethod
    def get_all_active():
        return ApplianceProfile.query.filter_by(is_active=True).order_by(ApplianceProfile.priority).all()

    @staticmethod
    def seed_defaults():
        if ApplianceProfile.query.first() is not None:
            return
        defaults = [
            ApplianceProfile(name="LED Bulbs (5 pcs)", watts=50, priority=1),
            ApplianceProfile(name="Ceiling Fan (3 pcs)", watts=225, priority=2),
            ApplianceProfile(name='LED TV (50")', watts=100, priority=3),
            ApplianceProfile(name="Refrigerator", watts=200, priority=4),
            ApplianceProfile(name="Washing Machine", watts=500, priority=5),
            ApplianceProfile(name="Iron", watts=1000, priority=6),
            ApplianceProfile(name="Water Pump", watts=750, priority=7),
            ApplianceProfile(name="Air Conditioner (1.5 ton)", watts=1500, priority=8),
            ApplianceProfile(name="Microwave Oven", watts=1200, priority=9),
            ApplianceProfile(name="Electric Kettle", watts=1500, priority=10),
        ]
        from extensions import db
        for a in defaults:
            db.session.add(a)
        db.session.commit()
