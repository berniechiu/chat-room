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
app.get('/main.css', (req, res) => {
  res.sendFile(`${__dirname}/css/main.css`);
});


io.sockets.on('connection', (socket) => {
  connections.push(socket);
  console.log(`Connected: ${connections.length} sockets connected`);

  // Disconnect
  socket.on('disconnect', (data) => {
    if (socket.username) {
      users.splice(connections.indexOf(socket.username), 1);
      updateUsernames();
    }
    connections.splice(connections.indexOf(socket), 1);
    console.log(`Disconnected: ${connections.length} sockets connected`);
  });

  // Send Messages
  socket.on('send message', (data) => {
    io.sockets.emit('new message', { msg: data });
  });

  // New User
  socket.on('new user', (data, showMessageDialog) => {
    if (!data) {
      showMessageDialog(false);
      return;
    }
    showMessageDialog(true);
    socket.username = data;
    users.push(socket.username);
    updateUsernames();
  });

  // Update Current Connected Users
  function updateUsernames() {
    io.sockets.emit('get users', { users: users });
  }
});
