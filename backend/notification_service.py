import smtplib
import logging
import requests
import json
import os
import threading
import time
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime
from typing import Dict, List, Optional

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger("notification_service")

class NotificationService:
    def __init__(self, backend_url: str, api_token: str):
        """
        Initialize the notification service
        
        Args:
            backend_url: URL of the backend API
            api_token: JWT token for API authentication
        """
        self.backend_url = backend_url
        self.api_token = api_token
        self.settings = self._load_settings()
        self.notification_thread = None
        self.running = False
        self.notification_queue = []
        self.queue_lock = threading.Lock()
    
    def _load_settings(self) -> dict:
        """Load settings from the backend API"""
        try:
            response = requests.get(
                f"{self.backend_url}/api/settings",
                headers={"Authorization": f"Bearer {self.api_token}"}
            )
            
            if response.status_code == 200:
                settings = response.json()
                logger.info("Loaded settings from backend")
                return settings
            else:
                logger.error(f"Failed to load settings: {response.status_code} - {response.text}")
                return {}
        except Exception as e:
            logger.error(f"Error loading settings: {str(e)}")
            return {}
    
    def start(self):
        """Start the notification service"""
        if self.notification_thread and self.notification_thread.is_alive():
            logger.warning("Notification service is already running")
            return
        
        self.running = True
        self.notification_thread = threading.Thread(
            target=self._process_notifications,
            daemon=True
        )
        self.notification_thread.start()
        logger.info("Notification service started")
    
    def stop(self):
        """Stop the notification service"""
        self.running = False
        if self.notification_thread:
            self.notification_thread.join(timeout=5.0)
        logger.info("Notification service stopped")
    
    def _process_notifications(self):
        """Process notifications from the queue"""
        while self.running:
            # Process notifications in the queue
            with self.queue_lock:
                if self.notification_queue:
                    notification = self.notification_queue.pop(0)
                    self._send_notification(notification)
            
            # Sleep to reduce CPU usage
            time.sleep(0.1)
    
    def _send_notification(self, notification: dict):
        """
        Send a notification
        
        Args:
            notification: Notification data
        """
        notification_type = notification.get("type")
        
        if notification_type == "email":
            self._send_email_notification(notification)
        elif notification_type == "system":
            self._send_system_notification(notification)
        else:
            logger.warning(f"Unknown notification type: {notification_type}")
    
    def _send_email_notification(self, notification: dict):
        """
        Send an email notification
        
        Args:
            notification: Email notification data
        """
        if not self.settings.get("email_notifications", False):
            logger.info("Email notifications are disabled")
            return
        
        recipient = self.settings.get("email_address")
        if not recipient:
            logger.error("No email recipient configured")
            return
        
        subject = notification.get("subject", "ESTIN Entry Detection System Notification")
        body = notification.get("body", "")
        
        # In a real implementation, you would configure SMTP settings
        # For now, we'll just log the email
        logger.info(f"Would send email to {recipient}: {subject}")
        logger.info(f"Email body: {body}")
        
        # Example of actual email sending (commented out)
        """
        try:
            msg = MIMEMultipart()
            msg['From'] = 'estin@example.com'
            msg['To'] = recipient
            msg['Subject'] = subject
            msg.attach(MIMEText(body, 'plain'))
            
            server = smtplib.SMTP('smtp.example.com', 587)
            server.starttls()
            server.login('username', 'password')
            server.send_message(msg)
            server.quit()
            
            logger.info(f"Email sent to {recipient}")
        except Exception as e:
            logger.error(f"Failed to send email: {str(e)}")
        """
    
    def _send_system_notification(self, notification: dict):
        """
        Send a system notification
        
        Args:
            notification: System notification data
        """
        # In a real implementation, this could send to a notification system
        # For now, we'll just log it
        logger.info(f"System notification: {notification.get('message', '')}")
    
    def add_notification(self, notification_type: str, data: dict):
        """
        Add a notification to the queue
        
        Args:
            notification_type: Type of notification (email, system, etc.)
            data: Notification data
        """
        notification = {"type": notification_type, **data}
        
        with self.queue_lock:
            self.notification_queue.append(notification)
    
    def notify_unknown_visitor(self, visitor_data: dict):
        """
        Send notification about an unknown visitor
        
        Args:
            visitor_data: Data about the unknown visitor
        """
        if not self.settings.get("unknown_alerts", False):
            return
        
        location = visitor_data.get("location", "Unknown location")
        time = visitor_data.get("time", datetime.now().strftime("%H:%M:%S"))
        date = visitor_data.get("date", datetime.now().strftime("%Y-%m-%d"))
        
        # Add email notification
        self.add_notification("email", {
            "subject": f"Unknown Visitor Detected - {location}",
            "body": f"""
            Unknown visitor detected at {location}
            Time: {time}
            Date: {date}
            
            Please check the ESTIN Entry Detection System for more details.
            """
        })
        
        # Add system notification
        self.add_notification("system", {
            "message": f"Unknown visitor detected at {location} ({time})",
            "data": visitor_data
        })
    
    def notify_system_issue(self, issue_type: str, details: str):
        """
        Send notification about a system issue
        
        Args:
            issue_type: Type of issue
            details: Issue details
        """
        if not self.settings.get("system_alerts", False):
            return
        
        # Add email notification
        self.add_notification("email", {
            "subject": f"ESTIN System Alert - {issue_type}",
            "body": f"""
            System issue detected: {issue_type}
            
            Details: {details}
            
            Time: {datetime.now().strftime("%H:%M:%S")}
            Date: {datetime.now().strftime("%Y-%m-%d")}
            
            Please check the ESTIN Entry Detection System for more details.
            """
        })
        
        # Add system notification
        self.add_notification("system", {
            "message": f"System issue: {issue_type}",
            "details": details
        })

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
            
            # Initialize notification service
            notification_service = NotificationService(backend_url, token)
            
            # Start service
            notification_service.start()
            
            # Test notifications
            notification_service.notify_unknown_visitor({
                "location": "Main Entrance",
                "time": "14:30:00",
                "date": "2025-04-16"
            })
            
            notification_service.notify_system_issue(
                "Camera Offline",
                "Camera 'Side Entrance' is offline"
            )
            
            # Wait for notifications to be processed
            time.sleep(5)
            
            # Stop service
            notification_service.stop()
        else:
            print(f"Failed to get token: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"Error: {str(e)}")
