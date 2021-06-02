const http = require('http');
const express = require('express');
const path = require('path');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const PORT = 3100 || process.env.PORT;

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Run when a client connects
io.on('connection', socket => {
    console.log("New WS Connection");

    socket.on('startPath', (coords) => {
        socket.broadcast.emit('startPath', coords);
    });

    socket.on('continuePath', (coords) => {
        socket.broadcast.emit('continuePath', coords);
    });

    socket.on('endPath', (coords) => {
        socket.broadcast.emit('endPath', coords);
    })
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));