@echo off
echo 🚂 IRCTC Railway Booking System
echo 📡 Starting local server...
echo.

REM Check if Python is available
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Python is not installed or not in PATH
    echo Please install Python from https://python.org
    pause
    exit /b 1
)

REM Start the server
python start_server.py

pause

