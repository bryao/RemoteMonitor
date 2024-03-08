from flask import Flask, Response, render_template_string
import cv2
from queue import Queue
from threading import Thread

app = Flask(__name__)
frame_queue = Queue()
camera = cv2.VideoCapture(0)
camera.set(cv2.CAP_PROP_FRAME_WIDTH, 1280)
camera.set(cv2.CAP_PROP_FRAME_HEIGHT, 720)
def camera_capture():
    while True:
        success, frame = camera.read()
        if not success:
            break
        if not frame_queue.full():
            frame_queue.put(frame)

def encode_frames():
    while True:
        if not frame_queue.empty():
            frame = frame_queue.get()
            ret, buffer = cv2.imencode('.jpg', frame)
            frame = buffer.tobytes()
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

@app.route('/')
def index():
    return render_template_string('<img src="/video" />')

@app.route('/video_feed')
def video():
    return Response(encode_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == '__main__':
    capture_thread = Thread(target=camera_capture)
    capture_thread.start()
    app.run(host='0.0.0.0', port=5000, threaded=True)
