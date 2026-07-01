from marshmallow import Schema, ValidationError, fields, validates, validates_schema


class RegisterSchema(Schema):
    full_name = fields.Str(required=True)
    email = fields.Email(required=True)
    password = fields.Str(required=True, validate=lambda p: len(p) >= 8)
    phone = fields.Str(load_default=None)
    role = fields.Str(load_default="user")


class LoginSchema(Schema):
    email = fields.Email(required=True)
    password = fields.Str(required=True)


def validate_schema(schema, data, partial=False):
    try:
        return schema.load(data, partial=partial), None
    except ValidationError as err:
        return None, err.messages
