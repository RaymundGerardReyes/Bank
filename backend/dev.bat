@echo off
cd /d "%~dp0"
REM ==============================================================================
REM backend\dev.bat — Windows launcher using the local development .env
REM All env vars come from:  ../.env.development
REM
REM Usage:
REM   dev.bat         -> starts Spring Boot with local ../.env.development
REM ==============================================================================

echo [pre-flight] Checking database connectivity on port 5435...
(netstat -ano | findstr :5435 >nul 2>&1) || (
    echo [pre-flight] Port 5435 is not listening.
    (docker info >nul 2>&1) && (
        echo [pre-flight] Docker daemon is running. Starting database container...
        pushd ..
        call npm run dev:db
        popd
        timeout /t 3 /nobreak >nul
    ) || (
        echo ==============================================================================
        echo [ERROR] DATABASE IS NOT REACHABLE ON PORT 5435!
        echo ==============================================================================
        echo Spring Boot [dev profile] expects PostgreSQL at localhost:5435.
        echo Neither the database container nor Docker Desktop is currently running.
        echo.
        echo HOW TO FIX:
        echo   1. Start Docker Desktop from Windows Start Menu or Taskbar.
        echo   2. Run: npm run dev:db   to start the banking_db container.
        echo   3. Re-run dev.bat
        echo ==============================================================================
        exit /b 1
    )
)

echo [dotenvx] Loading local dev env from ../.env.development
dotenvx run --env-file=../.env.development -- .\gradlew.bat bootRun
