from marshmallow import Schema, fields


class PredictionRequestSchema(Schema):
    date = fields.Str(required=True)
    time = fields.Str(required=True)

    # Environmental
    temperature = fields.Float(required=True)
    humidity = fields.Float(load_default=0)
    cloud_cover = fields.Float(load_default=0)
    solar_irradiance = fields.Float(required=True)
    wind_speed = fields.Float(load_default=0)
    weather_condition = fields.Str(load_default="")

    # Solar system info
    panel_capacity = fields.Float(load_default=5.0)
    panel_type = fields.Str(load_default="Monocrystalline")
    panel_count = fields.Integer(load_default=1)
    installation_angle = fields.Float(load_default=30)
    battery_capacity = fields.Float(load_default=0)
    battery_current = fields.Float(load_default=0)
    location = fields.Str(load_default="")
