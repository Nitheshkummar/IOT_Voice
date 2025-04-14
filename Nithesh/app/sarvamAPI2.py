from flask import Flask, render_template, jsonify
from flask_socketio import SocketIO, emit
import requests
import base64
import tempfile
import os
import uuid
import json
import time

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*", async_mode="threading")

SARVAM_API_KEY = "38d7e24a-c064-465c-946e-4b9f858fda49"
SARVAM_API_URL = "https://api.sarvam.ai/speech-to-text-translate"

# Smart home state
smart_home_state = {
    "light": False,
    "fan": False,
    "AC": False
}

@app.route("/")
def home():
    return render_template("voice_page.html", css_file="voice_page.css", js_file="voice_page.js")

@socketio.on("audio_data")
def handle_audio_data(data):
    try:
        audio_data = data.get("audio_data")
        mime_type = data.get("mime_type", "audio/wav")
        
        if not audio_data:
            emit("error", {"message": "No audio data received"})
            return
        
        # Convert base64 to binary
        binary_audio = base64.b64decode(audio_data)
        
        # Create a unique temporary file name
        temp_dir = tempfile.gettempdir()
        unique_id = str(uuid.uuid4())
        temp_file_path = os.path.join(temp_dir, f"audio_{unique_id}.wav")
        
        # Write audio data to the temporary file
        with open(temp_file_path, "wb") as f:
            f.write(binary_audio)
            
        # Prepare the multipart/form-data request
        files = {
            'file': ('audio.wav', open(temp_file_path, 'rb'), 'audio/wav')
        }
        
        payload = {
            'model': 'saaras:v2',
            'with_diarization': 'false'
        }
        
        headers = {
            "api-subscription-key": SARVAM_API_KEY
        }

        response = requests.post(
            SARVAM_API_URL, 
            files=files,
            data=payload,
            headers=headers
        )
        
        # Clean up the temporary file
        try:
            os.remove(temp_file_path)
        except:
            pass

        if response.status_code == 200:
            result = response.json()
            global last_transcript
            last_transcript = result.get("transcript", "No text detected")

            # 🔥 Save it to a file too
            with open("last_command.txt", "w") as f:
                f.write(last_transcript)

            # Emit transcript to frontend
            emit("transcription", {"text": last_transcript})

        else:
            error_message = f"API error: {response.status_code}"
            try:
                error_detail = response.text
                error_message += f" - {error_detail}"
            except:
                pass
            emit("error", {"message": error_message})
            
    except Exception as e:
        emit("error", {"message": f"Server error: {str(e)}"})

@app.route("/sensor")
def get_sensor_data():
    try:
        with open("DHT11/dht_data.json", "r") as f:
            data = json.load(f)
        return data
    except Exception as e:
        return {"error": f"Could not read sensor data: {str(e)}"}, 500

@app.route("/dashboard")
def dashboard():
    return render_template("dashboard.html")

@app.route('/last_command', methods=['GET'])
def last_command():
    try:
        with open("last_command.txt", "r") as f:
            command = f.read().strip()
    except:
        command = "No command received yet"
    return jsonify({"last_command": command})

import sys

import sys
if __name__ == "__main__":
    try:
        socketio.run(app, host="0.0.0.0", port=5001, debug=True)
    except KeyboardInterrupt:
        print("Shutting down server...")
        try:
            socketio.stop()
        except Exception as e:
            print(f"Error while shutting down: {e}")
        sys.exit(0)  # Ensure a clean exit