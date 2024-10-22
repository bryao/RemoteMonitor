# This script sets up a Flask server with SocketIO to collect and broadcast data from an Arduino device.
# The server connects to an Arduino over TCP/IP, periodically fetches displacement data, 
# processes it, and emits the raw and FFT-transformed data to connected clients in real time.
# 
# Key components:
# 1. Socket Connection to Arduino: Establishes a socket connection to receive data from Arduino.
# 2. Flask and SocketIO: Manages client connections and data broadcasting.
# 3. Background Thread: Continuously fetches data, processes it, and emits to clients.
# 4. FFT Processing: Performs Fast Fourier Transform on the fetched data to extract frequency components.

from flask import Flask
from flask_socketio import SocketIO
import eventlet
import numpy as np
import socket
import datetime
import re

# Set up socket connection to Arduino
arduino_ip = '192.168.0.180'  # IP address of the Arduino device
arduino_port = 8888  # Port number for Arduino connection
arduino_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)  # Create a socket object
arduino_socket.connect((arduino_ip, arduino_port))  # Connect to the Arduino server

# Set up Flask and SocketIO
app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*", async_mode='eventlet')  # Initialize SocketIO with Flask, allowing cross-origin requests
stop_thread_event = eventlet.event.Event()  # Event to signal the thread to stop
background_thread_instance = None  # Initialize the thread variable

def fetch_displacement_data():
    """Asynchronously fetch the displacement data from Arduino."""
    with eventlet.Timeout(1, False):  # Set a 1-second timeout for the request
        try:
            arduino_socket.settimeout(1.0)  # Set a 1-second timeout for socket communication
            response = arduino_socket.recv(8).decode('utf-8')  # Receive 8 bytes of data and decode from bytes to string
            response_values = re.findall(r'[-+]?(?:\d{1,3}(?:,\d{3})+|\d+)(?:\.\d+)?', response)  # Extract numerical values from the response
            if response_values and (float(response_values[0]) <= 200):  # If response is valid and within acceptable range
                return float(response_values[0])  # Return the extracted value as a float
        except Exception as error:
            print(error)  # Print any exception that occurs
    return None  # Return None if the request fails or times out

def data_background_thread():
    """Fetch data and emit to all clients."""
    sampling_rate = 100  # 100 Hz sample rate for FFT calculations
    displacement_data = []  # List to store fetched data points for processing
    emission_count = 0  # Counter to keep track of emissions
    while not stop_thread_event.ready():  # Continue until the thread stop event is triggered
        socketio.sleep(0.01)  # Emit data at 10ms intervals (equivalent to 100 Hz)
        data_point = fetch_displacement_data()  # Fetch data from Arduino
        if data_point is not None:
            # Get the current time with milliseconds precision
            timestamp = datetime.datetime.now().strftime('%H:%M:%S.%f')[:-3]  # Format the current time and truncate to milliseconds
            # Spawn a new green thread to process the data
            process_and_emit_data(emission_count, timestamp, displacement_data, sampling_rate, data_point)
            emission_count += 1  # Increment the count for each successful data fetch

def process_and_emit_data(emission_count, timestamp, displacement_data, sampling_rate, data_point):
    """Process and emit the fetched data."""
    displacement_data.append(data_point)  # Append the fetched value to the displacement_data list
    socketio.emit('displacement_data', {'x': timestamp, 'y': data_point})  # Emit the fetched data to all clients

    # Limit the displacement_data length to keep the FFT manageable
    if len(displacement_data) > sampling_rate:  # If we have more than one second of data
        # Calculate the Fast Fourier Transform (FFT) of the collected data
        fft_magnitude = np.abs(np.fft.fft(displacement_data)[:len(displacement_data) // 2])  # Calculate the magnitude of the FFT
        fft_frequency = np.fft.fftfreq(len(displacement_data), 1 / sampling_rate)[:len(displacement_data) // 2]  # Calculate the frequency bins

        # Emit FFT data to clients
        fft_data_pairs = list(zip(fft_frequency, fft_magnitude))  # Create a list of frequency and magnitude pairs
        socketio.emit('displacement_fft_data', {'x': emission_count, 'y': fft_data_pairs})  # Emit the FFT data
        displacement_data.clear()  # Clear the list to start collecting new data

def start_data_background_thread():
    """Start the background thread if not already running."""
    global background_thread_instance, stop_thread_event
    if background_thread_instance is None or stop_thread_event.ready():  # If no thread is running or the current thread is ready to stop
        stop_thread_event = eventlet.event.Event()  # Create a new Event for the new thread
        background_thread_instance = socketio.start_background_task(data_background_thread)  # Start the background thread

@socketio.on('connect')
def handle_client_connect():
    """Handle a new client connection."""
    print('Client connected')  # Log client connection
    start_data_background_thread()  # Start the background thread to fetch data

@socketio.on('disconnect')
def handle_client_disconnect():
    """Handle client disconnection."""
    print('Client disconnected')  # Log client disconnection
    # stop_thread_event.set()  # Signal the event to stop the background thread

if __name__ == '__main__':
    # Run the Flask server with SocketIO
    socketio.run(app, host='0.0.0.0', port=5002, debug=False)  # Bind to all IP addresses, use port 5002