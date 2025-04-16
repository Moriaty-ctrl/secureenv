import asyncio
import json
import logging
import websockets
from typing import Callable, Dict, List, Optional, Any

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger("websocket_client")

class WebSocketClient:
    def __init__(self, websocket_url: str):
        """
        Initialize the WebSocket client
        
        Args:
            websocket_url: URL of the WebSocket server
        """
        self.websocket_url = websocket_url
        self.websocket = None
        self.running = False
        self.callbacks: Dict[str, List[Callable]] = {}
    
    async def connect(self):
        """Connect to the WebSocket server"""
        try:
            self.websocket = await websockets.connect(self.websocket_url)
            self.running = True
            logger.info(f"Connected to WebSocket server at {self.websocket_url}")
            return True
        except Exception as e:
            logger.error(f"Failed to connect to WebSocket server: {str(e)}")
            return False
    
    async def disconnect(self):
        """Disconnect from the WebSocket server"""
        if self.websocket:
            await self.websocket.close()
            self.websocket = None
            self.running = False
            logger.info("Disconnected from WebSocket server")
    
    async def listen(self):
        """Listen for messages from the WebSocket server"""
        if not self.websocket:
            logger.error("Not connected to WebSocket server")
            return
        
        try:
            while self.running:
                try:
                    message = await self.websocket.recv()
                    await self._handle_message(message)
                except websockets.exceptions.ConnectionClosed:
                    logger.warning("WebSocket connection closed")
                    break
                except Exception as e:
                    logger.error(f"Error receiving message: {str(e)}")
        finally:
            await self.disconnect()
    
    async def _handle_message(self, message: str):
        """
        Handle a message from the WebSocket server
        
        Args:
            message: Message received from the server
        """
        try:
            data = json.loads(message)
            
            # Determine message type
            message_type = data.get("type", "unknown")
            
            # Call registered callbacks for this message type
            if message_type in self.callbacks:
                for callback in self.callbacks[message_type]:
                    try:
                        callback(data)
                    except Exception as e:
                        logger.error(f"Error in callback for {message_type}: {str(e)}")
            
            # Call general callbacks
            if "all" in self.callbacks:
                for callback in self.callbacks["all"]:
                    try:
                        callback(data)
                    except Exception as e:
                        logger.error(f"Error in general callback: {str(e)}")
        except json.JSONDecodeError:
            logger.warning(f"Received non-JSON message: {message}")
        except Exception as e:
            logger.error(f"Error handling message: {str(e)}")
    
    def register_callback(self, message_type: str, callback: Callable[[Dict[str, Any]], None]):
        """
        Register a callback for a specific message type
        
        Args:
            message_type: Type of message to listen for
            callback: Function to call when a message of this type is received
        """
        if message_type not in self.callbacks:
            self.callbacks[message_type] = []
        
        self.callbacks[message_type].append(callback)
        logger.info(f"Registered callback for message type: {message_type}")
    
    async def send(self, data: dict):
        """
        Send a message to the WebSocket server
        
        Args:
            data: Data to send
        """
        if not self.websocket:
            logger.error("Not connected to WebSocket server")
            return False
        
        try:
            await self.websocket.send(json.dumps(data))
            return True
        except Exception as e:
            logger.error(f"Error sending message: {str(e)}")
            return False

# Example usage
async def example():
    # Create WebSocket client
    client = WebSocketClient("ws://localhost:8000/ws")
    
    # Register callbacks
    def on_detection(data):
        print(f"Detection: {data}")
    
    def on_all_messages(data):
        print(f"Received message: {data}")
    
    client.register_callback("detection", on_detection)
    client.register_callback("all", on_all_messages)
    
    # Connect to server
    if await client.connect():
        # Start listening for messages
        await client.listen()

if __name__ == "__main__":
    asyncio.run(example())
