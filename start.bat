@echo off
title Cvent Admin Editor
echo.
echo  ╔════════════════════════════════════════╗
echo  ║      Cvent Admin Content Editor        ║
echo  ╚════════════════════════════════════════╝
echo.

cd /d "%~dp0"

:: Check if node_modules exists, install if not
if not exist "node_modules" (
    echo  [1/2] Installing dependencies...
    call npm install
    echo.
)

echo  [2/2] Starting editor server...
echo.
echo  ┌─────────────────────────────────────────┐
echo  │  Admin Editor:  http://localhost:3737   │
echo  └─────────────────────────────────────────┘
echo.
echo  Press Ctrl+C to stop the server.
echo.

node server.js

pause
