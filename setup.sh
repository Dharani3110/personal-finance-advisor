#!/bin/bash
# Setup script for AI Finance Advisor app

echo "Setting up AI-Powered Personal Finance Advisor..."

# Setup Backend
echo ""
echo "=== Setting up Backend ==="
cd backend

# Check if Python is installed
if ! command -v python &> /dev/null; then
    echo "Python not found. Please install Python 3.8+"
    exit 1
fi

# Create virtual environment
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python -m venv venv
fi

# Activate virtual environment
if [ -f "venv/bin/activate" ]; then
    source venv/bin/activate
fi

# Install dependencies
echo "Installing backend dependencies..."
pip install -r requirements.txt

# Create sample data
echo "Creating sample transaction data..."
python create_sample.py

cd ..

# Setup Frontend
echo ""
echo "=== Setting up Frontend ==="
cd frontend

# Check if npm or bun is installed
if command -v bun &> /dev/null; then
    echo "Installing frontend dependencies with bun..."
    bun install
elif command -v npm &> /dev/null; then
    echo "Installing frontend dependencies with npm..."
    npm install
else
    echo "Neither npm nor bun found. Please install Node.js"
    exit 1
fi

cd ..

echo ""
echo "=== Setup Complete ==="
echo ""
echo "To run the application:"
echo "1. Backend: cd backend && python app.py"
echo "2. Frontend: cd frontend && npm run dev (or bun run dev)"
echo ""
echo "Then open http://localhost:5173 in your browser"
