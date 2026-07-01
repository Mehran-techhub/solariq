@echo off
title SolarIQ - Production
cd /d "%~dp0"

echo ============================================
echo   SolarIQ - Production Deployment
echo ============================================
echo.

:: Check prerequisites
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [FAIL] Node.js not found. Install from https://nodejs.org
    pause
    exit /b 1
)

if not exist "venv\Scripts\python.exe" (
    echo [FAIL] Virtual environment not found.
    echo        Run: python -m venv venv
    pause
    exit /b 1
)

:: Step 1: Build frontend
echo [1/3] Building frontend...
cd /d "%~dp0frontend"
if not exist "node_modules" call npm install --silent
call npm run build
if %errorlevel% neq 0 (
    echo [FAIL] Frontend build failed
    pause
    exit /b 1
)
echo   [OK] Frontend built to frontend\dist\

:: Step 2: Install backend deps
echo [2/3] Installing backend dependencies...
cd /d "%~dp0"
call venv\Scripts\python.exe -m pip install -r solariq_backend\requirements.txt --quiet
echo   [OK] Backend dependencies installed

:: Step 3: Start server
echo [3/3] Starting server...
echo.

:: Check if PM2 is available
where pm2 >nul 2>&1
if %errorlevel% equ 0 (
    pm2 start pm2.json
    if %errorlevel% equ 0 (
        echo   [OK] Server started with PM2
        echo.
        echo   Commands:
        echo     pm2 status          - Check status
        echo     pm2 logs solariq    - View logs
        echo     pm2 stop solariq    - Stop
        echo     pm2 restart solariq - Restart
        echo     pm2 startup         - Auto-start on boot
        goto :done
    )
)

:: Fallback: start directly
echo   Starting server directly (recommend: npm install -g pm2)
start "SolarIQ" cmd /c "cd /d %~dp0solariq_backend && ..\venv\Scripts\python.exe app.py"

:done
echo.
echo ============================================
echo   SolarIQ is LIVE
echo   URL: http://localhost:5000
echo ============================================
timeout /t 3 >nul
start http://localhost:5000
