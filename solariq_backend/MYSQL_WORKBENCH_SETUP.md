# MySQL Workbench — SolarIQ Local Setup

## Step 1: Confirm MySQL is running

In MySQL Workbench, open your **Local instance** connection. If it connects, MySQL is running on port **3306**.

## Step 2: Bootstrap (automated — recommended)

Open PowerShell in `solariq_backend` and run (use your **root** password from Workbench):

```powershell
cd "d:\University\smester 7\fyp\Solar\solariq_backend"
..\venv\Scripts\python.exe scripts\bootstrap_mysql.py --root-password YOUR_ROOT_PASSWORD
```

This will:

- Create database `solariq_db`
- Create user `solariq` with a dedicated app password
- Generate secure `.env` (SECRET_KEY, JWT_SECRET_KEY)
- Create all tables
- Seed demo user: **demo@solariq.com** / **Demo@1234**
- Test API connection

## Step 3: Add Workbench connection for the app user

In Workbench → **Database** → **Manage Connections** → **New**:

| Field | Value |
|--------|--------|
| Connection Name | SolarIQ App |
| Hostname | 127.0.0.1 |
| Port | 3306 |
| Username | solariq |
| Password | `SolarIQ_Local_2026!` (or your `--app-password`) |
| Default Schema | solariq_db |

Click **Test Connection** → should succeed.

## Step 4: Run prototype

```powershell
.\scripts\start_prototype.ps1
```

Or manually:

```powershell
# Terminal 1 — API
python app.py

# Terminal 2 — Frontend (project root)
cd ..
python -m http.server 8000
```

Open: http://localhost:8000/public/login.html

## Manual SQL (alternative)

If you prefer Workbench only, run `scripts/setup_mysql_workbench.sql` as root, then:

```powershell
python scripts/bootstrap_mysql.py --skip-server
```

## Troubleshooting

| Error | Fix |
|--------|-----|
| Access denied for 'root' | Use correct `--root-password` |
| Can't connect to MySQL | Start MySQL80 service in Windows Services |
| Port 3306 in use | Check Workbench connection port matches `.env` |
