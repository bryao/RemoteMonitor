import asyncio
from bleak import BleakClient
import struct
import time
from flask import Flask, jsonify, request
import threading
from flask_cors import CORS

"""
This script integrates Bluetooth Low Energy (BLE) communication with a Flask web server. 
It connects to a specific BLE device, collects sensor sensor_data, and exposes that data through an HTTP API.

Key Components:
1. Bluetooth Connection: Uses the `bleak` library to connect to a BLE device, read data, and handle notifications.
2. Data Handling: The script accumulates incoming data in a data_buffer, parses frames, and stores sensor readings.
3. Flask Server: Provides a REST API to expose the latest sensor readings via an HTTP GET request.
4. Multithreading: Runs the Flask server in a separate thread to work alongside the Bluetooth data collection.

How It Works:
- The `connect_to_bluetooth_device` function establishes a connection with a Bluetooth device and starts receiving notifications.
- Data is processed and stored in the `data` dictionary, which is accessible via an API endpoint (`/`).
- The Flask server runs concurrently, allowing users to access real-time data through the REST API.

Dependencies:
- bleak: For Bluetooth communication
- Flask: For creating the REST API
- flask_cors: To enable CORS for the Flask API
"""

# Flask app initialization
app = Flask(__name__)
CORS(app)  # Enable Cross-Origin Resource Sharing for the Flask app

# Bluetooth device details
bluetooth_address = "24:9f:89:30:f2:23"  # Address of the Bluetooth device to connect to
model_number_uuid = "00002a00-0000-1000-8000-00805f9b34fb"  # UUID for the device model number
characteristic_uuid_write = '0000fff1-0000-1000-8000-00805f9b34fb'  # UUID for writing commands
characteristic_uuid_notify = '0000fff2-0000-1000-8000-00805f9b34fb'  # UUID for receiving notifications

# Buffer to accumulate incoming data
buffer = bytearray()
# Shared data dictionary to store latest Bluetooth sensor readings
data = {'Timestamp': 0, 'Velocity': 0, 'Temperature': 0}

# Callback function to handle incoming data from the Bluetooth device
def notification_callback(sender: int, data: bytearray):
    global buffer
    buffer.extend(data)  # Add new data to buffer
    if len(buffer) > 40:  # If buffer has enough data, process it
        buffer_read()

# Function to read and parse buffer
def buffer_read():
    global buffer
    # Read data from the buffer while there's enough data to form a complete frame
    while len(buffer) >= 32:
        if buffer[0:2] == b'\x10\x80':  # Check for frame start bytes
            frame_length = buffer[2] + 8  # Frame length from buffer data
            frame = buffer[:frame_len]  # Extract frame from buffer
            buffer[:frame_len] = b''  # Remove the processed frame from buffer
            parse_frame(frame)  # Parse the frame data
        else:
            buffer[:1] = b''  # Remove the first byte if it doesn't match expected frame start
    return

# Function to parse individual data frames
def parse_frame(frame):
    global data
    parameter_length = frame[8]  # Get the length of the parameter name
    parameter = frame[12:12+parameter_len].decode(encoding='utf-8')  # Decode parameter name

    # If the parameter is 'Velocity', reset Timestamp and set initial Velocity value
    if parameter == 'Velocity':
        data['Timestamp'] = time.time()  # Store the current time as the timestamp
        data['Velocity'] = False  # Indicate that a Velocity value is expected

    # Extract the value from the frame data and format it
    value = struct.unpack('<f', frame[12+parameter_len:12+parameter_len+4])[0]
    data[parameter] = '{:.2f}'.format(value)  # Format the value with two decimal places

    # Print the data once the velocity parameter has been received
    if data['Velocity'] is not False:
        print(data)

# Flask route to expose data via HTTP GET request
@app.route('/')
def get_sensor_data():
    return jsonify(data)  # Return the data in JSON format

# Main asynchronous function to connect to the Bluetooth device and start data acquisition
async def Testo405i(address):
    try:
        # Connect to the Bluetooth device using Bleak
        async with BleakClient(address) as client:
            # Read and print model number
            model_number = await client.read_gatt_char(MODEL_NBR_UUID)
            print("Model Number: {0}".format("".join(map(chr, model_number))))

            # Start notification on a characteristic and write commands to initiate measurements
            await client.start_notify(uuid_chr4, callback)
            await client.write_gatt_char(uuid_chr1, b"\x56\x00\x03\x00\x00\x00\x0c\x69\x02\x3e\x81", response=True)
            await client.write_gatt_char(uuid_chr1, b"\x20\x01\x00\x00\x00\x00\x3a\xbb", response=True)
            await client.write_gatt_char(uuid_chr1, b"\x04\x02\x15\x00\x00\x00\x7c\x53\x0f\x00\x00\x00\x46\x69\x72\x6d\x77\x61\x72\x65", response=True)
            await client.write_gatt_char(uuid_chr1, b"\x56\x65\x72\x73\x69\x6f\x6e\x30\x4f", response=True)  # Request firmware version
            await client.write_gatt_char(uuid_chr1, b"\x11\x03\x00\x00\x00\x00\x47\x5a", response=True)  # Start continuous measurement
            
            # Keep the connection alive and read data periodically
            while True:        
                await asyncio.sleep(1200)  # Sleep for 20 minutes
                buffer_read()  # Read remaining data in the buffer

                # Cancel all active asyncio tasks (stop execution)
                for task in asyncio.all_tasks():
                    task.cancel()
    except Exception as e:
        print(f"Bluetooth error: {e}")  # Print any error that occurs

# Function to run Flask app in a separate thread
def run_flask():
    app.run(debug=True, use_reloader=False, port=5003)

# Main entry point of the script
if __name__ == "__main__":
    flask_thread = threading.Thread(target=run_flask)  # Create a thread for Flask
    flask_thread.start()  # Start the Flask thread
    asyncio.run(Testo405i(address))  # Start the Bluetooth connection and data collection
    flask_thread.join()  # Wait for the Flask thread to finish