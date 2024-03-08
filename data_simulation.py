from flask import Flask, send_file
from flask_cors import CORS
import socket

app = Flask(__name__)
CORS(app)  # This will enable CORS for all routes

@app.route('/')
def home():
    return send_file('life-expectancy-table.json', mimetype='application/json')

if __name__ == '__main__':
    # Get the local IP address
    hostname = socket.gethostname()
    local_ip = socket.gethostbyname(hostname)
    
    print(f"Server starting on http://{local_ip}:5000")
    
    # Start the Flask server on the local IP address and port 5000
    app.run(host='0.0.0.0', port=5001)
