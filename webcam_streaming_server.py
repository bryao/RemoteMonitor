# webcam_streaming_server.py
#
# This script implements a simple backend server using Flask and Flask-SocketIO to stream video data from a webcam to connected clients in real-time. 
# It captures video frames from the default webcam, encodes them in JPEG format, and sends them to clients via WebSockets. The server supports multiple clients
# and uses eventlet for efficient asynchronous communication.
#
# Key components:
# 1. Flask: A lightweight web framework used to create the web server.
# 2. Flask-SocketIO: An extension that adds WebSocket capabilities to Flask for real-time communication.
# 3. OpenCV (cv2): Used to capture video frames from the webcam.
# 4. Base64: Encodes the frames to be sent over the WebSocket connection.

from flask import Flask
from flask_socketio import SocketIO
import eventlet
import time
import math
import cv2
import base64

# eventlet.monkey_patch()

# Create a Flask web application instance
flask_app = Flask(__name__)

# Initialize SocketIO for real-time communication with clients
# Allows cross-origin requests, and uses eventlet for async mode
socket_io = SocketIO(flask_app, cors_allowed_origins="*", async_mode='eventlet')

# Open a connection to the default webcam (index 0)
video_capture = cv2.VideoCapture(0)

# Thread variable to keep track of the background process
background_thread_task = None  # Initialize the background_thread_task variable

def background_thread():
    """Generate video_frame data from webcam and emit to all clients."""
    count = 0
    while True:
        # Introduce a slight delay to emit data at approximately 60 frames per second
        socket_io.sleep(0.016)  # Emit data at roughly 16ms intervals (equivalent to 60fps)
        
        # Capture a video_frame from the webcam
        frame_captured, video_frame = video_capture.read()
        if not frame_captured:
            # If video_frame capture fails, print an error message and break the loop
            print("Error: failed to capture image")
            break
        
        # Encode the video_frame in JPG format
        _, encoded_buffer = cv2.imencode('.jpg', video_frame)
        
        # Convert the encoded image to a Base64 string to be sent via SocketIO
        frame_base64 = base64.b64encode(encoded_buffer).decode()
        
        # Emit the video_frame to all connected clients under the event 'video_frame'
        socket_io.emit('video_frame', {'data': frame_base64})

def start_background_thread():
    """Start the background background_thread_task if it's not already running."""
    global background_thread_task
    if background_thread_task is None:
        # Start the background background_thread_task that captures and sends frames if it's not already running
        background_thread_task = socket_io.start_background_task(background_thread)

@socket_io.on('connect')
def test_connect():
    """Handler for when a client connects to the server."""
    print('Client connected')
    # Start sending frames when a client connects
    start_background_thread()

# Run the Flask-SocketIO flask_app when the script is executed directly
if __name__ == '__main__':
    # Run the flask_app on all available IP addresses, port 5001, and enable debugging
    socket_io.run(flask_app, host='0.0.0.0', port=5001, debug=True)