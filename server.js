const http = require('http');
const express = require('express');
const path = require('path');
const socketio = require('socket.io');
const { v4: uuid_v4 } = require('uuid');
// const mysql = require('mysql');

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const conn_port = process.env.PORT || 3100;

var lobbys = [];

// var current_player_socket_id = undefined;

// Error logs:
// 901: No lobby's exist in array lobbys
// 902: This lobby is not available
// 903: Name already taken by someone else in the selected lobby
// 904: Incorrect password

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Run when a client connects
io.on('connection', socket => {
    console.log(socket.id + " connected");
    
    // Set current drawing player
    // if(current_player_socket_id == undefined) {
    //     current_player_socket_id = socket.id;
    //     console.log(current_player_socket_id);
    // }

    socket.on('joinLobby', (lobbyID, username, password) => {
        
        var error = "";
        var Player = {
            name: username,
            socket_id: socket.id
        }
        var current_lobby = {};

        //Check if there are any lobbys
        if(lobbys.length == 0) {
            var error = "This lobby is not available (901)";
            io.to(socket.id).emit('errorHandler', error);
            console.log('error 901');
            return;
        }

        try {
            // Find lobby by lobbyID
            var joined_lobby = lobbys.findIndex(x => x.id == lobbyID);
            console.log(joined_lobby);
            // Get all players in current lobby
            var current_lobby = lobbys[joined_lobby];
            var players_in_lobby = lobbys[joined_lobby].players;
        } catch(e) {
            var error = "This lobby is not available (902)";
            io.to(socket.id).emit('errorHandler', error);
            console.log('error 902 ' + e);
            return;
        }

        if(password != current_lobby.password) {
            var error = "Incorrect password (904)";
            io.to(socket.id).emit('errorHandler', error);
            console.log('error 904');
            return;
        }

        // Search for the object with a duplicate name (same name as input)
        if(duplicate_name_object = players_in_lobby.find(x => x.name === username)) {
            var error = "This name is already taken (903)";
            io.to(socket.id).emit('errorHandler', error);
            console.log('error 903');
            return;
        }

        // Push the new player name in the lobby
        lobbys[joined_lobby].players.push(Player);
        console.log(lobbys[joined_lobby].players);
    
        //Join the lobby
        socket.join(lobbyID);
        socket.to(lobbyID).emit('playerJoined', username);

        socket.emit('getLobbyInfo', current_lobby);
        socket.to(lobbyID).emit('getLobbyInfo', current_lobby);
    });

    socket.on('createLobby', (username, password) => {
        var lobbyID = uuid_v4();
        var Player = {
            name: username,
            socket_id: socket.id
        }

        lobbys.push({
            id: lobbyID,
            password: password,
            players: [Player],
        });

        socket.join(lobbyID);
        socket.emit('lobbyCreated: ', lobbyID);
        console.log('lobbyCreated: ', lobbyID);
        console.log(lobbys);
    });

    // Check for the current drawing player
    // if(current_player_socket_id == socket.id) {
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
    // }

    socket.on('disconnect', function() {
        console.log(socket.id + " disconnected");
    });
});



server.listen(conn_port, () => console.log(`Server running on port ${conn_port}`));