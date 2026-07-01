from marshmallow import Schema, fields


class ApplianceSchema(Schema):
    name = fields.Str(required=True)
    wattage = fields.Float(required=True)


class SimulationRequestSchema(Schema):
    appliances = fields.List(fields.Nested(ApplianceSchema), required=True)
