# ESTIN Entry Detection System - API Documentation

This document provides documentation for the REST API endpoints available in the ESTIN Entry Detection System.

## Base URL

All API endpoints are relative to the base URL:

\`\`\`
http://localhost:8000
\`\`\`

For production, replace with your actual domain.

## Authentication

Most API endpoints require authentication. The API uses JWT (JSON Web Token) for authentication.

### Getting a Token

\`\`\`
POST /token
\`\`\`

**Request Body:**

\`\`\`json
{
  "username": "admin",
  "password": "admin123"
}
\`\`\`

**Response:**

\`\`\`json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
\`\`\`

### Using the Token

Include the token in the `Authorization` header of your requests:

\`\`\`
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
\`\`\`

## API Endpoints

### People

#### Get All People

\`\`\`
GET /api/people
\`\`\`

**Query Parameters:**

- `skip` (optional): Number of records to skip (default: 0)
- `limit` (optional): Maximum number of records to return (default: 100)
- `role` (optional): Filter by role (e.g., "student", "faculty", "staff")

**Response:**

\`\`\`json
[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john.doe@example.com",
    "role": "student",
    "department": "Computer Science",
    "status": "active",
    "created_at": "2023-01-01T00:00:00Z"
  },
  ...
]
\`\`\`

#### Get Person by ID

\`\`\`
GET /api/people/{person_id}
\`\`\`

**Response:**

\`\`\`json
{
  "id": 1,
  "name": "John Doe",
  "email": "john.doe@example.com",
  "role": "student",
  "department": "Computer Science",
  "status": "active",
  "created_at": "2023-01-01T00:00:00Z"
}
\`\`\`

#### Create Person

\`\`\`
POST /api/people
\`\`\`

**Request Body:**

\`\`\`json
{
  "name": "Jane Smith",
  "email": "jane.smith@example.com",
  "role": "faculty",
  "department": "Mathematics",
  "status": "active"
}
\`\`\`

**Response:**

\`\`\`json
{
  "id": 2,
  "name": "Jane Smith",
  "email": "jane.smith@example.com",
  "role": "faculty",
  "department": "Mathematics",
  "status": "active",
  "created_at": "2023-01-02T00:00:00Z"
}
\`\`\`

#### Update Person

\`\`\`
PUT /api/people/{person_id}
\`\`\`

**Request Body:**

\`\`\`json
{
  "name": "Jane Smith",
  "email": "jane.smith@example.com",
  "role": "faculty",
  "department": "Physics",
  "status": "active"
}
\`\`\`

**Response:**

\`\`\`json
{
  "id": 2,
  "name": "Jane Smith",
  "email": "jane.smith@example.com",
  "role": "faculty",
  "department": "Physics",
  "status": "active",
  "created_at": "2023-01-02T00:00:00Z"
}
\`\`\`

#### Delete Person

\`\`\`
DELETE /api/people/{person_id}
\`\`\`

**Response:**

\`\`\`json
{
  "success": true,
  "message": "Person deleted successfully"
}
\`\`\`

#### Add Face Data

\`\`\`
POST /api/people/{person_id}/face
\`\`\`

**Request Body:**

Multipart form data with a `file` field containing an image file.

**Response:**

\`\`\`json
{
  "success": true,
  "message": "Face data added successfully"
}
\`\`\`

#### Get Person Avatar

\`\`\`
GET /api/people/{person_id}/avatar
\`\`\`

**Response:**

The person's avatar image file.

### Cameras

#### Get All Cameras

\`\`\`
GET /api/cameras
\`\`\`

**Response:**

\`\`\`json
[
  {
    "id": 1,
    "name": "Main Entrance",
    "location": "Building A, Front Door",
    "url": "rtsp://192.168.1.100:554/stream1",
    "type": "ip",
    "resolution": "1080p",
    "status": "online",
    "last_active": "2023-01-01T00:00:00Z"
  },
  ...
]
\`\`\`

#### Get Camera by ID

\`\`\`
GET /api/cameras/{camera_id}
\`\`\`

**Response:**

\`\`\`json
{
  "id": 1,
  "name": "Main Entrance",
  "location": "Building A, Front Door",
  "url": "rtsp://192.168.1.100:554/stream1",
  "type": "ip",
  "resolution": "1080p",
  "status": "online",
  "last_active": "2023-01-01T00:00:00Z"
}
\`\`\`

#### Create Camera

\`\`\`
POST /api/cameras
\`\`\`

**Request Body:**

\`\`\`json
{
  "name": "Side Entrance",
  "location": "Building B, Side Door",
  "url": "rtsp://192.168.1.101:554/stream1",
  "type": "ip",
  "resolution": "720p",
  "status": "offline"
}
\`\`\`

**Response:**

\`\`\`json
{
  "id": 2,
  "name": "Side Entrance",
  "location": "Building B, Side Door",
  "url": "rtsp://192.168.1.101:554/stream1",
  "type": "ip",
  "resolution": "720p",
  "status": "offline",
  "last_active": null
}
\`\`\`

#### Update Camera

\`\`\`
PUT /api/cameras/{camera_id}
\`\`\`

**Request Body:**

\`\`\`json
{
  "name": "Side Entrance",
  "location": "Building B, Side Door",
  "url": "rtsp://192.168.1.101:554/stream1",
  "type": "ip",
  "resolution": "1080p",
  "status": "online"
}
\`\`\`

**Response:**

\`\`\`json
{
  "id": 2,
  "name": "Side Entrance",
  "location": "Building B, Side Door",
  "url": "rtsp://192.168.1.101:554/stream1",
  "type": "ip",
  "resolution": "1080p",
  "status": "online",
  "last_active": "2023-01-02T00:00:00Z"
}
\`\`\`

#### Delete Camera

\`\`\`
DELETE /api/cameras/{camera_id}
\`\`\`

**Response:**

\`\`\`json
{
  "success": true,
  "message": "Camera deleted successfully"
}
\`\`\`

### Visitor Logs

#### Get Visitor Logs

\`\`\`
GET /api/visitor-logs
\`\`\`

**Query Parameters:**

- `skip` (optional): Number of records to skip (default: 0)
- `limit` (optional): Maximum number of records to return (default: 100)
- `status` (optional): Filter by status (e.g., "verified", "unknown")
- `date` (optional): Filter by date (format: YYYY-MM-DD)

**Response:**

\`\`\`json
[
  {
    "id": 1,
    "person_id": 1,
    "name": "John Doe",
    "time": "08:30:00",
    "date": "2023-01-01",
    "location": "Main Entrance",
    "status": "verified",
    "confidence": 98.5,
    "camera_id": 1,
    "created_at": "2023-01-01T08:30:00Z"
  },
  ...
]
\`\`\`

#### Get Visitor Log by ID

\`\`\`
GET /api/visitor-logs/{log_id}
\`\`\`

**Response:**

\`\`\`json
{
  "id": 1,
  "person_id": 1,
  "name": "John Doe",
  "time": "08:30:00",
  "date": "2023-01-01",
  "location": "Main Entrance",
  "status": "verified",
  "confidence": 98.5,
  "camera_id": 1,
  "created_at": "2023-01-01T08:30:00Z"
}
\`\`\`

### Stats

#### Get Stats

\`\`\`
GET /api/stats
\`\`\`

**Response:**

\`\`\`json
{
  "total_entries": 150,
  "verified_entries": 135,
  "unknown_entries": 15,
  "peak_entry_time": "08:30"
}
\`\`\`

### Settings

#### Get Settings

\`\`\`
GET /api/settings
\`\`\`

**Response:**

\`\`\`json
{
  "id": 1,
  "system_name": "ESTIN Entry Detection System",
  "institution": "ESTIN",
  "timezone": "Africa/Algiers",
  "detection_threshold": 60,
  "recognition_threshold": 80,
  "save_unknown_faces": true,
  "real_time_alerts": true,
  "email_notifications": true,
  "email_address": "admin@estin.dz",
  "unknown_alerts": true,
  "system_alerts": true,
  "session_timeout": 30,
  "two_factor_auth": false,
  "audit_logs": true,
  "log_retention": 90
}
\`\`\`

#### Update Settings

\`\`\`
PUT /api/settings
\`\`\`

**Request Body:**

\`\`\`json
{
  "system_name": "ESTIN Entry Detection System",
  "institution": "ESTIN",
  "timezone": "Africa/Algiers",
  "detection_threshold": 70,
  "recognition_threshold": 85,
  "save_unknown_faces": true,
  "real_time_alerts": true,
  "email_notifications": true,
  "email_address": "admin@estin.dz",
  "unknown_alerts": true,
  "system_alerts": true,
  "session_timeout": 30,
  "two_factor_auth": true,
  "audit_logs": true,
  "log_retention": 90
}
\`\`\`

**Response:**

\`\`\`json
{
  "id": 1,
  "system_name": "ESTIN Entry Detection System",
  "institution": "ESTIN",
  "timezone": "Africa/Algiers",
  "detection_threshold": 70,
  "recognition_threshold": 85,
  "save_unknown_faces": true,
  "real_time_alerts": true,
  "email_notifications": true,
  "email_address": "admin@estin.dz",
  "unknown_alerts": true,
  "system_alerts": true,
  "session_timeout": 30,
  "two_factor_auth": true,
  "audit_logs": true,
  "log_retention": 90
}
\`\`\`

### Process Frame

#### Process Camera Frame

\`\`\`
POST /api/process-frame
\`\`\`

**Request Body:**

\`\`\`json
{
  "camera_id": 1,
  "frame": "base64_encoded_image_data"
}
\`\`\`

**Response:**

\`\`\`json
{
  "camera_id": 1,
  "detections": [
    {
      "name": "John Doe",
      "person_id": 1,
      "verified": true,
      "confidence": 98.5,
      "bbox": {
        "x": 100,
        "y": 50,
        "width": 200,
        "height": 200
      }
    }
  ]
}
\`\`\`

## WebSocket API

### Connect to WebSocket

\`\`\`
WebSocket: /ws
\`\`\`

**Authentication:**

Include the JWT token as a query parameter:

\`\`\`
ws://localhost:8000/ws?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
\`\`\`

### WebSocket Messages

#### Detection Event

\`\`\`json
{
  "type": "detection",
  "camera_id": 1,
  "timestamp": "2023-01-01T08:30:00Z",
  "detections": [
    {
      "name": "John Doe",
      "person_id": 1,
      "verified": true,
      "confidence": 98.5,
      "bbox": {
        "x": 100,
        "y": 50,
        "width": 200,
        "height": 200
      }
    }
  ]
}
\`\`\`

#### Camera Status Event

\`\`\`json
{
  "type": "camera_status",
  "camera_id": 1,
  "status": "online",
  "timestamp": "2023-01-01T08:30:00Z"
}
\`\`\`

#### Notification Event

\`\`\`json
{
  "type": "notification",
  "id": 1,
  "title": "Unknown visitor detected",
  "message": "Unknown visitor detected at Main Entrance",
  "severity": "alert",
  "timestamp": "2023-01-01T08:30:00Z"
}
\`\`\`

## Error Responses

All API endpoints return standard HTTP status codes:

- `200 OK`: Request successful
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid request parameters
- `401 Unauthorized`: Authentication required or invalid
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

Error responses include a JSON body with details:

\`\`\`json
{
  "detail": "Error message describing the issue"
}
\`\`\`

## Rate Limiting

API requests are rate-limited to prevent abuse. The current limits are:

- 100 requests per minute for authenticated users
- 10 requests per minute for unauthenticated users

When rate limited, the API returns a `429 Too Many Requests` status code.
