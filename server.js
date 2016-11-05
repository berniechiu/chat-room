const express  = require('express');
const http     = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO.listen(server);

const users = [];
const connections = [];

server.listen(process.env.PORT || 3000);
console.log('Server running...');

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/index.html`);
});

io.sockets.on('connection', (socket) => {
  connections.push(socket);
  console.log(`Connected: ${connections.length} sockets connected`);

  // Disconnect
  connections.splice(connections.indexOf(socket), 1);
  console.log(`Disconnected: ${connections.length} sockets connected`);
});
