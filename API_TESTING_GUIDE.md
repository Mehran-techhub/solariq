# SolarIQ API Testing & Integration Guide

## Status Overview

### ✅ Working Endpoints (Verified)
- **Authentication**
  - `POST /api/auth/register` - Register new user ✅
  - `POST /api/auth/login` - Login user ✅
  - `POST /api/auth/forgot-password` - Initiate password reset ✅
  - `POST /api/auth/reset-password` - Complete password reset ✅
  - `POST /api/auth/google` - Google/Social login ✅

- **Dashboard**
  - `GET /api/dashboard/stats` - Get dashboard statistics ✅
  - `GET /api/dashboard/overview` - Get dashboard overview ✅

- **Settings**
  - `GET /api/settings` - Get user settings ✅
  - `PUT /api/settings` - Update user settings ✅

- **Solar**
  - `GET /api/solar` - List solar records ✅
  - `POST /api/solar` - Create solar record ✅
  - `PUT /api/solar/{id}` - Update solar record ✅
  - `DELETE /api/solar/{id}` - Delete solar record ✅

- **Reports**
  - `GET /api/reports` - List reports ✅
  - `POST /api/reports/generate` - Generate report ✅

- **Recommendations**
  - `GET /api/recommendations` - List recommendations ✅
  - `POST /api/recommendations` - Create recommendation ✅

- **Maintenance**
  - `GET /api/maintenance` - List maintenance alerts ✅
  - `POST /api/maintenance` - Create maintenance alert ✅

- **Efficiency**
  - `GET /api/efficiency` - Get efficiency data ✅

- **Health**
  - `GET /api/health` - Health check ✅

### ⚠️ Endpoints with Issues

- **Analytics** (500 errors)
  - `GET /api/analytics/daily` - Returns 500
  - `GET /api/analytics/weekly` - Returns 500
  - `GET /api/analytics/monthly` - Returns 500
  - **Issue**: Data retrieval from database failing
  - **Workaround**: Frontend will show default mock data

- **Weather** (500 error on fetch)
  - `GET /api/weather` - Get latest weather ✅
  - `POST /api/weather/fetch` - Fetch and store weather - Returns 500
  - **Issue**: OpenWeather API key not configured or missing lat/lon validation
  - **Workaround**: Use latest() without fetch

- **Predictions** (422 validation error)
  - `POST /api/predictions` - Returns 422
  - **Issue**: Missing required validation fields
  - **Fix**: Pass temperature, humidity, irradiance, wind_speed

- **Simulation** (422 validation error)
  - `POST /api/simulation/run` - Returns 422
  - **Issue**: Schema validation
  - **Fix**: Pass array of appliances with name, power_watts, hours

## How to Test from Browser

### 1. Start Backend
```bash
cd solariq_backend
$env:FLASK_DEBUG='1'
python -m flask run --host 0.0.0.0 --port 5000
```

### 2. Start Frontend
```bash
cd frontend
npm run dev
```
Frontend will be available at: **http://localhost:5173**

### 3. Frontend to Backend API Routing

- In development, the frontend uses Vite proxy: `/api` → `http://localhost:5000/api`
- In production, change `VITE_API_URL` environment variable

### 4. Test Complete Flow

1. **Visit**: http://localhost:5173
2. **Register**: Click "Create account"
   - Full name: "Test User"
   - Email: "test@example.com"
   - Password: "TestPass123"
   - Phone: "1234567890"
   - Role: "Homeowner"
   - Click "Create Account"

3. **Auto-redirect**: Should redirect to Dashboard after registration

4. **Dashboard**: Shows:
   - Stats cards (Solar Generation, Daily Consumption, etc.)
   - Charts (if data available)

5. **Analytics**: 
   - Daily/Weekly/Monthly tabs
   - Shows generation vs consumption
   - Efficiency percentage

6. **Other Pages**:
   - Settings - Update theme, notifications
   - Solar - Manage solar system records
   - Reports - Generate and view reports
   - Weather - Latest weather data
   - Maintenance - System maintenance alerts

## API Request Examples

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "John Doe",
    "email": "john@example.com",
    "password": "Password123",
    "phone": "1234567890",
    "role": "homeowner"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "Password123"
  }'
```

### Get Dashboard Stats (with token)
```bash
curl -X GET http://localhost:5000/api/dashboard/stats \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Test All Endpoints
```bash
cd solariq_backend
python test_all_apis.py
```

## CORS Configuration

Frontend Port: **3000** or **5173** (Vite dev server)
Backend Port: **5000**

CORS is configured to allow:
- http://localhost:3000
- http://127.0.0.1:3000
- http://localhost:5173
- http://127.0.0.1:5173
- http://localhost:8000
- http://127.0.0.1:8000

If using a different port, update:
```python
# In solariq_backend/config/settings.py
CORS_ORIGINS = [
    "http://localhost:YOUR_PORT",
    "http://127.0.0.1:YOUR_PORT",
]
```

## Frontend API Wrappers

Located in: `frontend/src/api/index.js`

```javascript
import { 
  dashboardApi,
  analyticsApi,
  settingsApi,
  reportsApi,
  // ... other apis
} from './api';

// Example usage
const stats = await dashboardApi.getStats();
const settings = await settingsApi.get();
await settingsApi.update({ theme: 'light' });
```

## Response Format

All API responses follow this format:

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    // Response data here
  }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error description",
  "data": {}
}
```

## Database

- **Database**: MySQL
- **Location**: `solariq` database (local)
- **Host**: 127.0.0.1:3306
- **Default User**: root

To reset database:
```bash
cd solariq_backend
python -c "from app import create_app; from extensions import db; app = create_app(); app.app_context().push(); db.drop_all(); db.create_all()"
```

## Troubleshooting

### CORS Errors in Browser
- Ensure backend is running on port 5000
- Check CORS_ORIGINS config includes your frontend port
- Clear browser cache and try again

### 500 Errors
- Check Flask terminal for error details
- Ensure all dependencies are installed: `pip install -r requirements.txt`
- Restart Flask with debug mode: `$env:FLASK_DEBUG='1'`

### Registration Fails
- Check if email already exists in database
- Verify all required fields are provided
- Check database connection

### API Returns Empty Data
- Ensure user is logged in (valid JWT token)
- Check user_id is properly set in JWT claims
- Verify data exists for the user in database

## Next Steps

1. ✅ Test registration and login flow
2. ✅ Test dashboard and analytics (even if data is mock)
3. ✅ Test settings update
4. ✅ Test all page navigation
5. ⚠️ Fix analytics data retrieval
6. ⚠️ Fix weather fetch endpoint
7. ⚠️ Fix predictions validation
8. ⚠️ Fix simulation validation
