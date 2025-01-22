import datetime
import struct
import socket
import eventlet
import numpy as np
from flask import Flask
from flask_socketio import SocketIO
from scipy.fft import fft, fftfreq

# Arduino server configuration
arduino_ip = '192.168.137.198'
arduino_port = 8888

# Create a socket object
s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.connect((arduino_ip, arduino_port))

# Flask-SocketIO setup
app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*", async_mode='eventlet')
thread_stop_event = eventlet.event.Event()  # Event to signal the thread to stop
thread = None  # Initialize the thread variable

def fetch_data():
    """Fetch displacement data asynchronously from the Arduino server."""
    try:
        s.settimeout(0.1)  # Set a shorter timeout for faster responsiveness
        response = s.recv(4)
        if len(response) == 4:
            displacement =  struct.unpack('>f', response)[0]
            print(displacement)
            return displacement
    except socket.timeout:
        print("Socket timeout")
    except Exception as e:
        print(f"Error fetching data: {e}")
    return None  # Return None on any failure

def background_thread():
    """Generate and emit sine wave data to all connected clients."""
    sample_rate = 250  # 250 Hz sampling rate
    sine_wave_data = []  # Buffer to store recent samples for FFT
    count = 0

    while not thread_stop_event.ready():
        try:
            socketio.sleep(0.001)  # Emit data at 1 ms intervals

            # Fetch data from the Arduino server
            data = fetch_data()
            if data is not None:
                current_time = datetime.datetime.now().strftime('%H:%M:%S.%f')[:-3]  # Millisecond precision

                # Emit the real-time data to connected clients
                socketio.emit('sin_wave', {'x': current_time, 'y': data})

                # Store the data for FFT processing
                sine_wave_data.append(data)

                # Perform FFT when buffer is full (1 second of data)
                if len(sine_wave_data) >= sample_rate:
                    fft_result = fft(sine_wave_data)
                    fft_freq = fftfreq(len(sine_wave_data), 1 / sample_rate)

                    # Calculate magnitude and frequency
                    n = len(fft_result)
                    magnitude = 2.0 / n * np.abs(fft_result[:n // 2])
                    frequency = fft_freq[:n // 2]

                    # Emit FFT data to clients
                    socketio.emit('sin_wave_fft', {'x': frequency.tolist(), 'y': magnitude.tolist()})

                    # Clear the buffer for the next round
                    sine_wave_data.clear()
            count += 1
        except Exception as e:
            print(f"Error in background thread: {e}")
            break

def start_background_thread():
    """Start the background thread if not already running."""
    global thread, thread_stop_event
    if thread is None or thread_stop_event.ready():
        thread_stop_event = eventlet.event.Event()  # Create a new Event for the new thread
        thread = socketio.start_background_task(background_thread)

@socketio.on('connect')
def on_connect():
    print('Client connected')
    start_background_thread()  # Start the background thread when a client connects

@socketio.on('disconnect')
def on_disconnect():
    print('Client disconnected')
    thread_stop_event.set()  # Signal the thread to stop

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5002, debug=False)