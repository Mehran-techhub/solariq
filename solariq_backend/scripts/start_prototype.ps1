# Start SolarIQ prototype (API + static frontend)
$Root = Split-Path -Parent $PSScriptRoot
$ProjectRoot = Split-Path -Parent $Root

if (-not (Test-Path "$Root\.env")) {
    Write-Host "Missing .env — run bootstrap first:" -ForegroundColor Yellow
    Write-Host "  python scripts/bootstrap_mysql.py --root-password YOUR_MYSQL_ROOT_PASSWORD"
    exit 1
}

Write-Host "Verifying API..." -ForegroundColor Cyan
& "$ProjectRoot\venv\Scripts\python.exe" "$Root\scripts\verify_prototype.py"
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host "Starting SolarIQ API on http://127.0.0.1:5000 ..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$Root'; `$env:FLASK_APP='app.py'; & '$ProjectRoot\venv\Scripts\python.exe' app.py"

Start-Sleep -Seconds 2
Write-Host "Starting frontend on http://localhost:8000 ..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$ProjectRoot'; python -m http.server 8000"

Write-Host ""
Write-Host "Prototype URLs:" -ForegroundColor Green
Write-Host "  Login:     http://localhost:8000/public/login.html"
Write-Host "  API:       http://127.0.0.1:5000/api/health"
Write-Host "  Demo user: demo@solariq.com / Demo@1234"
