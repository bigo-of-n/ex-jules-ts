"use strict";
var __awaiter = (this && this.__awaiter) ||
    function (thisArg, _arguments, P, generator) {
        function adopt(value) {
            return value instanceof P
                ? value
                : new P(function (resolve) {
                    resolve(value);
                });
        }
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
            function step(result) {
                result.done
                    ? resolve(result.value)
                    : adopt(result.value).then(fulfilled, rejected);
            }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
const statusDiv = document.getElementById("status");
const video = document.getElementById("localVideo");
const toggleButton = document.getElementById("toggle");
let facingMode = "environment";
statusDiv.textContent = `Requesting camera access ${facingMode}...`;
const constraints = {
    video: {
        facingMode,
    },
    audio: true,
};
function getCameraAccess() {
    console.log({
        msg: "Requesting camera access",
        facingMode,
    });
    statusDiv.textContent = JSON.stringify({
        msg: "Requesting camera access",
        constraints,
    });
    navigator.mediaDevices
        .getUserMedia(constraints)
        .then((stream) => {
        statusDiv.textContent = `Previewing camera ${facingMode}...`;
        video.srcObject = stream;
    })
        .catch((error) => {
        console.error("Error accessing camera:", error);
        statusDiv.textContent = `Error: ${error.name}. Make sure you have a camera and have granted permission.`;
    });
}
function stopCamera() {
    console.log("Stopping camera...");
    if (video.srcObject) {
        video.srcObject.getTracks().forEach((track) => {
            track.stop();
        });
    }
}
function toggleCamera() {
    stopCamera();
    facingMode = facingMode === "user" ? "environment" : "user";
    constraints.video.facingMode = facingMode;
    getCameraAccess();
}
function broadcast() {
    return __awaiter(this, void 0, void 0, function* () {
        const wsUrl = `wss://${window.location.host}`; // Assumes WebSocket server is on the same host
        const ws = new WebSocket(wsUrl);
        const localStream = yield navigator.mediaDevices.getUserMedia(constraints);
        let mediaRecorder;
        console.log("Connecting to WebSocket server...");
        ws.onopen = () => {
            console.log("WebSocket connection established.");
            // send video data
            mediaRecorder = new MediaRecorder(localStream, {
                mimeType: "video/webm; codecs=vp8", // Adjust mimeType if needed, e.g., 'video/webm; codecs=h264', 'video/x-matroska;codecs=avc1'
            });
            mediaRecorder.ondataavailable = (event) => {
                if (event.data &&
                    event.data.size > 0 &&
                    webSocket.readyState === WebSocket.OPEN) {
                    webSocket.send(event.data);
                }
                else {
                    console.log("No data available");
                    console.log(event);
                }
            };
            mediaRecorder.onstart = () => {
                console.log("Broadcasting...");
            };
            mediaRecorder.start(1000); // Send data every 1000ms (1 second)
            mediaRecorder.onerror = (event) => {
                console.error("MediaRecorder error:", event.error);
                statusDiv.textContent = `MediaRecorder Error: ${event.error.name}`;
                stopStreamAndBroadcasting(); // Attempt to clean up
            };
        };
        ws.onmessage = (event) => {
            console.log("Message received from server:", event.data);
        };
        ws.onclose = () => {
            console.log("WebSocket connection closed.");
        };
        ws.onerror = (error) => {
            console.error("WebSocket error:", error);
        };
    });
}
