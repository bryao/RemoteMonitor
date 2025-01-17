# backend.py

from flask import Flask
from flask_socketio import SocketIO
import eventlet
import time
import math
import base64
import datetime
import struct
import socket
from numpy.fft import fft, fftfreq
import numpy as np
# eventlet.monkey_patch()
arduino_ip = '192.168.137.39'  
arduino_port = 8888
# Create a socket object
s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

# Connect to the Arduino server
s.connect((arduino_ip, arduino_port))
s.settimeout(0.8)
app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*", async_mode='eventlet')

thread = None  # Initialize the thread variable

def background_thread():
    """Generate sin wave data and emit to all clients."""
    sample_rate = 250  # 1000 Hz
    sine_wave_data = []
    num_sample = sample_rate
    while True:
        socketio.sleep(0)  # Emit data at 1ms intervals
        # time.sleep(1/1000)
        current_time = datetime.datetime.now().strftime('%H:%M:%S.%f')
        current_time = current_time[:-3]
        
        try:
            response = s.recv(4)
            received_int = struct.unpack('>f',response)[0]
        except socket.timeout as e:
            print(e)
            continue
        # Slice to get only milliseconds (first three digits of the microseconds part)
        print(received_int)
        socketio.emit('sin_wave', {'x': current_time, 'y': received_int})
        if received_int is not None:
            sine_wave_data.append(received_int)
        
        if len(sine_wave_data) >= num_sample:  # Use last second of data for FFT
            # Calculate FFT

            fft_result = fft(sine_wave_data)
            fft_freq = fftfreq(len(sine_wave_data), 1 / sample_rate)
            # Convert complex FFT data to magnitude
            n = len(fft_result)
            magnitude = 2.0 / n * np.abs(fft_result[:n // 2])
            frequency = fft_freq[:n // 2]
            print(magnitude)

            # Emit FFT data
            socketio.emit('sin_wave_fft', {'x':frequency.tolist(), 'y': magnitude.tolist()})

            # Clear the data for the next round of sampling 
            sine_wave_data.clear()

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
    socketio.run(app, host='0.0.0.0',port=5002,debug=False)
