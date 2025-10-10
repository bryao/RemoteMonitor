import asyncio
import datetime
import json
import numpy as np
import struct
import socket
import random

from fastapi import FastAPI
import socketio

# === SETTINGS ===
BASE_SAMPLING_RATE = 250  # base Hz
LOAD_FACTOR = 3  # simulate 3x load
ACTUAL_RATE = BASE_SAMPLING_RATE * LOAD_FACTOR
QUEUE_MAXSIZE = 2000

# === FASTAPI + SOCKET.IO SETUP ===
sio = socketio.AsyncServer(async_mode='asgi', cors_allowed_origins='*')
app = FastAPI()
app.mount("/", socketio.ASGIApp(sio))

# === IN-MEMORY QUEUES ===
displacement_queue = asyncio.Queue(maxsize=QUEUE_MAXSIZE)
fft_output = asyncio.Queue(maxsize=10)



# Establish a TCP socket connection to the Arduino
ESP32_IP = '192.168.137.67'
ESP32_PORT = 8888



# ========== ESP32 TCP READER ==========
async def read_esp32():


    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    try:
        s.connect((ESP32_IP, ESP32_PORT))
        s.settimeout(1)  # Timeout for recv to prevent blocking
        print("✅ Connected to ESP32")

        while True:
            try:
                # Read 4 bytes (float32)
                data = await asyncio.get_event_loop().run_in_executor(None, s.recv, 4)
                if not data:
                    continue

                value = struct.unpack('>f', data)[0]  # Big-endian float
                timestamp = datetime.datetime.now().strftime('%H:%M:%S.%f')[:-3]
                await displacement_queue.put({'x': timestamp, 'y': value})

            except socket.timeout:
                continue
            except Exception as e:
                print(f"⚠️ Error reading from ESP32: {e}")
                await asyncio.sleep(1)  # Backoff on error

    except Exception as e:
        print(f"❌ Could not connect to ESP32: {e}")
        await asyncio.sleep(5)  # Retry loop could be added here


# === FFT PROCESSOR ===
async def process_fft():
    print("⚙️ FFT processor running")
    buffer = []
    while True:
        data = await displacement_queue.get()
        buffer.append(data)

        if len(buffer) >= BASE_SAMPLING_RATE:  # base FFT size (not multiplied)
            y_vals = [d["y"] for d in buffer]
            fft_result = np.fft.fft(y_vals)
            freqs = np.fft.fftfreq(len(y_vals), 1 / BASE_SAMPLING_RATE)
            n = len(fft_result)
            magnitude = 2.0 / n * np.abs(fft_result[:n // 2])
            frequency = freqs[:n // 2]

            fft_data = {"x": frequency.tolist(), "y": magnitude.tolist()}
            await fft_output.put(fft_data)
            buffer.clear()
# === SOCKET.IO EMITTER ===
async def emit_data_to_client():
    print("📡 Socket.IO emitter running")
    last_sent_fft = None
    while True:
        await asyncio.sleep(0.01)

        if not displacement_queue.empty():
            latest = displacement_queue._queue[-1]
            await sio.emit("sin_wave", latest)
        
        if not fft_output.empty():
            fft_data = await fft_output.get()
            if fft_data != last_sent_fft:
                await sio.emit("sin_wave_fft", fft_data)
                last_sent_fft = fft_data

# === SOCKET.IO EVENTS ===
@sio.event
async def connect(sid, environ):
    print(f"Client connected: {sid}")

@sio.event
async def disconnect(sid):
    print(f"Client disconnected: {sid}")


# === FASTAPI STARTUP ===
@app.on_event("startup")
async def startup_tasks():
    asyncio.create_task(read_esp32())
    asyncio.create_task(process_fft())
    asyncio.create_task(emit_data_to_client())
