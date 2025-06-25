# Video Streaming PoC

This project is a simple proof-of-concept for streaming video from a user's camera to a Node.js server using WebSockets. The server then saves the streamed video into `.webm` files.

## Prerequisites

- Node.js (v14 or later recommended)
- npm (usually comes with Node.js)
- A webcam/camera connected to your device
- A modern web browser that supports `navigator.mediaDevices.getUserMedia` and WebSockets.

## Setup

1.  **Clone the repository (if applicable) or ensure you are in the `video-streaming` directory.**

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Build the TypeScript code:**
    ```bash
    npm run build
    ```
    (This command will be added to `package.json` in a subsequent step).

## Running the Application

1.  **Start the server:**
    ```bash
    npm start
    ```
    (This command will be added to `package.json` in a subsequent step).

    You should see output indicating the server is running, e.g.:
    ```
    Server is listening on port 3000
    WebSocket server started on ws://localhost:3000
    Streams will be saved in: /path/to/your/project/video-streaming/streams
    ```

2.  **Open your web browser** and navigate to:
    [http://localhost:3000](http://localhost:3000)

3.  **Grant camera permissions** when prompted by the browser.

4.  Click the "**Start Broadcasting**" button.
    -   Your camera feed should appear in the video element.
    -   The status should indicate that it's broadcasting.

5.  Video data will be sent to the server and saved in the `video-streaming/streams/` directory. Each stream will be a new `.webm` file named with a timestamp (e.g., `stream-YYYY-MM-DDTHH-mm-ss-SSSZ.webm`).

6.  Click the "**Stop Broadcasting**" button to end the stream. The file will be finalized on the server.

## Project Structure

-   `src/index.ts`: The main server-side application logic, including the Express server and WebSocket handling.
-   `public/index.html`: The client-side HTML page that captures video and sends it to the server.
-   `dist/`: Compiled JavaScript code (output of `npm run build`).
-   `streams/`: Directory where recorded video streams are saved (created automatically, ignored by git).
-   `tsconfig.json`: TypeScript compiler configuration.
-   `package.json`: Project metadata and dependencies.
-   `.gitignore`: Specifies intentionally untracked files that Git should ignore.

## Notes

-   The video is saved in WebM format (`.webm`) using the VP8 codec, as specified in `public/index.html` (`mimeType: 'video/webm; codecs=vp8'`). You might need to adjust this based on browser compatibility or desired output format.
-   Error handling is basic. For a production system, more robust error management and user feedback would be necessary.
-   This is a minimal example. Features like authentication, multiple concurrent streams with unique identifiers, video playback, etc., are not included.
-   Ensure your browser has permissions to access the camera. If you encounter issues, check your browser's site settings for `localhost`.
