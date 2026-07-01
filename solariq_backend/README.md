# SolarIQ Backend API

Production-ready Flask REST API for the SolarIQ solar energy monitoring platform.

## Stack

- Python 3.12, Flask, SQLAlchemy, MySQL 8
- JWT authentication (Flask-JWT-Extended)
- Marshmallow validation, Flask-Migrate, Flask-CORS
- Docker + Gunicorn deployment

## Quick Start (Local)

```bash
# From the repository root, create and activate the shared venv
python -m venv venv
.\venv\Scripts\Activate.ps1    # Windows PowerShell

# Then install backend dependencies
cd solariq_backend
pip install -r requirements.txt
copy .env.example .env
```

If you are already inside `solariq_backend`, activate the repository root virtual environment with:

```powershell
..\venv\Scripts\Activate.ps1
```

Start MySQL (Docker):

```bash
docker compose up mysql -d
```

Initialize database:

```bash
set FLASK_APP=app.py
flask init-db
# Or with migrations:
flask db init
flask db migrate -m "Initial schema"
flask db upgrade
```

Run API:

```bash
python app.py
```

API base URL: `http://127.0.0.1:5000/api`

## Docker (Full Stack)

From project root:

```bash
copy solariq_backend\.env.example solariq_backend\.env
docker compose up --build
```

Then initialize tables inside the API container:

```bash
docker compose exec api flask init-db
```

## API Endpoints

| Method | Endpoint | Auth |
|--------|----------|------|
| POST | `/api/auth/register` | No |
| POST | `/api/auth/login` | No |
| GET | `/api/dashboard/stats` | JWT |
| GET | `/api/analytics/daily` | JWT |
| GET | `/api/analytics/weekly` | JWT |
| GET | `/api/analytics/monthly` | JWT |
| POST | `/api/predictions` | JWT |
| POST | `/api/simulation/run` | JWT |
| GET | `/api/reports` | JWT |
| POST | `/api/reports/generate` | JWT |
| GET | `/api/reports/download/{id}` | JWT |
| GET | `/api/settings` | JWT |
| PUT | `/api/settings` | JWT |
| GET | `/api/health` | No |
| GET | `/api/docs` | No (OpenAPI summary) |

## Response Format

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {}
}
```

Login/register also include top-level `token` and `user` fields.

## Frontend Integration

See `../src/app/apiService.js` and serve the frontend on port 8000 while the API runs on port 5000.
