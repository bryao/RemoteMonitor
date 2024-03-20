# backend.py

from flask import Flask
from flask_socketio import SocketIO
import eventlet
import time
import math
from numpy.fft import fft, fftfreq
import numpy as np
import requests
import json
import socket
import datetime
import re
# eventlet.monkey_patch()
# url = 'https://my-json-server.typicode.com/typicode/demo/profile'
arduino_ip = '192.168.0.180'  
arduino_port = 8888
# Create a socket object
s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

# Connect to the Arduino server
s.connect((arduino_ip, arduino_port))

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*", async_mode='eventlet')
thread_stop_event = eventlet.event.Event()  # Event to signal the thread to stop

thread = None  # Initialize the thread variable


def fetch_data():
    """Asynchronously fetch the displacement data."""
    with eventlet.Timeout(1, False):  # Set a 1-second timeout for the request
        try:
            start = time.time()
            s.settimeout(1.0)
            # s.send(b'GET /displacement HTTP/1.1\r\n')
            response = s.recv(8).decode('utf-8')
            response = re.findall(r'[-+]?(?:\d{1,3}(?:,\d{3})+|\d+)(?:\.\d+)?', response)
            # print("Time:",time.time()-start)
            print(response[0])
            if (float( response[0]) > 200):
                return None
            
            return float( response[0])
            
        except Exception as e:
            print(e)
            return None  # Return None if the request fails or times out
    return None  # Return None if the request fails or times out

def background_thread(data=None):
    """Generate sin wave data and emit to all clients."""
    sample_rate = 100  # 1000 Hz
    sine_wave_data = []
    count = 0
    while not thread_stop_event.ready():
        socketio.sleep(0.001)  # Emit data at 1ms intervals
        data = fetch_data()
        if data is not None:
            # Get the current time with microseconds
            current_time = datetime.datetime.now().strftime('%H:%M:%S.%f')

            # Slice to get only milliseconds (first three digits of the microseconds part)
            current_time = current_time[:-3]

            # process_data(count,current_time, sine_wave_data, sample_rate)
            eventlet.spawn_n(process_data, count,current_time, sine_wave_data, sample_rate)
            count += 1
        
        if thread_stop_event.ready():
            break
        
        
def process_data(count,time, sine_wave_data,sample_rate):
    """Process and emit the fetched data."""
    y = fetch_data()
    if y is not None:
        sine_wave_data.append(y)
        socketio.emit('sin_wave', {'x': time, 'y': y})

        # Limit the sine_wave_data length to keep the FFT manageable
        if len(sine_wave_data) > sample_rate:  # Use last second of data for FFT
            # Calculate FFT
            yf = fft(sine_wave_data)
            xf = fftfreq(len(sine_wave_data), 1 / sample_rate)

            # Convert complex FFT data to magnitude
            yf_abs = np.abs(yf[:len(sine_wave_data)//2])
            
            # Emit FFT data
            fft_data = list(zip(xf[:len(sine_wave_data)//2], yf_abs))
            socketio.emit('sin_wave_fft', {'x': count, 'y': fft_data})
            sine_wave_data.clear()


def start_background_thread():
    global thread, thread_stop_event
    if thread is None or thread_stop_event.ready():
        thread_stop_event = eventlet.event.Event()  # Create a new Event for the new thread
        thread = socketio.start_background_task(background_thread)

@socketio.on('connect')
def on_connect():
    print('Client connected')
    stop_event = eventlet.event.Event()  # Create a new Event object for each connection
    eventlet.spawn(background_thread, stop_event)

@socketio.on('disconnect')
def on_disconnect():
    global stop_event
    print('Client disconnected')
    stop_event.set()  # Signal the event to stop the thread

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0',port=5002,debug=False)