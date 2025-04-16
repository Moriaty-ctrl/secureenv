import cv2
import time
import threading
import base64
import requests
import numpy as np
import logging
from datetime import datetime
from typing import Dict, List, Optional

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger("camera_service")

class CameraService:
    def __init__(self, backend_url: str, api_token: str):
        """
        Initialize the camera service
        
        Args:
            backend_url: URL of the backend API
            api_token: JWT token for API authentication
        """
        self.backend_url = backend_url
        self.api_token = api_token
        self.cameras: Dict[int, dict] = {}  # Camera ID -> Camera info
        self.camera_threads: Dict[int, threading.Thread] = {}  # Camera ID -> Thread
        self.running: Dict[int, bool] = {}  # Camera ID -> Running status
        self.frame_interval = 1.0  # Process one frame per second by default
        
        # Load cameras from backend
        self._load_cameras()
    
    def _load_cameras(self):
        """Load cameras from the backend API"""
        try:
            response = requests.get(
                f"{self.backend_url}/api/cameras",
                headers={"Authorization": f"Bearer {self.api_token}"}
            )
            
            if response.status_code == 200:
                cameras = response.json()
                for camera in cameras:
                    self.cameras[camera["id"]] = camera
                logger.info(f"Loaded {len(cameras)} cameras from backend")
            else:
                logger.error(f"Failed to load cameras: {response.status_code} - {response.text}")
        except Exception as e:
            logger.error(f"Error loading cameras: {str(e)}")
    
    def start_camera(self, camera_id: int):
        """
        Start processing a camera feed
        
        Args:
            camera_id: ID of the camera to start
        """
        if camera_id not in self.cameras:
            logger.error(f"Camera {camera_id} not found")
            return False
        
        if camera_id in self.camera_threads and self.camera_threads[camera_id].is_alive():
            logger.warning(f"Camera {camera_id} is already running")
            return True
        
        camera = self.cameras[camera_id]
        self.running[camera_id] = True
        
        # Start camera thread
        thread = threading.Thread(
            target=self._process_camera_feed,
            args=(camera_id, camera["url"]),
            daemon=True
        )
        self.camera_threads[camera_id] = thread
        thread.start()
        
        logger.info(f"Started camera {camera_id} - {camera['name']}")
        return True
    
    def stop_camera(self, camera_id: int):
        """
        Stop processing a camera feed
        
        Args:
            camera_id: ID of the camera to stop
        """
        if camera_id not in self.running:
            logger.warning(f"Camera {camera_id} is not running")
            return False
        
        self.running[camera_id] = False
        if camera_id in self.camera_threads:
            self.camera_threads[camera_id].join(timeout=5.0)
            del self.camera_threads[camera_id]
        
        logger.info(f"Stopped camera {camera_id}")
        return True
    
    def start_all_cameras(self):
        """Start all cameras"""
        for camera_id in self.cameras:
            self.start_camera(camera_id)
    
    def stop_all_cameras(self):
        """Stop all cameras"""
        for camera_id in list(self.running.keys()):
            self.stop_camera(camera_id)
    
    def _process_camera_feed(self, camera_id: int, camera_url: str):
        """
        Process frames from a camera feed
        
        Args:
            camera_id: ID of the camera
            camera_url: URL of the camera feed (RTSP, HTTP, etc.)
        """
        # For testing, use a dummy video or webcam if RTSP URL is not available
        if camera_url.startswith("rtsp://") or camera_url.startswith("http://"):
            cap = cv2.VideoCapture(camera_url)
        else:
            # Use webcam as fallback
            cap = cv2.VideoCapture(0)
        
        if not cap.isOpened():
            logger.error(f"Failed to open camera {camera_id} - {camera_url}")
            self.running[camera_id] = False
            return
        
        logger.info(f"Processing camera {camera_id} - {camera_url}")
        
        last_process_time = 0
        
        while self.running.get(camera_id, False):
            ret, frame = cap.read()
            
            if not ret:
                logger.warning(f"Failed to read frame from camera {camera_id}")
                time.sleep(1)
                continue
            
            current_time = time.time()
            
            # Process frame at specified interval
            if current_time - last_process_time >= self.frame_interval:
                last_process_time = current_time
                
                try:
                    # Convert frame to base64
                    _, buffer = cv2.imencode('.jpg', frame)
                    frame_base64 = base64.b64encode(buffer).decode('utf-8')
                    
                    # Send frame to backend for processing
                    self._send_frame_to_backend(camera_id, frame_base64)
                except Exception as e:
                    logger.error(f"Error processing frame from camera {camera_id}: {str(e)}")
            
            # Small delay to reduce CPU usage
            time.sleep(0.01)
        
        # Release camera
        cap.release()
        logger.info(f"Camera {camera_id} processing stopped")
    
    def _send_frame_to_backend(self, camera_id: int, frame_base64: str):
        """
        Send a frame to the backend for processing
        
        Args:
            camera_id: ID of the camera
            frame_base64: Base64 encoded frame
        """
        try:
            response = requests.post(
                f"{self.backend_url}/api/process-frame",
                headers={"Authorization": f"Bearer {self.api_token}"},
                json={"camera_id": camera_id, "frame": frame_base64}
            )
            
            if response.status_code == 200:
                result = response.json()
                detections = result.get("detections", [])
                if detections:
                    logger.info(f"Camera {camera_id}: Detected {len(detections)} faces")
            else:
                logger.error(f"Failed to process frame: {response.status_code} - {response.text}")
        except Exception as e:
            logger.error(f"Error sending frame to backend: {str(e)}")
    
    def set_frame_interval(self, interval: float):
        """
        Set the frame processing interval
        
        Args:
            interval: Interval in seconds between processed frames
        """
        if interval > 0:
            self.frame_interval = interval
            logger.info(f"Set frame interval to {interval} seconds")

# Example usage
if __name__ == "__main__":
    import os
    import time
    
    # Get backend URL and token from environment
    backend_url = os.getenv("BACKEND_URL", "http://localhost:8000")
    
    # Get token
    try:
        response = requests.post(
            f"{backend_url}/token",
            data={"username": "admin", "password": "admin123"}
        )
        
        if response.status_code == 200:
            token = response.json()["access_token"]
            
            # Initialize camera service
            camera_service = CameraService(backend_url, token)
            
            # Start all cameras
            camera_service.start_all_cameras()
            
            # Run for 1 hour
            time.sleep(3600)
            
            # Stop all cameras
            camera_service.stop_all_cameras()
        else:
            print(f"Failed to get token: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"Error: {str(e)}")
