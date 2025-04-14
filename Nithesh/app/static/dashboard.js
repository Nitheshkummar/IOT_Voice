
        const state = {
            isListening: true,
            gestureMode: false,
            appliances: {
                fan: false,
                light: true,
                AC: false
            },
            environmental: {
                temperature: 23.5,
                humidity: 41
            }
        };

        // DOM elements
        const voiceControlBtn = document.getElementById('voiceControlBtn');
        const gestureControlBtn = document.getElementById('gestureControlBtn');
        const temperatureValue = document.getElementById('temperatureValue');
        const humidityValue = document.getElementById('humidityValue');
        const fanIcon = document.getElementById('fanIcon');
        const lightIcon = document.getElementById('lightIcon');
        const ACIcon = document.getElementById('ACIcon');
        const fanBtn = document.getElementById('fanBtn');
        const lightBtn = document.getElementById('lightBtn');
        const ACBtn = document.getElementById('ACBtn');
        const statusMessage = document.getElementById('statusMessage');
        const logoutBtn = document.getElementById('logoutBtn');

        // Update the UI based on state
        function updateUI() {
            // Voice control
            if (state.isListening) {
                voiceControlBtn.classList.add('voice-control');
                voiceControlBtn.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon mic-icon"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><path d="M12 19v3"></path></svg>
                    Voice Control
                `;
            } else {
                voiceControlBtn.classList.remove('voice-control');
                voiceControlBtn.classList.add('gesture-control');
                voiceControlBtn.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon mic-off-icon"><path d="M15 9.34V5a3 3 0 0 0-5.94-.6"></path><path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"></path><path d="M12 19v3"></path><path d="M8 23h8"></path><path d="M3 3l18 18"></path></svg>
                    Voice Control
                `;
            }

            // Gesture control
            if (state.gestureMode) {
                gestureControlBtn.classList.add('voice-control');
            } else {
                gestureControlBtn.classList.remove('voice-control');
            }

            // Environmental data
            temperatureValue.textContent = `${state.environmental.temperature}°C`;
            humidityValue.textContent = `${state.environmental.humidity}%`;

            // Fan
            if (state.appliances.fan) {
                fanIcon.classList.add('icon-active', 'spin');
                fanBtn.classList.add('on');
                fanBtn.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon power-icon"><path d="M12 12h0"></path><path d="M18.36 6.64A9 9 0 0 1 20.77 15"></path><path d="M6.16 6.16a9 9 0 1 0 12.68 12.68"></path><path d="M12 2v4"></path></svg>
                    On
                `;
            } else {
                fanIcon.classList.remove('icon-active', 'spin');
                fanBtn.classList.remove('on');
                fanBtn.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon power-icon"><path d="M12 12h0"></path><path d="M18.36 6.64A9 9 0 0 1 20.77 15"></path><path d="M6.16 6.16a9 9 0 1 0 12.68 12.68"></path><path d="M12 2v4"></path></svg>
                    Off
                `;
            }

            // Light
            if (state.appliances.light) {
                lightIcon.classList.add('icon-active');
                lightBtn.classList.add('on');
                lightBtn.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon power-icon"><path d="M12 12h0"></path><path d="M18.36 6.64A9 9 0 0 1 20.77 15"></path><path d="M6.16 6.16a9 9 0 1 0 12.68 12.68"></path><path d="M12 2v4"></path></svg>
                    On
                `;
            } else {
                lightIcon.classList.remove('icon-active');
                lightBtn.classList.remove('on');
                lightBtn.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon power-icon"><path d="M12 12h0"></path><path d="M18.36 6.64A9 9 0 0 1 20.77 15"></path><path d="M6.16 6.16a9 9 0 1 0 12.68 12.68"></path><path d="M12 2v4"></path></svg>
                    Off
                `;
            }

            // AC
            if (state.appliances.AC) {
                ACIcon.classList.add('icon-active');
                ACBtn.classList.add('on');
                ACBtn.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon power-icon"><path d="M12 12h0"></path><path d="M18.36 6.64A9 9 0 0 1 20.77 15"></path><path d="M6.16 6.16a9 9 0 1 0 12.68 12.68"></path><path d="M12 2v4"></path></svg>
                    Open
                `;
            } else {
                ACIcon.classList.remove('icon-active');
                ACBtn.classList.remove('on');
                ACBtn.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon power-icon"><path d="M12 12h0"></path><path d="M18.36 6.64A9 9 0 0 1 20.77 15"></path><path d="M6.16 6.16a9 9 0 1 0 12.68 12.68"></path><path d="M12 2v4"></path></svg>
                    Closed
                `;
            }

            // Status message
            if (state.isListening) {
                statusMessage.textContent = 'Listening for voice commands...';
            } else if (state.gestureMode) {
                statusMessage.textContent = 'Gesture detection active...';
            } else {
                statusMessage.textContent = 'Use voice or gesture controls to manage your smart home';
            }
        }

        // Simulate environmental data changes
        function simulateEnvironmentalChanges() {
            setInterval(() => {
                state.environmental.temperature = +(state.environmental.temperature + (Math.random() - 0.5) / 10).toFixed(1);
                state.environmental.humidity = Math.min(100, Math.max(0, Math.floor(state.environmental.humidity + (Math.random() - 0.5) * 2)));
                updateUI();
            }, 3000);
        }

        function startListening() {
            const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
            recognition.lang = "en-US";
            recognition.start();
    
            recognition.onresult = function(event) {
                let transcript = event.results[0][0].transcript;
                document.getElementById("speechResult").innerText = transcript;
    
                // Send the transcription back to the dashboard
                window.opener.postMessage(transcript, "http://127.0.0.1:5001");
    
                // Auto-close after speech is processed
                setTimeout(() => {
                    window.close();
                }, 2000);
            };
    
            recognition.onerror = function(event) {
                alert("Error occurred in recognition: " + event.error);
            };
        }

        function fetchSensorData() {
            fetch("http://127.0.0.1:5001/sensor")
            .then(response => response.json())
            .then(data => {
                if (!data.error) {
                    document.getElementById("temp-value").innerText = data.temperature + "°C";
                    document.getElementById("humidity-value").innerText = data.humidity + "%";
                } else {
                    console.log("Sensor error:", data.error);
                }
            })
            .catch(err => console.error("Sensor fetch error:", err));
        }

        // Auto-update every 2 seconds
        setInterval(fetchSensorData, 2000);
        fetchSensorData(); // Initial call


        function getLastCommand() {
            fetch('/last_command')
                .then(response => response.json())
                .then(data => {
                    document.getElementById('last-command').innerText = data.last_command || "No command received yet.";
                })
                .catch(error => {
                    console.error("Error fetching last command:", error);
                    document.getElementById('last-command').innerText = "Error fetching command.";
                });
        }
        
        // On page load
        window.onload = function () {
            getLastCommand();
            setInterval(getLastCommand, 5000); // optional live refresh
        }; 

        
        // Event listeners
        voiceControlBtn.addEventListener('click', () => {
            state.isListening = !state.isListening;
            updateUI();
        });

        gestureControlBtn.addEventListener('click', () => {
            state.gestureMode = !state.gestureMode;
            updateUI();
        });

        fanBtn.addEventListener('click', () => {
            state.appliances.fan = !state.appliances.fan;
            updateUI();
        });

        lightBtn.addEventListener('click', () => {
            state.appliances.light = !state.appliances.light;
            updateUI();
        });

        ACBtn.addEventListener('click', () => {
            state.appliances.AC = !state.appliances.AC;
            updateUI();
        });

        logoutBtn.addEventListener('click', () => {
            // In a real app, this would redirect to login page or call logout API
            alert('Logging out...');
        });

        // Initialize
        updateUI();
        simulateEnvironmentalChanges();



        window.addEventListener("message", (event) => {
            // Validate origin if necessary (optional security)
            // if (event.origin !== "http://127.0.0.1:5001") return;
        
            const command = event.data.toLowerCase();
        
            // Example commands handling
            if (command.includes("light on" || command.includes("turn on the light"))) {
                state.appliances.light = true;
            } else if (command.includes("light off") || command.includes("turn off the light")) {
                state.appliances.light = false;
            }
        
            if (command.includes("fan on" || command.includes("turn on the fan"))) {
                state.appliances.fan = true;
            } else if (command.includes("fan off") || command.includes("turn off the fan")) {
                state.appliances.fan = false;
            }
        
            if (command.includes("ac on") || command.includes("turn on the ac")) {
                state.appliances.AC = true;
            } else if (command.includes("ac off") || command.includes("turn off the ac")) {
                state.appliances.AC = false;
            }
        
            updateUI();
        });
        
        // Add this to your dashboard.js file

// Create floating particles
function createParticles() {
    const body = document.body;
    const colors = ['#8a2be2', '#646cff', '#42b883', '#af4bce'];
    
    for (let i = 0; i < 15; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random positioning
        const left = Math.random() * 100;
        const top = Math.random() * 100;
        
        // Random size (5-15px)
        const size = Math.random() * 10 + 5;
        
        // Random color
        const colorIndex = Math.floor(Math.random() * colors.length);
        
        // Random animation delay
        const delay = Math.random() * 5;
        
        // Apply styles
        particle.style.cssText = `
            position: absolute;
            border-radius: 50%;
            opacity: 0.2;
            animation: float 8s infinite ease-in-out;
            left: ${left}%;
            top: ${top}%;
            width: ${size}px;
            height: ${size}px;
            background-color: ${colors[colorIndex]};
            animation-delay: ${delay}s;
            pointer-events: none;
            z-index: -1;
        `;
        
        document.body.appendChild(particle);
    }
}

// Execute when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    createParticles();
    
    // Add random position updates for the radial gradients
    setInterval(() => {
        document.body.style.setProperty('--x', Math.random() * 100 + '%');
        document.body.style.setProperty('--y', Math.random() * 100 + '%');
        document.body.style.setProperty('--x2', Math.random() * 100 + '%');
        document.body.style.setProperty('--y2', Math.random() * 100 + '%');
    }, 3000);
});