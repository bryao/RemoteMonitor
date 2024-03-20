# backend.py

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
thread = None  # Initialize the thread variable

def background_thread():
    """Generate sin wave data and emit to all clients."""
    count = 0
    while True:
        socketio.sleep(0.016)  # Emit data at 1ms intervals
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
    socketio.run(app, host='0.0.0.0',port=5001,debug=True)
