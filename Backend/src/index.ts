import express from 'express';
import fs from 'fs';
import dotenv from 'dotenv';
import { configureRoutes } from './route';
import { createServer } from 'node:https';
import { Server as SocketServer } from 'socket.io';
import { configureSocketServerEvents } from './socket-events';
import cors from 'cors';

dotenv.config();

const expressApp = express();
const serverPort = process.env.SERVER_PORT || 4000;

const options = {
  key: fs.readFileSync(process.env.SERVER_SSL_KEY_PATH!),
  cert: fs.readFileSync(process.env.SERVER_SSL_CERT_PATH!)
};

const server = createServer(options, expressApp);
const socketServer = new SocketServer(server, {
  cors: {
    origin: '*',
  },
});

expressApp.use(express.json());
expressApp.use(cors({
  origin: ['https://localhost:3001'],
}));

configureRoutes(expressApp);
configureSocketServerEvents(socketServer);

server.listen(serverPort, () => {
  console.log(`Server is running at https://localhost:${serverPort}`);
});
