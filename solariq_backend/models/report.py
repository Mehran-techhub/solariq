from datetime import datetime, timezone

from utils.pkt_timezone import PKT

from extensions import db


class Report(db.Model):
    __tablename__ = "reports"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False, index=True)
    report_type = db.Column(db.String(50), nullable=False)
    report_name = db.Column(db.String(200), nullable=False)
    file_path = db.Column(db.String(500), nullable=False)
    generated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    def to_dict(self):
        return {
            "id": self.id,
            "report_type": self.report_type,
            "report_name": self.report_name,
            "file_path": self.file_path,
            "generated_at": self.generated_at.replace(tzinfo=timezone.utc).astimezone(PKT).isoformat() if self.generated_at else None,
        }
