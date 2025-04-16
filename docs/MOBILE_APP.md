# ESTIN Entry Detection System - Mobile App Integration

This document provides information on integrating the ESTIN Entry Detection System with a mobile application.

## Overview

The ESTIN Entry Detection System can be extended with a mobile application to provide on-the-go monitoring and management capabilities. The mobile app can connect to the same backend API as the web application, allowing administrators to:

1. Receive real-time notifications
2. View live camera feeds
3. Check visitor logs
4. Manage people and cameras
5. Receive alerts for unknown visitors

## Mobile App Architecture

The mobile app follows a similar architecture to the web application:

\`\`\`
┌─────────────────┐      ┌─────────────────┐
│                 │      │                 │
│  Mobile App     │◄────►│  Backend API    │
│  (React Native) │      │  (FastAPI)      │
│                 │      │                 │
└─────────────────┘      └─────────────────┘
\`\`\`

## Technology Stack

- **Frontend**: React Native
- **State Management**: Redux or Context API
- **API Communication**: Axios or Fetch API
- **Real-time Updates**: WebSockets
- **Authentication**: JWT (same as web app)
- **UI Components**: React Native Paper or Native Base

## Key Features

### Authentication

- Login screen with username/password
- Biometric authentication (fingerprint/face ID)
- JWT token storage and refresh
- Session management

### Dashboard

- Overview of system status
- Recent visitor statistics
- Camera status summary
- Quick access to key features

### Live View

- Real-time camera feeds
- Face detection overlays
- Camera switching
- Notification badges for unknown visitors

### Visitor Logs

- List of recent visitors
- Filtering by date,
