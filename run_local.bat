@echo off
setlocal enabledelayedexpansion

echo.
echo  ================================================
echo    OpsPilot AI - Starting...
echo  ================================================
echo.

REM ---- Check Python ----
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python is not installed or not in PATH.
    echo         Download it from https://python.org and re-run this script.
    pause
    exit /b 1
)
for /f "tokens=*" %%v in ('python --version 2^>^&1') do echo [OK] %%v found.

REM ---- Check Node.js ----
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js is not installed or not in PATH.
    echo         Download it from https://nodejs.org and re-run this script.
    pause
    exit /b 1
)
for /f "tokens=*" %%v in ('node --version 2^>^&1') do echo [OK] Node.js %%v found.

echo.

REM ---- Backend Setup ----
echo [1/4] Setting up backend...
cd /d "%~dp0backend"

if not exist ".venv" (
    echo      Creating Python virtual environment...
    python -m venv .venv
)

call .venv\Scripts\activate.bat

echo      Installing Python dependencies...
pip install -r requirements.txt -q

echo      Starting backend server...
start "OpsPilot-Backend" cmd /k "cd /d %~dp0backend && .venv\Scripts\activate.bat && python -m uvicorn app.main:app --reload --port 8000"

echo      Waiting for backend to initialise...
timeout /t 3 /nobreak >nul

REM ---- Frontend Setup ----
echo [2/4] Setting up frontend...
cd /d "%~dp0frontend"

if not exist "node_modules" (
    echo      Installing Node dependencies (first run — this may take a minute)...
    npm install
)

echo      Starting frontend server...
start "OpsPilot-Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

echo      Waiting for frontend to initialise...
timeout /t 3 /nobreak >nul

REM ---- Done ----
echo.
echo  ================================================
echo    OpsPilot AI is starting up!
echo    Frontend:  http://localhost:5173
echo    Backend:   http://localhost:8000
echo    API Docs:  http://localhost:8000/docs
echo  ================================================
echo.
echo  Opening browser...
start http://localhost:5173

echo.
pause "Press any key to close this window (servers keep running)"
