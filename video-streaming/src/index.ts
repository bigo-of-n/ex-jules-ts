import express from 'express';
import http from 'http';
import path from 'path';
import WebSocket from 'ws';
import fs from 'fs-extra';

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const PORT = process.env.PORT || 3000;
const STREAMS_DIR = path.join(__dirname, '../../streams'); // Adjusted path

// Ensure streams directory exists
fs.ensureDirSync(STREAMS_DIR);

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, '../public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

wss.on('connection', (ws) => {
  console.log('Client connected');
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filePath = path.join(STREAMS_DIR, `stream-${timestamp}.webm`);
  const fileStream = fs.createWriteStream(filePath);

  ws.on('message', (message) => {
    // Assuming the message is a Buffer or can be converted to one
    if (Buffer.isBuffer(message)) {
      fileStream.write(message);
    } else if (typeof message === 'string') {
      // If for some reason string data is sent, try to buffer it
      // This is less ideal for binary video data
      fileStream.write(Buffer.from(message));
    } else {
        console.log('Received non-buffer/non-string message:', message);
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
    fileStream.end();
    console.log(`Stream saved to ${filePath}`);
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
    fileStream.end();
    // Optionally, delete the partial file on error
    fs.unlink(filePath, (err) => {
        if (err) console.error(`Error deleting partial file ${filePath}:`, err);
    });
  });

  ws.send('Connected to WebSocket server');
});

server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
  console.log(`WebSocket server started on ws://localhost:${PORT}`);
  console.log(`Streams will be saved in: ${STREAMS_DIR}`);
});

export default server; // Export for potential testing or extension
