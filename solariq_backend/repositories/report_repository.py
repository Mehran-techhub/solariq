from extensions import db
from models.report import Report


class ReportRepository:
    @staticmethod
    def list_by_user(user_id):
        return (
            Report.query.filter_by(user_id=user_id)
            .order_by(Report.generated_at.desc())
            .all()
        )

    @staticmethod
    def find_by_id(user_id, report_id):
        return Report.query.filter_by(user_id=user_id, id=report_id).first()

    @staticmethod
    def create(report):
        db.session.add(report)
        db.session.commit()
        return report
