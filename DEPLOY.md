# SolarIQ Deployment Guide

## 1. Local Development (Easy Mode)

### Option A: One-Click (Windows)
Double-click `start.bat` after running `setup.bat` once.

### Option B: PM2 (Auto-start on boot)
```bash
npm install -g pm2
pm2 start ecosystem.config.js
pm2 save
pm2 startup       # Auto-start on Windows boot
```

### Option C: Manual
```bash
# Terminal 1
cd solariq_backend && ..\venv\Scripts\python app.py

# Terminal 2
cd frontend && npm run dev
```

---

## 2. Production Deployment (VPS / Docker)

### Requirements
- A VPS (Ubuntu 22.04+) — Hetzner, DigitalOcean, Linode ($5-10/mo)
- Domain name (optional)

### Deploy in 2 commands

```bash
# 1. Upload project to VPS
rsync -avz --exclude 'venv' --exclude 'node_modules' --exclude '.env' . user@your-vps:/opt/solariq

# 2. Run deploy
ssh user@your-vps "cd /opt/solariq && bash deploy.sh"
```

Your app will be live at `http://your-vps-ip`

### With Domain + SSL (Recommended)

```bash
# After Docker is running, add SSL with Caddy
docker run -d \
  -v $PWD/Caddyfile:/etc/caddy/Caddyfile \
  -v caddy_data:/data \
  -p 80:80 -p 443:443 \
  caddy
```

Create `Caddyfile`:
```
yourdomain.com {
    reverse_proxy solariq_frontend:80
}
```

---

## 3. Free Hosting Alternative

| Service | Cost | What to deploy |
|---------|------|----------------|
| **Vercel** | Free | Frontend (`frontend/dist/`) |
| **Railway** | Free tier | Backend API + MySQL |
| **PythonAnywhere** | Free | Flask API |

### Quick deploy to Vercel + Railway:
```bash
# Frontend to Vercel
cd frontend
npm i -g vercel
vercel --prod

# Backend to Railway
cd solariq_backend
railway login
railway up
```

---

## 4. Architecture (Docker)

```
Browser ──> :80 ──> Nginx ──> /api/* ──> Flask API ──> MySQL
                    (frontend)              (gunicorn)
```

### URLs after deployment
```
http://your-vps-or-domain     → Frontend (React)
http://your-vps-or-domain/api → Backend API
http://your-vps-or-domain/api/health → Health check
```
