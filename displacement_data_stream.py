"""
This Flask server with SocketIO collects and broadcasts data from an Arduino device over TCP/IP.
The server periodically receives displacement data, performs a Fast Fourier Transform (FFT) on
the data to extract frequency components, and emits both the raw and FFT-processed data to
connected clients in real time. The server handles a single background task to fetch and
process the data as it is received from the Arduino, ensuring efficient real-time data handling.
"""


from flask import Flask
from flask_socketio import SocketIO
import eventlet
import numpy as np
import socket
import datetime
import re
import struct
# Initialize Flask and SocketIO for real-time communication
app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*", async_mode='eventlet')


# Establish a TCP socket connection to the Arduino
arduino_ip = '192.168.137.39'
arduino_port = 8888
arduino_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
arduino_socket.connect((arduino_ip, arduino_port))
arduino_socket.settimeout(1.0)  # Configure a timeout for the socket operations


def process_and_emit_data():
    """Continuously fetch, process, and emit data from the Arduino.
    
    This function runs in a background task, receiving displacement data from the Arduino,
    performing FFT on accumulated data to derive frequency components, and emitting the
    results to connected clients. It handles both the reception of raw data and its subsequent
    processing within the same loop for efficiency.
    """
    sampling_rate = 250  # Define the sampling rate for FFT calculations
    displacement_data = []  # List to store raw data points


    while True:
        try:
            socketio.sleep(0)  # Emit data at 1ms intervals


            # Attempt to receive data from Arduino
            response = arduino_socket.recv(4)
            displacement = struct.unpack('>f',response)
            print(displacement)
            if displacement:
                data_point = float(displacement[0])
                if data_point <= 200:
                    timestamp = datetime.datetime.now().strftime('%H:%M:%S.%f')[:-3]
                    socketio.emit('displacement_data', {'time': timestamp, 'value': data_point})


                    # Store and process data for FFT
                    displacement_data.append(displacement)
                    if len(displacement_data) >= sampling_rate:
                        # Perform FFT and emit results
                        fft_result = np.fft.fft(displacement_data)
                        freq = np.fft.fftfreq(len(displacement_data), 1/sampling_rate)
                        n = len(fft_result)
                        magnitude = 2.0 / n * np.abs(fft_result[:n // 2])
                        frequency = freq[:n // 2]
                        print({'frequency':frequency.tolist(), 'magnitude': magnitude.tolist()})
                        socketio.emit('displacement_fft_data', {'frequency':frequency.tolist(), 'magnitude': magnitude.tolist()})
                        displacement_data.clear()
        except socket.timeout:
            continue
        except Exception as e:
            print(f"Error: {e}")


@socketio.on('connect')
def on_connect():
    """Handle client connection by starting the data processing task."""
    print('Client connected')
    global data_task
    data_task = socketio.start_background_task(process_and_emit_data)


@socketio.on('disconnect')
def on_disconnect():
    """Handle client disconnection by terminating the data processing task."""
    print('Client disconnected')
    data_task.kill()


if __name__ == '__main__':
    # Launch the Flask-SocketIO server
    socketio.run(app, host='0.0.0.0', port=5002, debug=False)



