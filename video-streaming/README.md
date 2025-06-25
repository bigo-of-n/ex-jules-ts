# Video Streaming PoC (using pnpm and Tailwind CSS via CDN)

This project is a simple proof-of-concept for streaming video from a user's camera to a Node.js server using WebSockets. The server then saves the streamed video into `.webm` files. The UI is styled with Tailwind CSS, included via a CDN.

## Prerequisites

- Node.js (v14 or later recommended)
- pnpm (Package manager. Install via `npm install -g pnpm` or see official pnpm documentation for other installation methods.)
- A webcam/camera connected to your device
- A modern web browser that supports `navigator.mediaDevices.getUserMedia` and WebSockets.

## Setup

1.  **Clone the repository (if applicable) or ensure you are in the `video-streaming` directory.**

2.  **Install dependencies using pnpm:**
    ```bash
    pnpm install
    ```

3.  **Build the TypeScript code:**
    ```bash
    pnpm run build
    ```

## Running the Application

1.  **Start the server:**
    ```bash
    pnpm start
    ```
    Alternatively, for development with auto-rebuild and restart:
    ```bash
    pnpm run dev
    ```

    You should see output indicating the server is running, e.g.:
    ```
    Server is listening on port 3000
    WebSocket server started on ws://localhost:3000
    Streams will be saved in: /path/to/your/project/video-streaming/streams
    ```

2.  **Open your web browser** and navigate to:
    [http://localhost:3000](http://localhost:3000)

3.  **Grant camera permissions** when prompted by the browser. You should see a camera selector dropdown.

4.  Click the "**Start Broadcasting**" button.
    -   Your camera feed should appear in the video element.
    -   The status should indicate that it's broadcasting.

5.  Video data will be sent to the server and saved in the `video-streaming/streams/` directory. Each stream will be a new `.webm` file named with a timestamp (e.g., `stream-YYYY-MM-DDTHH-mm-ss-SSSZ.webm`).

6.  Click the "**Stop Broadcasting**" button to end the stream. The file will be finalized on the server.

## Project Structure

-   `src/index.ts`: The main server-side application logic, including the Express server and WebSocket handling.
-   `public/index.html`: The client-side HTML page that captures video, allows camera selection, and sends it to the server. Styled with Tailwind CSS via CDN.
-   `dist/`: Compiled JavaScript code (output of `pnpm run build`).
-   `streams/`: Directory where recorded video streams are saved (created automatically, ignored by git).
-   `tsconfig.json`: TypeScript compiler configuration.
-   `package.json`: Project metadata and dependencies (managed with `pnpm`).
-   `.gitignore`: Specifies intentionally untracked files that Git should ignore.

## Notes

-   **Styling**: Tailwind CSS is loaded via CDN. No local build step for CSS is required.
-   The video is saved in WebM format (`.webm`) using VP8/Opus codecs, as specified in `public/index.html`. You might need to adjust this based on browser compatibility or desired output format.
-   Error handling is basic. For a production system, more robust error management and user feedback would be necessary.
-   This is a minimal example. Features like authentication, multiple concurrent streams with unique identifiers, video playback, etc., are not included.
-   Ensure your browser has permissions to access the camera. If you encounter issues, check your browser's site settings for `localhost`.
