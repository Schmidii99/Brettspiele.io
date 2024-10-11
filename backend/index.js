const { FRONTEND_SERVER } = require('./config');

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
  console.log('a user connected - sending message...');
  // handle messages from frontend
  socket.on("message", (message) => {
    console.log("Recieved message: " + message);
  });
  // send message to frontend
  socket.emit('message', 'Welcome from the backend!');
});

server.listen(3000, () => {
  console.log('Server listening on port 3000');
});