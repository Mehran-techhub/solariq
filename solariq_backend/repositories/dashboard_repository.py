from extensions import db
from models.dashboard import DashboardStats


class DashboardRepository:
    @staticmethod
    def get_latest(user_id):
        return (
            DashboardStats.query.filter_by(user_id=user_id)
            .order_by(DashboardStats.created_at.desc())
            .first()
        )

    @staticmethod
    def create(stats):
        db.session.add(stats)
        db.session.commit()
        return stats

    @staticmethod
    def update(stats):
        db.session.commit()
        return stats
