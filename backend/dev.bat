@echo off
cd /d "%~dp0"
REM ==============================================================================
REM backend\dev.bat — Windows launcher using the centralized root .env
REM All env vars come from:  d:/Java/Bank/.env
REM
REM Usage:
REM   dev.bat         -> starts Spring Boot with root ../.env
REM ==============================================================================

echo [dotenvx] Loading centralized env from ../.env
dotenvx run --env-file=../.env -- .\gradlew.bat bootRun
