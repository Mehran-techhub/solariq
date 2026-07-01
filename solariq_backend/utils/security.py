import re
import bleach
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_talisman import Talisman

limiter = Limiter(key_func=get_remote_address)
talisman = Talisman()

ALLOWED_TAGS = ["b", "i", "u", "a", "br", "strong", "em"]
ALLOWED_ATTRS = {"a": ["href", "title", "rel"]}


def sanitize_input(value):
    if isinstance(value, str):
        value = bleach.clean(value, tags=ALLOWED_TAGS, attributes=ALLOWED_ATTRS, strip=True)
        return value.strip()
    if isinstance(value, dict):
        return {k: sanitize_input(v) for k, v in value.items()}
    if isinstance(value, list):
        return [sanitize_input(v) for v in value]
    return value


def sanitize_payload(payload):
    return sanitize_input(payload)


def validate_password_strength(password):
    if len(password) < 8:
        return "Password must be at least 8 characters"
    if not re.search(r"[A-Z]", password):
        return "Password must contain an uppercase letter"
    if not re.search(r"[a-z]", password):
        return "Password must contain a lowercase letter"
    if not re.search(r"[0-9]", password):
        return "Password must contain a number"
    if not re.search(r"[^A-Za-z0-9]", password):
        return "Password must contain a special character"
    return None


def init_security(app):
    csp = {
        "default-src": ["'self'"],
        "script-src": ["'self'", "'unsafe-inline'", "'unsafe-eval'",
                       "https://accounts.google.com"],
        "style-src": ["'self'", "'unsafe-inline'",
                      "https://fonts.googleapis.com"],
        "font-src": ["'self'", "https://fonts.gstatic.com"],
        "img-src": ["'self'", "data:", "blob:", "http://localhost:5000"],
        "connect-src": ["'self'", "http://localhost:5000"],
    }
    talisman.init_app(
        app,
        force_https=False,
        frame_options="DENY",
        strict_transport_security=True,
        session_cookie_secure=False,
        content_security_policy=csp,
        referrer_policy="strict-origin-when-cross-origin",
    )
    limiter.init_app(app)
