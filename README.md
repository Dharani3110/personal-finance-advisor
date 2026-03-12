# AI-Powered Personal Finance Advisor

A full-stack hackathon demo application for predicting personal spending patterns and generating smart budgets using machine learning.

## 📋 Table of Contents
- [Project Overview](#project-overview)
- [Features](#features)
- [System Architecture](#system-architecture)
- [Application Flow](#application-flow)
- [Setup Instructions](#setup-instructions)
- [API Documentation](#api-documentation)
- [Budget Logic](#budget-logic)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Firebase Configuration](#firebase-configuration)
- [Testing](#testing)
- [Error Handling](#error-handling)
- [Performance](#performance)

## 🎯 Project Overview

This application helps users analyze their spending patterns and create intelligent budgets using machine learning. Users upload their transaction data via Excel files, and the system predicts future spending and generates personalized budget recommendations.

**Key Flow:**
1. **Home Page**: Project introduction and entry point
2. **Authentication**: Secure login via Firebase (Email/Password + Google)
3. **Upload**: Drag-drop Excel file upload with progress tracking
4. **Budget Analysis**: AI-generated predictions and budget recommendations
5. **Profile**: User management and logout

## ✨ Features

### Frontend (React + Vite)
- **🏠 Home Page**: Project showcase with feature overview
- **🔐 Login**: Firebase Authentication (Email + Password + Google OAuth)
- **📤 Upload**: Drag-drop Excel file upload with progress indicators
- **💰 Budget**: AI-generated budget recommendations with status indicators
- **👤 Profile**: User information display and logout functionality
- **🛡️ Protected Routes**: Authentication required for sensitive pages
- **🎨 Clean UI**: Tailwind CSS with minimal animations and responsive design

### Backend (Python Flask)
- **🤖 ML Predictions**: Spending pattern analysis and forecasting
- **📊 Data Processing**: Excel parsing, category grouping, trend detection
- **🔄 CORS Support**: Cross-origin requests from frontend
- **⚡ Fast Processing**: In-memory file handling with pandas
- **🛡️ Error Handling**: Comprehensive validation and error responses

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    React Frontend                        │
│  (Vite + TypeScript + Tailwind CSS + Firebase Auth)      │
│                                                           │
│  ┌──────────┬──────────┬────────────┬─────────────┐      │
│  │  Home    │  Login   │  Upload    │  Budget     │      │
│  │  Page    │  Page    │  Page      │  Page       │      │
│  └──────────┴──────────┴────────────┴─────────────┘      │
│                                                           │
│  Protected Routes (Upload, Budget, Profile)              │
│  Auth Context + Firebase SDK                             │
└─────────────────────────────────────────────────────────┘
                          │
                    (Fetch API)
                          │
                    Multipart Upload
                          │
┌─────────────────────────────────────────────────────────┐
│                  Flask Backend API                       │
│           (Python + Pandas + scikit-learn)               │
│                                                           │
│  POST /predict                                            │
│  ├─ Receive Excel (.xlsx)                                │
│  ├─ Read with Pandas                                     │
│  ├─ Preprocess:                                          │
│  │  ├─ Parse dates                                       │
│  │  ├─ Handle missing values                             │
│  │  ├─ Group by category                                 │
│  │  └─ Extract spending amounts                          │
│  ├─ ML Prediction:                                       │
│  │  ├─ Calculate historical average                      │
│  │  ├─ Detect spending trend                             │
│  │  └─ Predict next month                                │
│  └─ Return JSON predictions                              │
│                                                           │
│  GET /health                                              │
│  ├─ Simple health check                                   │
└─────────────────────────────────────────────────────────┘
```

### Component Hierarchy
```
App
├─ Router
│  └─ Routes
│     ├─ Home (public)
│     ├─ Login (public)
│     ├─ Upload (protected)
│     ├─ Budget (protected)
│     └─ Profile (protected)
│
├─ AuthProvider
│  └─ AuthContext
│     ├─ user state
│     ├─ loading state
│     └─ auth methods
│
└─ ProtectedRoute
   └─ Checks authentication
```

## 🚀 Application Flow

### Visual Demo Walkthrough

```
🏠 HOME PAGE
   ↓
   ┌─────────────────────────────────────┐
   │         AI Finance Advisor          │
   │                                     │
   │  ┌─────────────────────────────┐    │
   │  │    [Upload Transactions]    │    │
   │  └─────────────────────────────┘    │
   │                                     │
   │  How it works:                      │
   │  1. Upload Excel file               │
   │  2. AI analyzes spending            │
   │  3. Get smart budget                │
   └─────────────────────────────────────┘
            ↓
      Click Upload → Redirect to /login

🔐 LOGIN PAGE
   ↓
   ┌─────────────────────────────────────┐
   │         Sign In / Sign Up           │
   │                                     │
   │  ┌─────────────────────────────┐    │
   │  │ Email: [input]             │    │
   │  │ Password: [input]          │    │
   │  │ [Sign In] [Sign Up]        │    │
   │  └─────────────────────────────┘    │
   │                                     │
   │  ────── or ──────                   │
   │  [Sign in with Google]              │
   └─────────────────────────────────────┘
            ↓
      Auth Success → Redirect to /upload

📤 UPLOAD PAGE
   ↓
   ┌─────────────────────────────────────┐
   │       Upload Transactions           │
   │                                     │
   │  ┌─────────────────────────────┐    │
   │  │         Drag & Drop         │    │
   │  │                             │    │
   │  │   [Choose File] or Drop     │    │
   │  │                             │    │
   │  │   📄 Excel files only       │    │
   │  └─────────────────────────────┘    │
   │                                     │
   │  Progress: ████████░░ 80%           │
   └─────────────────────────────────────┘
            ↓
      Upload Success → Redirect to /budget

💰 BUDGET PAGE
   ↓
   ┌─────────────────────────────────────┐
   │      Your Smart Budget              │
   │                                     │
   │  ┌─────────────────────────────────┐ │
   │  │ Food                 $1,500     │ │
   │  │ ├─ Predicted: $1,304           │ │
   │  │ ├─ Budget Cap: $1,500          │ │
   │  │ └─ Status: ⚠️ Warning          │ │
   │  │                                 │ │
   │  │ Transport            $800       │ │
   │  │ ├─ Predicted: $696            │ │
   │  │ ├─ Budget Cap: $800           │ │
   │  │ └─ Status: ✅ Safe             │ │
   │  │                                 │ │
   │  │ Entertainment        $600       │ │
   │  │ ├─ Predicted: $522            │ │
   │  │ ├─ Budget Cap: $600           │ │
   │  │ └─ Status: ✅ Safe             │ │
   │  └─────────────────────────────────┘ │
   └─────────────────────────────────────┘
```

### UI Layout Reference

#### Home Page Layout
```
┌─────────────────────────────────────────────────┐
│  Navbar: [Home] [Upload Transactions] [Login]   │
├─────────────────────────────────────────────────┤
│                                                 │
│          AI-Powered Finance Advisor             │
│                                                 │
│  Transform your spending habits with AI         │
│                                                 │
├─────────────────────────────────────────────────┤
│  How It Works:                                  │
│  1. 📤 Upload your transaction Excel file       │
│  2. 🤖 AI analyzes your spending patterns       │
│  3. 💰 Get personalized budget recommendations  │
│                                                 │
├─────────────────────────────────────────────────┤
│              [Upload Transactions]              │
│                                                 │
│  Footer: © 2024 AI Finance Advisor              │
└─────────────────────────────────────────────────┘
```

#### Login Page Layout
```
┌─────────────────────────────────────────────────┐
│  Navbar: [Home] [Upload Transactions] [Login]   │
├─────────────────────────────────────────────────┤
│                                                 │
│               Sign In / Sign Up                 │
│                                                 │
├─────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────┐    │
│  │ Email: [___________________________]   │    │
│  │                                         │    │
│  │ Password: [________________________]   │    │
│  │                                         │    │
│  │ [ ] Remember me                          │    │
│  │                                         │    │
│  │ [Sign In]                    [Sign Up]   │    │
│  └─────────────────────────────────────────┘    │
│                                                 │
│              ────── or ──────                   │
│                                                 │
│         [Sign in with Google]                   │
│                                                 │
└─────────────────────────────────────────────────┘
```

#### Upload Page Layout
```
┌─────────────────────────────────────────────────┐
│  Navbar: [Home] [Budget] [Profile] [Logout]     │
├─────────────────────────────────────────────────┤
│                                                 │
│            Upload Your Transactions             │
│                                                 │
├─────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────┐    │
│  │                                         │    │
│  │           Drag & Drop Area               │    │
│  │                                         │    │
│  │   📄 Drop your Excel file here           │    │
│  │   or                                     │    │
│  │   [Choose File]                          │    │
│  │                                         │    │
│  │   Supported: .xlsx files only            │    │
│  │                                         │    │
│  └─────────────────────────────────────────┘    │
│                                                 │
│  Upload Progress: ██████████░░ 90%              │
│                                                 │
└─────────────────────────────────────────────────┘
```

#### Budget Page Layout
```
┌─────────────────────────────────────────────────┐
│  Navbar: [Home] [Upload] [Profile] [Logout]     │
├─────────────────────────────────────────────────┤
│                                                 │
│             Your Smart Budget                   │
│                                                 │
├─────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────┐    │
│  │ Category              Amount   Status   │    │
│  │                                         │    │
│  │ Food                 $1,500   ⚠️ Warning │    │
│  │ ├─ Predicted: $1,304                     │    │
│  │ ├─ Budget Cap: $1,500                    │    │
│  │ └─ Progress: ████████░░                   │    │
│  │                                         │    │
│  │ Transport             $800    ✅ Safe    │    │
│  │ ├─ Predicted: $696                      │    │
│  │ ├─ Budget Cap: $800                     │    │
│  │ └─ Progress: ███████░░                   │    │
│  │                                         │    │
│  │ Entertainment         $600    ✅ Safe    │    │
│  │ ├─ Predicted: $522                      │    │
│  │ ├─ Budget Cap: $600                     │    │
│  │ └─ Progress: ██████░░░                   │    │
│  │                                         │    │
│  │ [Upload New File]                        │    │
│  └─────────────────────────────────────────┘    │
└─────────────────────────────────────────────────┘
```

## ⚙️ Setup Instructions

### Backend Setup

1. Navigate to backend folder:
```bash
cd backend
```

2. Create virtual environment (optional but recommended):
```bash
python -m venv venv
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create sample test data (optional):
```bash
python create_sample.py
```

5. Run Flask API:
```bash
python app.py
```
Server will run at `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend folder:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
# or
bun install
```

3. Start development server:
```bash
npm run dev
# or
bun run dev
```
App will run at `http://localhost:5173`

## 📡 API Documentation

### POST /predict
Upload Excel file and get spending predictions.

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body: Excel file (.xlsx) with columns: Date, Category, Debit, Credit

**Response:**
```json
{
  "predictions": {
    "Food": 1500,
    "Transport": 800,
    "Entertainment": 600,
    "Utilities": 1200
  },
  "message": "Predictions generated successfully"
}
```

**Error Responses:**
- `400 Bad Request`: Invalid file type or missing required columns
- `500 Internal Server Error`: Processing or prediction failures

### GET /health
Simple health check endpoint.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T12:00:00Z"
}
```

## 🧮 Budget Logic

### Prediction Algorithm
For each spending category:
1. **Historical Average**: Calculate average monthly spending
2. **Trend Detection**: Identify spending patterns over time
3. **Prediction**: Forecast next month's spending
4. **Buffer Application**: Add 15% safety margin

### Budget Calculation Formula
```
Predicted Spend = ML Model Output
Budget Cap = Predicted Spend × 1.15 (15% buffer)
```

### Status Determination
- **✅ Safe**: Budget within normal range
- **⚠️ Warning**: Spending higher than predicted
- **❌ Risk**: Significantly over budget

## 🛠️ Tech Stack

**Frontend:**
- React 18 with TypeScript
- Vite (build tool)
- React Router v6 (routing)
- Firebase Auth (authentication)
- Tailwind CSS (styling)
- Axios (HTTP client)

**Backend:**
- Python Flask (web framework)
- Pandas (data processing)
- scikit-learn (ML models)
- Flask-CORS (cross-origin support)
- openpyxl (Excel file handling)

**Infrastructure:**
- Firebase (authentication & hosting)
- Git (version control)

## 📁 Project Structure

```
test/
├── frontend/                 # React + Vite application
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   │   ├── Navbar.tsx    # Navigation bar
│   │   │   └── ProtectedRoute.tsx # Auth guard
│   │   ├── contexts/         # React contexts
│   │   │   └── AuthContext.tsx # Authentication state
│   │   ├── lib/              # Utilities & config
│   │   │   └── firebase.ts   # Firebase configuration
│   │   ├── pages/            # Page components
│   │   │   ├── Home.tsx      # Landing page
│   │   │   ├── Login.tsx     # Authentication
│   │   │   ├── Upload.tsx    # File upload
│   │   │   ├── Budget.tsx    # Results display
│   │   │   └── Profile.tsx   # User profile
│   │   ├── App.css           # Global styles
│   │   ├── App.tsx           # Main app component
│   │   ├── index.css         # Base styles
│   │   └── main.tsx          # App entry point
│   ├── index.html            # HTML template
│   ├── package.json          # Dependencies & scripts
│   ├── tsconfig.json         # TypeScript config
│   ├── vite.config.ts        # Vite configuration
│   └── tailwind.config.js    # Tailwind CSS config
│
├── backend/                  # Python Flask API
│   ├── app.py                # Main Flask application
│   ├── ml_utils.py           # ML prediction utilities
│   ├── create_sample.py      # Sample data generator
│   ├── requirements.txt      # Python dependencies
│   └── models/               # ML models directory
│
├── setup.bat                 # Windows setup script
├── setup.sh                  # Linux/Mac setup script
└── README.md                 # This file
```

**File Statistics:**
- Total Files: 1,259+
- Frontend Files: 850+ (TypeScript, CSS, config)
- Backend Files: 50+ (Python, requirements)
- Documentation: 20+ markdown files
- Build/Config Files: 350+ (node_modules, venv, etc.)

## 🔥 Firebase Configuration

The app uses Firebase for authentication. The config in `src/lib/firebase.ts` contains demo credentials.

For production deployment:

1. Create a Firebase project at https://console.firebase.google.com
2. Enable Authentication with:
   - Email/Password provider
   - Google provider
3. Copy your config to `src/lib/firebase.ts`:
```typescript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  // ... other config
};
```

## 🧪 Testing

### Manual Testing Flow

1. **Start Services:**
   ```bash
   # Terminal 1 - Backend
   cd backend && python app.py

   # Terminal 2 - Frontend
   cd frontend && npm run dev
   ```

2. **Test Application:**
   - Open `http://localhost:5173`
   - Click "Upload Transactions" → redirects to login
   - Sign up with email/password or Google
   - Upload Excel file with required columns
   - View budget recommendations

### Sample Excel Format
| Date       | Category      | Debit | Credit |
|------------|---------------|-------|--------|
| 2023-01-01 | Food          | 50    | 0      |
| 2023-01-02 | Transport     | 100   | 0      |
| 2023-01-03 | Entertainment | 75    | 0      |
| 2023-01-04 | Utilities     | 200   | 0      |

## ⚠️ Error Handling

### Backend Errors
- **400 Bad Request**: Invalid file type, missing columns (Date, Category, Debit, Credit)
- **500 Server Error**: Data processing failures, ML prediction errors

### Frontend Errors
- **Authentication Required**: Redirect to login for protected routes
- **Upload Failures**: User-friendly error messages with retry options
- **Network Errors**: Graceful degradation with offline messaging

### Validation Rules
- File type: Only .xlsx files accepted
- Required columns: Date, Category, Debit, Credit
- Data integrity: Non-empty values, valid date formats

## ⚡ Performance

- **Fast Excel Processing**: Pandas-based parsing with in-memory operations
- **Efficient ML**: Lightweight prediction algorithms
- **Minimal Bundle**: Vite-optimized React build
- **Responsive UI**: Mobile-first design with Tailwind CSS
- **Quick Auth**: Firebase SDK with persistent sessions

## 📝 Notes

- This is a hackathon demo application
- ML model is intentionally simple for demonstration
- For production: implement proper ML training/validation pipeline
- Firebase credentials should use environment variables
- Add comprehensive error logging and monitoring for production
- Consider implementing user data persistence and history

## 📄 License

Demo project - Free to use and modify for educational purposes.
