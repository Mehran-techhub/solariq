from extensions import db
from models.solar_record import SolarRecord
from repositories.solar_repository import SolarRepository
from utils.activity_logger import log_activity


class SolarService:
    @staticmethod
    def list_records(user_id, limit=200):
        recs = SolarRepository.list_for_user(user_id, limit=limit)
        return [r.to_dict() for r in recs]

    @staticmethod
    def create_record(user_id, payload):
        from datetime import datetime, timezone
        record_date = payload.get("record_date")
        if record_date:
            try:
                record_date = datetime.fromisoformat(record_date)
            except (ValueError, TypeError):
                record_date = datetime.now(timezone.utc)
        rec = SolarRecord(
            user_id=user_id,
            temperature=payload.get("temperature"),
            humidity=payload.get("humidity"),
            cloud_cover=payload.get("cloud_cover"),
            irradiance=payload.get("irradiance"),
            actual_output=payload.get("actual_output"),
            notes=payload.get("notes", ""),
            record_date=record_date,
        )
        SolarRepository.create(rec)
        log_activity(user_id, "Solar record created", "solar")
        return rec.to_dict()

    @staticmethod
    def update_record(user_id, rec_id, payload):
        from datetime import datetime
        rec = SolarRepository.find_by_id(rec_id)
        if not rec or rec.user_id != user_id:
            return None
        for k in ("temperature", "humidity", "cloud_cover", "irradiance", "actual_output", "notes"):
            if k in payload:
                setattr(rec, k, payload.get(k))
        if "record_date" in payload:
            try:
                rec.record_date = datetime.fromisoformat(payload["record_date"])
            except (ValueError, TypeError):
                pass
        db.session.commit()
        log_activity(user_id, "Solar record updated", "solar")
        return rec.to_dict()

    @staticmethod
    def delete_record(user_id, rec_id):
        rec = SolarRepository.find_by_id(rec_id)
        if not rec or rec.user_id != user_id:
            return False
        SolarRepository.delete(rec)
        log_activity(user_id, "Solar record deleted", "solar")
        return True
