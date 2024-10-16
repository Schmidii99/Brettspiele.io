const { FRONTEND_SERVER, SERVER_PORT } = require('./config');

const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const cors = require('cors');
// redis
const redis = require('redis');

main();

async function main() {
  const redisClient = redis.createClient({
    url: process.env.REDIS_URL ?? "redis://localhost:6379",
  });

  await redisClient.connect();
  app.use(cors());

  const io = new Server(server, {
    cors: {
      origin: FRONTEND_SERVER,
      methods: ["GET", "POST"],
      transports: ['websocket'],
      credentials: true
    },
    allowEIO3: true
  });

  io.on('connection', async (socket) => {
    console.log('a user connected - checking headers...');

    if (socket.handshake.headers['x-session'] == null) {
      // close socket if session header is not set
      socket.disconnect();
      console.log('Session header invalid! Client disconnected!');
      return;
    } else {
      // validate session
      const sessionKey = socket.handshake.headers['x-session'];
      if (sessionKey.length !== 36 || sessionKey.split("-").length !== 5) {
        socket.disconnect();
        console.log('Session header invalid! Client disconnected!');
        return;
      }
    }
    console.log('Session valid');

    // register events
    socket.on("gameInfo", processGameInfo);
  });

  // start express
  server.listen(SERVER_PORT, () => {
    console.log('Server listening on port ' + SERVER_PORT);
  });
}

async function processGameInfo(info) {
  if (info.gameType == null || info.gameId == null)
    return;


}
