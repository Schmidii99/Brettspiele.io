const { FRONTEND_SERVER, SERVER_PORT } = require('./config');

const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
var cors = require('cors');

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

io.on('connection', (socket) => {
  console.log('a user connected - checking headers...');

  if (socket.handshake.headers['x-session'] == null) {
    // close socket if session header is not set
    socket.disconnect();
    console.log('Session header invalid! Client disconnected!');
  } else {
      // validate session
      const sessionKey = socket.handshake.headers['x-session'];
      if (sessionKey.length != 36 || sessionKey.split("-").length != 5) {
        socket.disconnect();
        console.log('Session header invalid! Client disconnected!');
      }
  }
  console.log('Session valid');

  // send message to frontend
  socket.emit('message', 'Welcome from the backend!');
});

server.listen(SERVER_PORT, () => {
  console.log('Server listening on port ' + SERVER_PORT);
});

function handleMessage(message) {
  if (message.action != null) {
    console.log('action: ' + message.action);
  }
}