const http = require('http');
const express = require('express');
const path = require('path');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const conn_port = process.env.PORT || 3100;

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Run when a client connects
io.on('connection', socket => {
    console.log("New Connection");

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

server.listen(conn_port, () => console.log(`Server running on port ${conn_port}`));