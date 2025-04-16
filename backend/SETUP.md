# ESTIN Entry Detection System - Backend Setup Guide

This guide will help you set up the backend for the ESTIN Entry Detection System.

## Prerequisites

- Python 3.9 or higher
- PostgreSQL database
- Docker and Docker Compose (optional)

## Installation Options

### Option 1: Using Docker (Recommended)

1. Clone the repository
2. Navigate to the backend directory
3. Configure environment variables:
   \`\`\`bash
   cp .env.example .env
   # Edit .env file with your settings
   \`\`\`
4. Start the services:
   \`\`\`bash
   docker-compose up -d
   \`\`\`

### Option 2: Manual Installation

1. Clone the repository
2. Navigate to the backend directory
3. Create a virtual environment:
   \`\`\`bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   \`\`\`
4. Install dependencies:
   \`\`\`bash
   pip install -r requirements.txt
   \`\`\`
5. Configure environment variables:
   \`\`\`bash
   cp .env.example .env
   # Edit .env file with your settings
   \`\`\`
6. Set up PostgreSQL:
   \`\`\`bash
   # Create database
   createdb estin_detection
   \`\`\`
7. Initialize the database:
   \`\`\`bash
   python init_db.py
   \`\`\`
8. Start the backend server:
   \`\`\`bash
   python run.py
   \`\`\`

## Environment Variables

Create a `.env` file in the backend directory with the following variables:

\`\`\`
# Database
DATABASE_URL=postgresql://postgres:postgres@localhost/estin_detection

# Security
SECRET_KEY=your_secret_key_here
ADMIN_PASSWORD=admin123

# Backend
BACKEND_HOST=0.0.0.0
BACKEND_PORT=8000
\`\`\`

## Running the Backend

### All-in-One Runner

The `run.py` script can start all necessary services:

\`\`\`bash
# Start backend server only
python run.py

# Initialize database and start backend server
python run.py --init-db

# Start backend server and camera service
python run.py --camera

# Start all services
python run.py --init-db --camera --notification
\`\`\`

### Individual Services

You can also start each service individually:

\`\`\`bash
# Backend server
uvicorn main:app --host 0.0.0.0 --port 8000 --reload

# Camera service
python camera_service.py

# Notification service
python notification_service.py
\`\`\`

## Default Credentials

After initialization, you can log in with:

- Username: `admin`
- Password: `admin123` (or the value of ADMIN_PASSWORD environment variable)

## API Documentation

Once the server is running, you can access the API documentation at:

\`\`\`
http://localhost:8000/docs
\`\`\`

## Testing the Installation

1. Open a web browser and navigate to `http://localhost:8000/docs`
2. Click on the "Authorize" button and log in with the default credentials
3. Try out some of the API endpoints

## Troubleshooting

### Database Connection Issues

If you encounter database connection issues:

1. Verify PostgreSQL is running
2. Check the DATABASE_URL in your .env file
3. Ensure the database exists
4. Check PostgreSQL logs for errors

### Face Recognition Dependencies

If you encounter issues with face_recognition or dlib:

1. Make sure you have the required system dependencies:
   \`\`\`bash
   # Ubuntu/Debian
   sudo apt-get install build-essential cmake libopenblas-dev liblapack-dev libx11-dev libgtk-3-dev libboost-all-dev
   
   # macOS
   brew install cmake boost
   \`\`\`

2. Try reinstalling the packages:
   \`\`\`bash
   pip uninstall -y face_recognition dlib
   pip install dlib
   pip install face_recognition
   \`\`\`

### WebSocket Connection Issues

If the frontend cannot connect to the WebSocket:

1. Check that the BACKEND_URL environment variable is set correctly
2. Ensure the backend server is running
3. Check for CORS issues in the browser console
\`\`\`

```python file="backend/.env.example"
# Database
DATABASE_URL=postgresql://postgres:postgres@localhost/estin_detection

# Security
SECRET_KEY=your_secret_key_here
ADMIN_PASSWORD=admin123

# Backend
BACKEND_HOST=0.0.0.0
BACKEND_PORT=8000
