@echo off
cd /d "%~dp0"
echo ============================================
echo  SolarIQ - MySQL Workbench Local Setup
echo ============================================
echo.
echo Use the SAME password you use to open MySQL Workbench (root).
echo.
set /p ROOTPASS=MySQL root password: 
echo.
"..\venv\Scripts\python.exe" scripts\bootstrap_mysql.py --root-password "%ROOTPASS%"
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo Setup failed. See MYSQL_WORKBENCH_SETUP.md
    pause
    exit /b 1
)
echo.
set /p RUN=Start prototype now? (Y/n): 
if /i "%RUN%"=="n" goto :done
call scripts\start_prototype.ps1
:done
pause
