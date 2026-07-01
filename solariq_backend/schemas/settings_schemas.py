from marshmallow import Schema, fields, INCLUDE


class SettingsUpdateSchema(Schema):
    class Meta:
        unknown = INCLUDE

    theme = fields.Str()
    notifications = fields.Bool()
    email_alerts = fields.Bool()
    timezone = fields.Str()
    openweather_api_key = fields.Str()
