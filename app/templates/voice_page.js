let socket = io();
let mediaRecorder;
let audioContext;
let audioStream;
let audioChunks = [];
let analyser;
let animationId;
let visualizerBars = [];

// Create particles
function createParticles() {
    const particles = document.getElementById('particles');
    const colors = ['#8a2be2', '#646cff', '#42b883', '#af4bce'];

    for (let i = 0; i < 15; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';

        const left = Math.random() * 100;
        const top = Math.random() * 100;
        const size = Math.random() * 10 + 5;
        const colorIndex = Math.floor(Math.random() * colors.length);
        const delay = Math.random() * 5;

        particle.style.left = `${left}%`;
        particle.style.top = `${top}%`;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.backgroundColor = colors[colorIndex];
        particle.style.animationDelay = `${delay}s`;

        particles.appendChild(particle);
    }
}

document.addEventListener('DOMContentLoaded', createParticles);

// Create visualizer bars
const visualizer = document.getElementById('visualizer');
for (let i = 0; i < 30; i++) {
    const bar = document.createElement('div');
    bar.className = 'bar';
    visualizer.appendChild(bar);
    visualizerBars.push(bar);
}

function updateVisualizer() {
    if (!analyser) return;

    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(dataArray);
    const step = Math.floor(dataArray.length / visualizerBars.length);

    for (let i = 0; i < visualizerBars.length; i++) {
        const value = dataArray[i * step];
        const height = Math.max(3, value / 2);
        visualizerBars[i].style.height = height + 'px';
    }

    animationId = requestAnimationFrame(updateVisualizer);
}

// Start Recording
document.getElementById("startRecord").onclick = function () {
    const status = document.getElementById("status");
    const output = document.getElementById("output");

    status.innerText = "Connecting to microphone...";
    output.innerText = "Transcribed text will appear here...";

    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
        status.innerText = "Recording... Speak now";
        status.className = "status-recording";

        audioStream = stream;
        audioContext = new AudioContext();
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;

        const source = audioContext.createMediaStreamSource(stream);
        source.connect(analyser);

        const processor = audioContext.createScriptProcessor(4096, 1, 1);
        source.connect(processor);
        processor.connect(audioContext.destination);

        audioChunks = [];

        processor.onaudioprocess = function(e) {
            const channelData = e.inputBuffer.getChannelData(0);
            const channelDataCopy = new Float32Array(channelData.length);
            channelDataCopy.set(channelData);
            audioChunks.push(channelDataCopy);
        };

        updateVisualizer();

        document.getElementById("startRecord").disabled = true;
        document.getElementById("stopRecord").disabled = false;
    }).catch(error => {
        status.innerText = "Error: " + error.message;
        status.className = "status-error";
    });
};

// Stop Recording
document.getElementById("stopRecord").onclick = function () {
    const status = document.getElementById("status");
    status.innerText = "Processing audio...";
    status.className = "status-processing";

    if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }

    visualizerBars.forEach(bar => {
        bar.style.height = '3px';
    });

    if (audioStream) {
        audioStream.getTracks().forEach(track => track.stop());
    }

    if (audioContext) {
        const sampleRate = audioContext.sampleRate;
        let totalLength = 0;
        audioChunks.forEach(chunk => {
            totalLength += chunk.length;
        });

        const mergedAudio = new Float32Array(totalLength);
        let offset = 0;
        audioChunks.forEach(chunk => {
            mergedAudio.set(chunk, offset);
            offset += chunk.length;
        });

        const wavBlob = encodeWAV(mergedAudio, sampleRate);

        const reader = new FileReader();
        reader.readAsDataURL(wavBlob);
        reader.onloadend = function() {
            const base64Audio = reader.result.split(",")[1];
            socket.emit("audio_data", { 
                audio_data: base64Audio,
                mime_type: 'audio/wav'
            });
        };

        analyser = null;
        audioContext.close();
        audioContext = null;
        audioStream = null;
    }

    document.getElementById("startRecord").disabled = false;
    document.getElementById("stopRecord").disabled = true;
};

// Handle transcription result
socket.on("transcription", function (data) {
    const output = document.getElementById("output");
    const status = document.getElementById("status");

    output.innerText = data.text || "No speech detected";
    status.innerText = "Transcription complete";
    status.className = "status-complete";
});

socket.on("error", function (data) {
    const status = document.getElementById("status");
    status.innerText = "Error: " + data.message;
    status.className = "status-error";
});

//return to main page
function openVoiceControl() {
    const voiceWindow = window.open("http://127.0.0.1:5001", "VoiceWindow", "width=1000,height=600,left=250,top=200");
    if (!voiceWindow) {
        alert("Pop-up blocked! Please allow pop-ups for this site.");
    }

    // Function to receive message from pop-up
    window.addEventListener("message", function(event) {
        if (event.origin !== "http://127.0.0.1:5001") return; // Ensure correct origin
        document.getElementById("transcriptionResult").innerText = event.data;
    }, false);
}
