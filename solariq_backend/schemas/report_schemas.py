from marshmallow import Schema, fields


class ReportGenerateSchema(Schema):
    report_type = fields.Str(required=True)
    report_name = fields.Str(load_default=None)
    format = fields.Str(load_default="pdf")
    start_date = fields.Str(load_default=None)
    end_date = fields.Str(load_default=None)
