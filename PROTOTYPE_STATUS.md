# SolarIQ Prototype Status

**Verified:** All REST API endpoints pass automated checks (`scripts/verify_prototype.py`).

## What works (real-time, live data)

| Screen | Backend | Status |
|--------|---------|--------|
| Login | `POST /api/auth/login` | Working |
| Register | `POST /api/auth/register` | Working |
| Dashboard | `GET /api/dashboard/stats` | Working — live stats + charts |
| Analytics | `GET /api/analytics/{daily\|weekly\|monthly}` | Working — period selector |
| Prediction | `POST /api/predictions` | Working — rule-based engine (ML-ready) |
| Simulation | `POST /api/simulation/run` | Working |
| Reports | List, generate PDF, download | Working |
| Settings | GET/PUT | Working |
| Monitoring, Weather, Alerts, Profile, Admin | Auth guard | UI only (no dedicated APIs yet) |

## AI / ML

Prediction uses **business-rule calculations** in `PredictionService.calculate()`. The service layer is structured for future ML model drop-in (replace `calculate()` body).

## Run the prototype

**Terminal 1 — API**
```powershell
cd "d:\University\smester 7\fyp\Solar\solariq_backend"
..\venv\Scripts\python.exe app.py
```

**Terminal 2 — Frontend**
```powershell
cd "d:\University\smester 7\fyp\Solar"
python -m http.server 8000
```

**Browser:** http://localhost:8000/public/login.html  

**Demo login:** `demo@solariq.com` / `Demo@1234`

## Database

- **Default:** SQLite at `solariq_backend/instance/solariq.db` (auto-created on start)
- **MySQL Workbench:** Run `setup_local.bat`, then set `DATABASE_URL` in `.env`

## Bugs fixed in this audit

- Wrong auth redirect (`../public/login.html` → `login.html`)
- SQLite path / missing `instance/` folder
- No `.env` / DB init on startup
- Dashboard & analytics charts not updating from API
- Simulation appliance selector mismatch
- Reports page duplicate event listeners
- Missing auth on secondary protected pages
- Network error message when API offline
- JWT error responses standardized
