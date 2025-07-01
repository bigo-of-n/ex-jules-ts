"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            }
            catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator["throw"](value));
            }
            catch (e) {
                reject(e);
            }
        }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Get references to the HTML elements
const localVideo = document.getElementById("localVideo");
const startButton = document.getElementById("startButton");
const stopButton = document.getElementById("stopButton");
const statusDiv = document.getElementById("status");
const cameraInfo = document.getElementById("cameraInfo");
const cameraSelect = document.getElementById("cameraSelect");
const cameraSelectContainer = document.getElementById("cameraSelectContainer");
let localStream; // Variable to hold the current local media stream
let mediaRecorder;
let webSocket;
// Array to store detected video input devices
let availableVideoDevices = [];
// Assumes WebSocket server is on the same host. You might need to adjust this.
// For example, if your server is on 'localhost:8080', you might use `ws://localhost:8080`.
const wsUrl = `wss://${window.location.host}`;
/**
 * Stops the current camera stream and any active broadcasting.
 */
function stopStreamAndBroadcasting() {
    // Stop MediaRecorder if active
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
        mediaRecorder.stop();
    }
    // Close WebSocket connection if open
    if (webSocket && webSocket.readyState === WebSocket.OPEN) {
        webSocket.close();
    }
    // Stop all tracks in the local stream
    if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
        localStream = null; // Clear the stream reference
    }
    // Reset video element
    localVideo.srcObject = null;
    // Update UI
    startButton.disabled = false;
    stopButton.disabled = true;
    statusDiv.textContent = "Stopped. Not connected.";
    // Show camera select and info if applicable after stopping stream
    enumerateCameras(); // Re-enumerate to ensure proper UI state
}
/**
 * Starts the camera stream with the specified device ID and then attempts to start broadcasting.
 * @param {string} deviceId - The deviceId of the camera to use.
 */
function startCameraAndBroadcast(deviceId) {
    return __awaiter(this, void 0, void 0, function* () {
        stopStreamAndBroadcasting(); // Ensure any existing stream/broadcast is stopped first
        statusDiv.textContent = "Requesting camera access...";
        try {
            // Request access to the user's camera and microphone with specific deviceId
            const constraints = {
                video: deviceId ? { deviceId: { exact: deviceId } } : true,
                audio: true,
            };
            localStream = yield navigator.mediaDevices.getUserMedia(constraints);
            localVideo.srcObject = localStream;
            startButton.disabled = true;
            stopButton.disabled = false;
            statusDiv.textContent = "Previewing local camera. Connecting to server...";
            // Connect to WebSocket
            webSocket = new WebSocket(wsUrl);
            webSocket.onopen = () => {
                statusDiv.textContent = "Connected to server. Starting stream...";
                mediaRecorder = new MediaRecorder(localStream, {
                    mimeType: "video/webm; codecs=vp8", // Adjust mimeType if needed, e.g., 'video/webm; codecs=h264'
                });
                mediaRecorder.ondataavailable = (event) => {
                    if (event.data &&
                        event.data.size > 0 &&
                        webSocket.readyState === WebSocket.OPEN) {
                        webSocket.send(event.data);
                    }
                };
                mediaRecorder.onstart = () => {
                    statusDiv.textContent = "Broadcasting...";
                };
                mediaRecorder.onstop = () => {
                    statusDiv.textContent =
                        "Stopped broadcasting. Previewing local camera.";
                };
                mediaRecorder.onerror = (event) => {
                    console.error("MediaRecorder error:", event.error);
                    statusDiv.textContent = `MediaRecorder Error: ${event.error.name}`;
                    stopStreamAndBroadcasting(); // Attempt to clean up
                };
                // Start recording and sending data in chunks
                mediaRecorder.start(1000); // Send data every 1000ms (1 second)
            };
            webSocket.onclose = () => {
                statusDiv.textContent = "Disconnected from server.";
                stopStreamAndBroadcasting(); // Clean up on disconnection
            };
            webSocket.onerror = (error) => {
                console.error("WebSocket Error:", error);
                statusDiv.textContent = "WebSocket error. See console for details.";
                stopStreamAndBroadcasting(); // Clean up on error
            };
        }
        catch (error) {
            console.error("Error accessing media devices or starting broadcast:", error);
            statusDiv.textContent = `Error: ${error.name}. Make sure you have a camera and microphone and have granted permission.`;
            startButton.disabled = false;
            stopButton.disabled = true;
            // Re-enable camera select if there was an error after an attempt to start
            if (availableVideoDevices.length > 1) {
                cameraSelectContainer.classList.remove("hidden");
            }
        }
    });
}
/**
 * Detects and displays the number of available cameras, and populates the select dropdown.
 * This also attempts a temporary stream to get device labels.
 */
function enumerateCameras() {
    return __awaiter(this, void 0, void 0, function* () {
        // Clear previous options from the select dropdown
        cameraSelect.innerHTML = "";
        availableVideoDevices = []; // Reset the array of devices
        if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
            statusDiv.textContent = "Your browser does not support camera enumeration.";
            startButton.disabled = true;
            startButton.classList.add("opacity-50", "cursor-not-allowed");
            cameraInfo.textContent = "Camera enumeration not supported.";
            cameraSelectContainer.classList.add("hidden");
            return;
        }
        try {
            // Attempt a temporary stream to get labels for devices without prior permission
            let tempStream = null;
            try {
                tempStream = yield navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: false,
                });
            }
            catch (e) {
                console.warn("Could not get temporary stream for device labels. Labels might be empty until permission is granted.", e);
            }
            const devices = yield navigator.mediaDevices.enumerateDevices();
            const videoDevices = devices.filter((device) => device.kind === "videoinput");
            availableVideoDevices = videoDevices; // Store the detected devices
            const numberOfCameras = availableVideoDevices.length;
            if (numberOfCameras > 0) {
                cameraInfo.textContent = `Found ${numberOfCameras} camera(s).`;
                startButton.disabled = false;
                startButton.classList.remove("opacity-50", "cursor-not-allowed");
                availableVideoDevices.forEach((device, index) => {
                    const option = document.createElement("option");
                    option.value = device.deviceId;
                    // Use device.label if available, otherwise a generic name
                    option.textContent = device.label || `Camera ${index + 1}`;
                    cameraSelect.appendChild(option);
                });
                if (numberOfCameras > 1) {
                    cameraSelectContainer.classList.remove("hidden"); // Show the select dropdown
                }
                else {
                    cameraSelectContainer.classList.add("hidden"); // Hide if only one camera
                }
            }
            else {
                cameraInfo.textContent = "No cameras found on this device.";
                startButton.disabled = true;
                startButton.classList.add("opacity-50", "cursor-not-allowed");
                cameraSelectContainer.classList.add("hidden"); // Hide select if no cameras
            }
            // Stop the temporary stream if it was created
            if (tempStream) {
                tempStream.getTracks().forEach((track) => track.stop());
            }
        }
        catch (error) {
            console.error("Error enumerating devices:", error);
            cameraInfo.textContent = "Could not detect cameras.";
            statusDiv.textContent =
                "Error detecting cameras. Please check permissions.";
            startButton.disabled = true;
            startButton.classList.add("opacity-50", "cursor-not-allowed");
            cameraSelectContainer.classList.add("hidden"); // Hide select on error
        }
    });
}
// Event Listeners
startButton.addEventListener("click", () => {
    const selectedDeviceId = cameraSelect.value;
    startCameraAndBroadcast(selectedDeviceId);
});
stopButton.addEventListener("click", () => {
    stopStreamAndBroadcasting();
});
cameraSelect.addEventListener("change", () => {
    // When a new camera is selected, if a stream is active, stop it and restart with the new camera.
    // Otherwise, just update the UI
    if (localStream) {
        // If a stream is already active (e.g., just previewing)
        startCameraAndBroadcast(cameraSelect.value);
    }
});
// Initial setup on window load
window.addEventListener("load", () => {
    enumerateCameras(); // Populate camera dropdown
    stopButton.disabled = true; // Ensure stop button is disabled initially
});
// Re-enumerate cameras if device list changes (e.g., camera plugged in/out)
navigator.mediaDevices.ondevicechange = enumerateCameras;
// Ensure cleanup on page unload
window.addEventListener("beforeunload", () => {
    stopStreamAndBroadcasting();
});
