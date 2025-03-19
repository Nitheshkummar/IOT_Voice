from flask import Flask, request, jsonify
from flask_socketio import SocketIO, emit
import requests
import base64
import os
import uuid

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*", async_mode="threading")

# Simulated appliance state (for running on a laptop)
appliance_state = {
    "fan": False,
    "light": False,
    "curtain": False
}

# Sarvam API Config
SARVAM_API_KEY = "38d7e24a-c064-465c-946e-4b9f858fda49"
SARVAM_API_URL = "https://api.sarvam.ai/speech-to-text-translate"

def control_appliance(command):
    if "fan on" in command:
        appliance_state["fan"] = True
    elif "fan off" in command:
        appliance_state["fan"] = False
    elif "light on" in command:
        appliance_state["light"] = True
    elif "light off" in command:
        appliance_state["light"] = False
    elif "curtain open" in command:
        appliance_state["curtain"] = True
    elif "curtain close" in command:
        appliance_state["curtain"] = False
    return appliance_state

@socketio.on("audio_data")
def handle_audio_data(data):
    try:
        audio_data = data.get("audio_data")
        if not audio_data:
            emit("error", {"message": "No audio data received"})
            return

        # Decode and save audio
        binary_audio = base64.b64decode(audio_data)
        temp_file_path = f"/tmp/audio_{uuid.uuid4()}.wav"
        with open(temp_file_path, "wb") as f:
            f.write(binary_audio)

        # Send to Sarvam API
        with open(temp_file_path, 'rb') as f:
            response = requests.post(
                SARVAM_API_URL,
                files={'file': ('audio.wav', f, 'audio/wav')},
                data={'model': 'saaras:v2', 'with_diarization': 'false'},
                headers={"api-subscription-key": SARVAM_API_KEY}
            )

        os.remove(temp_file_path)
        if response.status_code == 200:
            result = response.json()
            transcript = result.get("transcript", "No command detected")
            updated_state = control_appliance(transcript.lower())
            emit("transcription", {"text": transcript, "state": updated_state})
        else:
            emit("error", {"message": "API error: " + response.text})
    except Exception as e:
        emit("error", {"message": f"Server error: {str(e)}"})

if __name__ == "__main__":
    socketio.run(app, host="0.0.0.0", port=5001, debug=True)
