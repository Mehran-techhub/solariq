# SolarIQ — Solar Energy Management Platform

## Run (2 seconds)

```bash
# Windows — double click start.bat, ya:
pm2 start ecosystem.config.js    # Auto-restart on crash
```

## Deploy (VPS / Docker)

```bash
docker compose up -d --build     # Full stack: MySQL + API + Frontend
```

Open http://localhost

---

### Credentials (auto-seeded)
- **User:** `demo@solariq.com` / `Demo@1234`
- **Admin:** `admin@solariq.com` / `Admin@1234`

### Stack
- **Frontend:** React 19 + Vite + Tailwind
- **Backend:** Flask + SQLAlchemy
- **Database:** MySQL 8
- **Deploy:** Docker Compose / PM2
