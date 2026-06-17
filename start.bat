@echo off
REM Démarrer le serveur backend et le frontend

echo.
echo ======================================
echo   Stock Management App
echo ======================================
echo.
echo Installing dependencies...
cd server
call npm install > nul 2>&1
cd ..
call npm install > nul 2>&1

echo.
echo Starting application...
echo.
echo Server will run on http://localhost:3001
echo Frontend will run on http://localhost:5173
echo.

REM Start the server in a separate window
start cmd /k "cd server && npm start"

REM Give the server time to start
timeout /t 2 /nobreak

REM Start the frontend
npm run dev

echo.
pause
