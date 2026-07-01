from extensions import db
from models.activity_log import ActivityLog


def log_activity(user_id, action, module):
    entry = ActivityLog(user_id=user_id, action=action, module=module)
    db.session.add(entry)
    db.session.commit()
