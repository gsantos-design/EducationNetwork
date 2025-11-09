@echo off
echo ========================================
echo EdConnect - Starting Demo Server
echo ========================================
echo.

cd /d "%~dp0"

echo Installing dependencies (this may take a minute)...
call npm install --silent

echo.
echo Starting server on http://localhost:5000
echo.
echo Open your browser to: http://localhost:5000
echo Press Ctrl+C to stop the server
echo.

node server-simple.js
