from flask import Flask
from flask_socketio import SocketIO
import eventlet
import time
import math
import cv2
import base64

# eventlet.monkey_patch()

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*", async_mode='eventlet')
cap = cv2.VideoCapture(0)
cap.set(cv2.CAP_PROP_BUFFERSIZE, 2)  # Set maximum buffer size

frame_retrieval_delay = 0.00416  # Default frame retrieval delay in seconds (30 FPS)

thread = None  # Initialize the thread variable

def background_thread():
    """Generate sin wave data and emit to all clients."""
    while True:
        socketio.sleep(frame_retrieval_delay)  # Use frame retrieval delay
        ret, frame = cap.read()
        if not ret:
            print("Error: failed to capture image")
            break
        # Encode the frame in JPG format
        _, buffer = cv2.imencode('.jpg', frame)
        # Convert the image to a Base64 string
        jpg_as_text = base64.b64encode(buffer).decode()
        socketio.emit('frame', {'data': jpg_as_text})

def start_background_thread():
    """Start the background thread if it's not already running."""
    global thread
    if thread is None:
        thread = socketio.start_background_task(background_thread)

@socketio.on('connect')
def test_connect():
    print('Client connected')
    start_background_thread()

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5001, debug=True)
