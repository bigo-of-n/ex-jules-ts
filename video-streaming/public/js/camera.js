"use strict";
function cameraList() {
    navigator.mediaDevices
        .enumerateDevices()
        .then((devices) => {
        const cameras = devices.filter((device) => device.kind === "videoinput");
        console.log("Available cameras:", cameras);
    })
        .catch((error) => {
        console.error("Error enumerating devices:", error);
    });
}
cameraList();
