@echo off
echo Stopping any existing servers on port 5000...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5000') do taskkill /F /PID %%a 2>nul

echo.
echo Starting EdConnect server...
cd /d "%~dp0"
npm run dev
