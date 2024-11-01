// /server/server.ts

import express from 'express';
import { WebSocketServer } from 'ws';
import chokidar from 'chokidar';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = 3001;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const TEXT_FILE_PATH = path.join(__dirname, 'data.txt');

// Start HTTP server
const server = app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

// WebSocket server for real-time updates
const wss = new WebSocketServer({ server });

// Function to read the file content and format it
const readFileContent = () => {
    const content = fs.readFileSync(TEXT_FILE_PATH, 'utf-8');
    const messages = content.trim().split('\n').map(line => {
        const [role, message] = line.split(': ', 2);
        return { role, message };
    });
    return messages;
};

// Broadcast updates to all connected clients
const broadcast = (data) => {
    wss.clients.forEach(client => {
        if (client.readyState === client.OPEN) {
            client.send(JSON.stringify(data));
        }
    });
};

// Watch the file for changes and send updates
chokidar.watch(TEXT_FILE_PATH).on('change', () => {
    const messages = readFileContent();
    broadcast(messages);
});

// Serve initial content upon WebSocket connection
wss.on('connection', ws => {
    const messages = readFileContent();
    ws.send(JSON.stringify(messages));
});