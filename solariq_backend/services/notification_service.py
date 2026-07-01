from models.notification import Notification
from extensions import db
from utils.activity_logger import log_activity


class NotificationService:
    @staticmethod
    def list_for_user(user_id, limit=50):
        notifs = (
            Notification.query
            .filter_by(user_id=user_id)
            .order_by(Notification.created_at.desc())
            .limit(limit)
            .all()
        )
        unread_count = (
            Notification.query
            .filter_by(user_id=user_id, is_read=False)
            .count()
        )
        return {
            "notifications": [n.to_dict() for n in notifs],
            "unread_count": unread_count,
        }

    @staticmethod
    def create(user_id, title, message, type="info"):
        notif = Notification(
            user_id=user_id,
            title=title,
            message=message,
            type=type,
        )
        db.session.add(notif)
        db.session.commit()
        log_activity(user_id, f"Notification: {title}", "notification")
        return notif.to_dict()

    @staticmethod
    def mark_read(user_id, notif_id):
        notif = Notification.query.filter_by(id=notif_id, user_id=user_id).first()
        if not notif:
            return None
        notif.is_read = True
        db.session.commit()
        return notif.to_dict()

    @staticmethod
    def mark_all_read(user_id):
        Notification.query.filter_by(user_id=user_id, is_read=False).update({"is_read": True})
        db.session.commit()
        return True