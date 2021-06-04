const http = require('http');
const express = require('express');
const path = require('path');
const socketio = require('socket.io');
const mysql = require('mysql');

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const conn_port = process.env.PORT || 3100;

const conn = mysql.createConnection({
    host    : 'localhost',
    user    : 'root',
    password: '',
    database: 'smoedoe_drawing'
});

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Run when a client connects
io.on('connection', socket => {
    console.log("New Connection");

    socket.on('startPath', (coords, color) => {
        socket.broadcast.emit('startPath', coords, color);
    });

    socket.on('continuePath', (coords) => {
        socket.broadcast.emit('continuePath', coords);
    });

    socket.on('endPath', (coords) => {
        socket.broadcast.emit('endPath', coords);
    })

    socket.on('toolbox', (tool) => {
        socket.broadcast.emit('toolbox', tool);
    })
});

server.listen(conn_port, () => console.log(`Server running on port ${conn_port}`));

//MySQL test
conn.connect((err) => {
    if(err) {
        throw err;
    }
    console.log('MySQL connected');
})

app.get('/sql', (req, res) => {
    conn.query('SELECT * FROM lobby', (err, result) => {
        res.send(result);
    });
});