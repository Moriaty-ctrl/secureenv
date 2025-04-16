# ESTIN Entry Detection System - Architecture

This document provides an overview of the ESTIN Entry Detection System architecture, explaining how the different components work together.

## System Overview

The ESTIN Entry Detection System is a comprehensive security monitoring solution that uses face recognition to identify individuals entering the campus. The system consists of the following main components:

1. **Frontend Application**: A Next.js web application that provides the user interface for monitoring and management
2. **Backend Server**: A FastAPI server that handles API requests, authentication, and business logic
3. **Camera Service**: A Python service that connects to IP cameras and processes video feeds
4. **Face Recognition Engine**: A module that detects and recognizes faces in video frames
5. **Database**: A PostgreSQL database that stores system data
6. **WebSocket Server**: A real-time communication channel between the backend and frontend

## Architecture Diagram

\`\`\`
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│                 │      │                 │      │                 │
│  Next.js        │◄────►│  FastAPI        │◄────►│  PostgreSQL     │
│  Frontend       │      │  Backend        │      │  Database       │
│                 │      │                 │      │                 │
└────────┬────────┘      └────────┬────────┘      └─────────────────┘
         │                        │
         │                        │
         │                        ▼
         │               ┌─────────────────┐
         │               │                 │
         │               │  Face           │
         │               │  Recognition    │
         │               │  Engine         │
         │               │                 │
         │               └────────┬────────┘
         │                        │
         │                        │
         │                        ▼
         │               ┌─────────────────┐
         │               │                 │
         │               │  Camera         │
         │               │  Service        │
         │               │                 │
         ▼               └────────┬────────┘
┌─────────────────┐               │
│                 │               │
│  WebSocket      │◄──────────────┘
│  Server         │
│                 │
└─────────────────┘
\`\`\`

## Component Details

### Frontend Application

- **Technology**: Next.js, React, TypeScript, Tailwind CSS, shadcn/ui
- **Features**:
  - Dashboard with real-time monitoring
  - People management
  - Camera management
  - Visitor logs
  - Settings and configuration
  - Face recognition training interface
  - Real-time notifications

### Backend Server

- **Technology**: FastAPI, Python, SQLAlchemy
- **Features**:
  - RESTful API endpoints
  - JWT authentication
  - Database operations
  - Business logic
  - WebSocket server for real-time updates

### Camera Service

- **Technology**: Python, OpenCV
- **Features**:
  - Connect to IP cameras and webcams
  - Process video frames
  - Send frames to face recognition engine
  - Manage camera connections

### Face Recognition Engine

- **Technology**: Python, face_recognition, dlib
- **Features**:
  - Face detection
  - Face recognition
  - Face data training
  - Confidence scoring

### Database

- **Technology**: PostgreSQL
- **Tables**:
  - Users: System users
  - People: Individuals to be recognized
  - Cameras: Camera configurations
  - VisitorLogs: Entry detection records
  - FaceData: Face recognition training data
  - Settings: System settings

### WebSocket Server

- **Technology**: FastAPI WebSockets
- **Features**:
  - Real-time updates to frontend
  - Camera detection events
  - System notifications

## Data Flow

1. **Camera Detection Flow**:
   - Camera Service captures frames from cameras
   - Frames are sent to Face Recognition Engine
   - Face Recognition Engine detects and identifies faces
   - Results are stored in the database
   - Real-time updates are sent to frontend via WebSocket

2. **User Interaction Flow**:
   - User interacts with frontend interface
   - Frontend sends API requests to backend
   - Backend processes requests and updates database
   - Backend sends responses back to frontend

3. **Face Training Flow**:
   - User uploads or captures face images
   - Images are sent to backend
   - Face Recognition Engine processes images and extracts features
   - Face data is stored in the database for future recognition

## Security Considerations

- JWT authentication for API access
- Role-based access control
- Encrypted communication (HTTPS/WSS)
- Secure storage of face data
- Audit logging of system actions

## Deployment Architecture

The system can be deployed in various configurations:

1. **All-in-One Deployment**:
   - All components run on a single server
   - Suitable for small installations

2. **Distributed Deployment**:
   - Frontend and backend on separate servers
   - Camera services on edge devices
   - Central database server
   - Suitable for large installations with multiple cameras

3. **Cloud Deployment**:
   - Frontend and backend in cloud (e.g., Vercel, AWS)
   - Camera services on-premises
   - Database in cloud (e.g., Neon, AWS RDS)
   - Hybrid approach for optimal performance

## Scaling Considerations

- Horizontal scaling of backend servers
- Database replication and sharding
- Load balancing for API requests
- Edge processing for camera feeds
- Caching for frequently accessed data
