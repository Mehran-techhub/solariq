FROM python:3.12-slim

WORKDIR /app

# Install Node.js for frontend build
RUN apt-get update && apt-get install -y curl gnupg && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    rm -rf /var/lib/apt/lists/*

# Backend dependencies
COPY solariq_backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Frontend build
COPY frontend/package.json frontend/package-lock.json ./frontend/
RUN cd frontend && npm ci --silent
COPY frontend/ ./frontend/
RUN cd frontend && npm run build

# Backend code
COPY solariq_backend/ ./solariq_backend/
COPY .env ./

ENV FLASK_ENV=production
ENV PYTHONUNBUFFERED=1
ENV PORT=8080

EXPOSE 8080

CMD cd solariq_backend && gunicorn -c gunicorn.conf.py wsgi:app
