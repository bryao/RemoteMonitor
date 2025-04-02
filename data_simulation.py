from flask import Flask
from flask_socketio import SocketIO
import eventlet
import numpy as np
import socket
import datetime
import struct
import signal 
import sys 

# Initialize Flask and SocketIO for real-time communication
app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*", async_mode='eventlet')

# Establish a TCP socket connection to the Arduino
arduino_ip = '192.168.137.126'
arduino_port = 8888
arduino_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
arduino_socket.connect((arduino_ip, arduino_port))
arduino_socket.settimeout(1) # Set timeout for socket operations

# Global storage for displacement and FFT data
displacementData = []  # Stores raw displacement data
fftData = {}  # Stores FFT-processed frequency and magnitude data
sampling_rate = 250  # Define the sampling rate for FFT calculations

def signalHandler(sig, frame):
    print("Existing")
    sys.exit(0)

def fetch_and_process_data():
    """Runs in the background, fetching displacement data, processing FFT, and storing results."""
    global displacementData, fftData   

    while True:
        try:
            eventlet.sleep(0.01)  # controlling collecting displacement data speed
            

            # Receive displacement data from Arduino
            response = arduino_socket.recv(4)
            displacement = struct.unpack('>f', response)
            print(displacement)
            #print(not displacement)
            if displacement:
                data_point = float(displacement[0])
                print(len(displacementData))
                # 200
                timestamp = datetime.datetime.now().strftime('%H:%M:%S.%f')[:-3]
                displacementData.append({'x': timestamp, 'y': data_point})

                # Store displacement data
                #x = time y = value
                #print(displacementData)

                # Process FFT when enough data is collected
                if len(displacementData) >= sampling_rate:
                    fft_result = np.fft.fft([d['y'] for d in displacementData])
                    freq = np.fft.fftfreq(len(displacementData), 1 / sampling_rate)
                    n = len(fft_result)
                    magnitude = 2.0 / n * np.abs(fft_result[:n // 2])
                    frequency = freq[:n // 2]

                    # Store FFT data
                    fftData = {'x': frequency.tolist(), 'y': magnitude.tolist()} #changed "frequencty" for x and the other for y
                    displacementData.clear()  # Clear old data for new processing
                    

        except socket.timeout:
            continue
        except Exception as e:
            print(f"Error: {e}")


@socketio.on('connect')
def on_connect():
    """Send stored data to the connected client in a background task."""
    print('Client connected')
    socketio.start_background_task(target=stream_data_to_client)

def stream_data_to_client():
    """Continuously send data to the connected client."""
    while True:
        eventlet.sleep(0.025)  #0.025
        # Small delay to prevent excessive CPU usage

        if displacementData:
            #print(displacementData[-1])
            socketio.emit('sin_wave', displacementData[-1])  # Send latest displacement data

        if fftData:
            socketio.emit('sin_wave_fft', fftData)  # Send latest FFT result

@socketio.on('disconnect')
def on_disconnect():
    """Handle client disconnection."""
    print('Client disconnected')


if __name__ == '__main__':
    
    # Start the data processing function as a background task
    socketio.start_background_task(fetch_and_process_data)
    # Launch the Flask-SocketIO server
    socketio.run(app, host='0.0.0.0', port=5002, debug=False)


    signal.signal(signal.SIGINT,signalHandler)
    print("ctrl+c")
    signal.pause()

