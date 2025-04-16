#!/usr/bin/env python3
"""
ESTIN Entry Detection System - Backend Runner

This script starts all the necessary services for the ESTIN Entry Detection System:
- FastAPI backend server
- Camera service for processing video feeds
- Notification service for sending alerts
"""

import os
import sys
import time
import argparse
import subprocess
import logging
import signal
import requests
import threading
from typing import List, Dict

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger("runner")

# Global variables
processes: Dict[str, subprocess.Popen] = {}
running = True

def start_backend_server(host: str = "0.0.0.0", port: int = 8000, reload: bool = True):
    """Start the FastAPI backend server"""
    cmd = ["uvicorn", "main:app", "--host", host, "--port", str(port)]
    
    if reload:
        cmd.append("--reload")
    
    logger.info(f"Starting backend server: {' '.join(cmd)}")
    
    # Start the process
    process = subprocess.Popen(
        cmd,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True
    )
    
    processes["backend"] = process
    logger.info("Backend server started")
    
    return process

def start_camera_service():
    """Start the camera service"""
    # In a real implementation, this would start the camera_service.py script
    # For now, we'll just log that it would be started
    logger.info("Camera service would be started here")
    
    # Example of how to start it:
    # cmd = ["python", "camera_service.py"]
    # process = subprocess.Popen(cmd)
    # processes["camera"] = process
    
    return None

def start_notification_service():
    """Start the notification service"""
    # In a real implementation, this would start the notification_service.py script
    # For now, we'll just log that it would be started
    logger.info("Notification service would be started here")
    
    # Example of how to start it:
    # cmd = ["python", "notification_service.py"]
    # process = subprocess.Popen(cmd)
    # processes["notification"] = process
    
    return None

def initialize_database():
    """Initialize the database with default data"""
    logger.info("Initializing database...")
    
    try:
        subprocess.run(["python", "init_db.py"], check=True)
        logger.info("Database initialized successfully")
    except subprocess.CalledProcessError as e:
        logger.error(f"Failed to initialize database: {e}")
        sys.exit(1)

def monitor_processes():
    """Monitor running processes and restart if needed"""
    while running:
        for name, process in list(processes.items()):
            if process and process.poll() is not None:
                logger.warning(f"{name} process exited with code {process.returncode}")
                
                # Read output
                stdout, stderr = process.communicate()
                if stdout:
                    logger.info(f"{name} stdout: {stdout}")
                if stderr:
                    logger.error(f"{name} stderr: {stderr}")
                
                # Restart process
                logger.info(f"Restarting {name} process...")
                if name == "backend":
                    processes[name] = start_backend_server()
                elif name == "camera":
                    processes[name] = start_camera_service()
                elif name == "notification":
                    processes[name] = start_notification_service()
        
        # Sleep to reduce CPU usage
        time.sleep(1)

def signal_handler(sig, frame):
    """Handle termination signals"""
    global running
    logger.info("Shutting down...")
    running = False
    
    # Terminate all processes
    for name, process in processes.items():
        if process:
            logger.info(f"Terminating {name} process...")
            process.terminate()
    
    # Wait for processes to exit
    for name, process in processes.items():
        if process:
            try:
                process.wait(timeout=5)
                logger.info(f"{name} process terminated")
            except subprocess.TimeoutExpired:
                logger.warning(f"{name} process did not terminate, killing...")
                process.kill()
    
    sys.exit(0)

def main():
    """Main entry point"""
    parser = argparse.ArgumentParser(description="ESTIN Entry Detection System - Backend Runner")
    parser.add_argument("--host", default="0.0.0.0", help="Host to bind the backend server to")
    parser.add_argument("--port", type=int, default=8000, help="Port to bind the backend server to")
    parser.add_argument("--no-reload", action="store_true", help="Disable auto-reload for the backend server")
    parser.add_argument("--init-db", action="store_true", help="Initialize the database")
    parser.add_argument("--camera", action="store_true", help="Start the camera service")
    parser.add_argument("--notification", action="store_true", help="Start the notification service")
    
    args = parser.parse_args()
    
    # Register signal handlers
    signal.signal(signal.SIGINT, signal_handler)
    signal.signal(signal.SIGTERM, signal_handler)
    
    # Initialize database if requested
    if args.init_db:
        initialize_database()
    
    # Start backend server
    start_backend_server(args.host, args.port, not args.no_reload)
    
    # Start camera service if requested
    if args.camera:
        start_camera_service()
    
    # Start notification service if requested
    if args.notification:
        start_notification_service()
    
    # Start monitoring thread
    monitor_thread = threading.Thread(target=monitor_processes, daemon=True)
    monitor_thread.start()
    
    # Wait for termination
    try:
        while running:
            time.sleep(1)
    except KeyboardInterrupt:
        signal_handler(signal.SIGINT, None)

if __name__ == "__main__":
    main()
