@echo off
REM Setup script for AI Finance Advisor app

echo Setting up AI-Powered Personal Finance Advisor...

REM Setup Backend
echo.
echo === Setting up Backend ===
cd backend

REM Check if Python is installed
where python >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Python not found. Please install Python 3.8+
    exit /b 1
)

REM Create virtual environment
if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
)

REM Activate virtual environment
call venv\Scripts\activate.bat

REM Install dependencies
echo Installing backend dependencies...
pip install -r requirements.txt

REM Create sample data
echo Creating sample transaction data...
python create_sample.py

cd ..

REM Setup Frontend
echo.
echo === Setting up Frontend ===
cd frontend

REM Check if bun or npm is installed
where bun >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo Installing frontend dependencies with bun...
    bun install
) else (
    where npm >nul 2>nul
    if %ERRORLEVEL% EQU 0 (
        echo Installing frontend dependencies with npm...
        npm install
    ) else (
        echo Neither npm nor bun found. Please install Node.js
        exit /b 1
    )
)

cd ..

echo.
echo === Setup Complete ===
echo.
echo To run the application:
echo 1. Backend: cd backend ^& python app.py
echo 2. Frontend: cd frontend ^& npm run dev (or bun run dev)
echo.
echo Then open http://localhost:5173 in your browser
