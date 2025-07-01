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
const cameraButton = document.getElementById("cameraButton");
const cameraFeed = document.getElementById("cameraFeed");
const messageDisplay = document.getElementById("message");
const cameraInfo = document.getElementById("cameraInfo");
const cameraSelect = document.getElementById("cameraSelect"); // Reference to the new select element
const cameraSelectContainer = document.getElementById("cameraSelectContainer"); // Reference to the select element's container
let currentStream; // Variable to hold the current media stream
let availableVideoDevices = []; // Array to store detected video input devices
/**
 * Stops the current camera stream, if any.
 */
function stopStream() {
    if (currentStream) {
        currentStream.getTracks().forEach((track) => {
            track.stop(); // Stop each track in the stream
        });
        currentStream = null; // Clear the stream reference
    }
}
/**
 * Starts the camera stream with the specified device ID.
 * @param {string} deviceId - The deviceId of the camera to use.
 */
function startCamera(deviceId) {
    return __awaiter(this, void 0, void 0, function* () {
        stopStream(); // Stop any existing stream before starting a new one
        // Clear any previous messages
        messageDisplay.textContent = "";
        messageDisplay.classList.add("hidden");
        try {
            // Request access to the user's camera with specific deviceId if provided
            const constraints = {
                video: deviceId ? { deviceId: { exact: deviceId } } : true,
            };
            const stream = yield navigator.mediaDevices.getUserMedia(constraints);
            currentStream = stream; // Store the current stream
            cameraFeed.srcObject = stream;
            yield cameraFeed.play();
            // Show the video element
            cameraFeed.classList.remove("hidden");
            // Hide the button and camera selection if camera is active
            cameraButton.classList.add("hidden");
            cameraSelectContainer.classList.add("hidden");
            cameraInfo.classList.add("hidden");
        }
        catch (error) {
            console.error("Error accessing camera:", error);
            // Display an informative message to the user
            messageDisplay.classList.remove("hidden");
            if (error.name === "NotAllowedError") {
                messageDisplay.textContent =
                    "Camera access denied. Please allow camera access in your browser settings.";
            }
            else if (error.name === "NotFoundError") {
                messageDisplay.textContent =
                    "No camera found on this device or selected camera not available.";
            }
            else if (error.name === "OverconstrainedError") {
                messageDisplay.textContent = `Error: ${error.message}. The selected camera could not be used with current constraints.`;
            }
            else {
                messageDisplay.textContent = `Error: ${error.message}. Could not access camera.`;
            }
            // Ensure the video feed remains hidden if there's an error
            cameraFeed.classList.add("hidden");
            cameraButton.classList.remove("hidden"); // Show button again to allow retry
            if (availableVideoDevices.length > 1) {
                cameraSelectContainer.classList.remove("hidden"); // Show select if multiple cameras exist
            }
        }
    });
}
/**
 * Handles the click event for the camera button.
 * It will start the camera using the currently selected device or the first one found.
 */
cameraButton.addEventListener("click", () => {
    const selectedDeviceId = cameraSelect.value;
    startCamera(selectedDeviceId);
});
/**
 * Handles the change event for the camera select dropdown.
 * Switches the camera feed to the newly selected camera.
 */
cameraSelect.addEventListener("change", () => {
    const selectedDeviceId = cameraSelect.value;
    startCamera(selectedDeviceId);
});
/**
 * Detects and displays the number of available cameras, and populates the select dropdown.
 */
function enumerateCameras() {
    return __awaiter(this, void 0, void 0, function* () {
        // Clear previous options from the select dropdown
        cameraSelect.innerHTML = "";
        availableVideoDevices = []; // Reset the array of devices
        // Check if mediaDevices API is supported
        if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
            messageDisplay.classList.remove("hidden");
            messageDisplay.textContent =
                "Your browser does not support camera enumeration.";
            cameraButton.disabled = true;
            cameraButton.classList.add("opacity-50", "cursor-not-allowed");
            cameraInfo.textContent = "Camera enumeration not supported.";
            cameraSelectContainer.classList.add("hidden"); // Hide select if not supported
            return;
        }
        try {
            // A temporary stream might be needed to get labels for devices without prior permission
            // Requesting a basic video stream can trigger the permission prompt.
            // If permission is already granted, enumerateDevices will return labels.
            // We'll try to get a temporary stream and immediately stop it to ensure labels are available.
            let tempStream = null;
            try {
                tempStream = yield navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: false,
                });
            }
            catch (e) {
                // Permission might be denied or no camera, continue to enumerate devices anyway.
                console.warn("Could not get temporary stream for device labels. Labels might be empty until permission is granted.", e);
            }
            const devices = yield navigator.mediaDevices.enumerateDevices();
            const videoDevices = devices.filter((device) => device.kind === "videoinput");
            availableVideoDevices = videoDevices; // Store the detected devices
            const numberOfCameras = availableVideoDevices.length;
            if (numberOfCameras > 0) {
                cameraInfo.textContent = `Found ${numberOfCameras} camera(s).`;
                cameraButton.disabled = false;
                cameraButton.classList.remove("opacity-50", "cursor-not-allowed");
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
                cameraButton.disabled = true;
                cameraButton.classList.add("opacity-50", "cursor-not-allowed");
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
            messageDisplay.classList.remove("hidden");
            messageDisplay.textContent =
                "Error detecting cameras. Please check permissions.";
            cameraButton.disabled = true;
            cameraButton.classList.add("opacity-50", "cursor-not-allowed");
            cameraSelectContainer.classList.add("hidden"); // Hide select on error
        }
    });
}
// Call enumerateCameras when the window loads
window.addEventListener("load", enumerateCameras);
// Re-enumerate cameras if device list changes (e.g., camera plugged in/out)
// This is important because enumerateDevices() might return empty labels until permission is granted.
// After the first getUserMedia call, labels might become available, triggering ondevicechange.
navigator.mediaDevices.ondevicechange = enumerateCameras;
