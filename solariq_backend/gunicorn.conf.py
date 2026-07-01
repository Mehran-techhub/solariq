import os

bind = f"0.0.0.0:{os.getenv('PORT', '5000')}"
workers = int(os.getenv("GUNICORN_WORKERS", "4"))
threads = int(os.getenv("GUNICORN_THREADS", "2"))
timeout = 120
accesslog = "-"
errorlog = "-"
loglevel = os.getenv("LOG_LEVEL", "info")
