# SolarIQ Frontend API Integration Examples

Base URL:

```javascript
const API_BASE_URL = "http://127.0.0.1:5000/api";
```

Use `apiService.js` in production. Below are raw `fetch` examples per page.

## Login (`login.html`)

```javascript
const res = await fetch(`${API_BASE_URL}/auth/login`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email: "user@example.com", password: "secret12" }),
});
const data = await res.json();
localStorage.setItem("solariq_token", data.token || data.data.token);
```

## Register (`register.html`)

```javascript
await fetch(`${API_BASE_URL}/auth/register`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    full_name: "Ali Khan",
    email: "ali@example.com",
    password: "secret12",
    phone: "+923001234567",
    role: "homeowner",
  }),
});
```

## Dashboard (`dashboard.html`)

```javascript
const token = localStorage.getItem("solariq_token");
const res = await fetch(`${API_BASE_URL}/dashboard/stats`, {
  headers: { Authorization: `Bearer ${token}` },
});
const { data } = await res.json();
// data.modeled_output, data.predicted_yield, data.chart_data
```

## Analytics (`analytics.html`)

```javascript
const daily = await fetch(`${API_BASE_URL}/analytics/daily`, { headers: { Authorization: `Bearer ${token}` } });
const weekly = await fetch(`${API_BASE_URL}/analytics/weekly`, { headers: { Authorization: `Bearer ${token}` } });
const monthly = await fetch(`${API_BASE_URL}/analytics/monthly`, { headers: { Authorization: `Bearer ${token}` } });
```

## Prediction (`prediction.html`)

```javascript
await fetch(`${API_BASE_URL}/predictions`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    date: "2026-06-03",
    time: "12:00",
    sunlight: 850,
    temperature: 31,
    humidity: 45,
    clouds: 10,
  }),
});
```

## Simulation (`simulation.html`)

```javascript
await fetch(`${API_BASE_URL}/simulation/run`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    appliances: [
      { name: "EV Charger", wattage: 3200 },
      { name: "HVAC System", wattage: 2400 },
    ],
  }),
});
```

## Reports (`reports.html`)

```javascript
await fetch(`${API_BASE_URL}/reports`, { headers: { Authorization: `Bearer ${token}` } });

await fetch(`${API_BASE_URL}/reports/generate`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    report_type: "monthly",
    report_name: "May 2026 Executive Summary",
    format: "pdf",
  }),
});

window.open(`${API_BASE_URL}/reports/download/1`, "_blank"); // requires Authorization header in fetch/blob flow
```

## Settings (`settings.html`)

```javascript
await fetch(`${API_BASE_URL}/settings`, { headers: { Authorization: `Bearer ${token}` } });

await fetch(`${API_BASE_URL}/settings`, {
  method: "PUT",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    theme: "dark",
    notifications: true,
    email_alerts: true,
    timezone: "Asia/Karachi",
  }),
});
```
