from extensions import db


class SystemSetting(db.Model):
    __tablename__ = "system_settings"

    id = db.Column(db.Integer, primary_key=True)
    setting_key = db.Column(db.String(120), unique=True, nullable=False, index=True)
    setting_value = db.Column(db.String(500))

    def to_dict(self):
        return {"setting_key": self.setting_key, "setting_value": self.setting_value}
