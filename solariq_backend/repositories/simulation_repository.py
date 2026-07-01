from extensions import db
from models.simulation import Simulation


class SimulationRepository:
    @staticmethod
    def create_batch(records):
        db.session.add_all(records)
        db.session.commit()
        return records

    @staticmethod
    def list_by_user(user_id, limit=50):
        return (
            Simulation.query
            .filter_by(user_id=user_id)
            .order_by(Simulation.created_at.desc())
            .limit(limit)
            .all()
        )
