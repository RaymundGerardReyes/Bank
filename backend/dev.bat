@echo off
cd /d "%~dp0"
REM ==============================================================================
REM backend\dev.bat — Windows launcher using the local development .env
REM All env vars come from:  ../.env.development
REM
REM Usage:
REM   dev.bat         -> starts Spring Boot with local ../.env.development
REM ==============================================================================

echo [dotenvx] Loading local dev env from ../.env.development
dotenvx run --env-file=../.env.development -- .\gradlew.bat bootRun
