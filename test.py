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
import struct

arduino_ip = '192.168.0.180'  
arduino_port = 8888
s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.connect((arduino_ip, arduino_port))
while 1:
    s.settimeout(1.0)
    # s.send(b'GET /displacement HTTP/1.1\r\n')
    response = s.recv(4)
    received_int = struct.unpack('>f',response)[0]
    # print("Time:",time.time()-start)
    print(received_int)