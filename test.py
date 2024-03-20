from flask import Flask
from flask_socketio import SocketIO
import eventlet
import socket
import json
from numpy.fft import fft, fftfreq
import numpy as np

arduino_ip = '192.168.137.211'
arduino_port = 80

s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.connect((arduino_ip, arduino_port))

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*", async_mode='eventlet')

# Global flag to control the background thread execution
is_thread_active = False

def fetch_data():
    with eventlet.Timeout(1, False):
        try:
            s.send(b'GET /displacement HTTP/1.1\r\n')
            response = s.recv(1024).decode('utf-8')
            response = response.split('\n')
            print(1)
            return float(json.loads(response[0])['displacement'])
        except Exception as e:
            print(f"Error fetching data: {e}")
            return None

def background_thread():
    global is_thread_active
    print("Background thread started")
    count = 1
    sample_rate = 1000
    sine_wave_data = []
    while is_thread_active:
        socketio.sleep(0.001)
        data = fetch_data()
        if data is not None:
            process_data(count, data, sine_wave_data, sample_rate)
        count += 1
    print("Background thread stopped")

def process_data(count, y, sine_wave_data, sample_rate):
    sine_wave_data.append(y)
    socketio.emit('sin_wave', {'x': count, 'y': y})

    if len(sine_wave_data) > sample_rate:
        yf = fft(sine_wave_data)
        xf = fftfreq(len(sine_wave_data), 1 / sample_rate)
        yf_abs = np.abs(yf[:len(sine_wave_data)//2])
        fft_data = list(zip(xf[:len(sine_wave_data)//2], yf_abs))
        socketio.emit('sin_wave_fft', {'x': count, 'y': fft_data})
        sine_wave_data.clear()

@socketio.on('connect')
def on_connect():
    global is_thread_active
    is_thread_active = True
    print('Client connected')
    eventlet.spawn(background_thread)

@socketio.on('disconnect')
def on_disconnect():
    global is_thread_active
    is_thread_active = False
    print('Client disconnected')

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5002, debug=False)
