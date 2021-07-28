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
var minAmountOfPlayers = 3;

// var current_player_socket_id = undefined;

// Error logs:
// 901: No lobby's exist in array lobbys
// 902: This lobby is not available
// 903: Name already taken by someone else in the selected lobby
// 904: Incorrect password
// 905: Not enough players in lobby to start

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Run when a client connects
io.on('connection', socket => {
    var current_lobby = {};
    var lobbyID = "";
    var lobbyIndex;
    var Player = {};
    var rounds = 3;
    var error = "";


    console.log(socket.id + " connected");
    
    // Set current drawing player
    // if(current_player_socket_id == undefined) {
    //     current_player_socket_id = socket.id;
    //     console.log(current_player_socket_id);
    // }

    socket.on('joinLobbyRequest', (lobby_ID, username, password) => {
        Player = {
            name: username,
            socket_id: socket.id
        }

        lobbyID = lobby_ID;

        //Check if there are any lobbys
        if(lobbys.length == 0) {
            error = "This lobby is not available (901)";
            io.to(socket.id).emit('errorHandler', error);
            console.log('error 901');
            return;
        }

        try {
            // Find lobby by lobbyID
            lobbyIndex = lobbys.findIndex(x => x.id == lobbyID);
            console.log(lobbyIndex);
            // Get all players in current lobby
            current_lobby = lobbys[lobbyIndex];
            var players_in_lobby = lobbys[lobbyIndex].players;
        } catch(e) {
            error = "This lobby is not available (902)";
            io.to(socket.id).emit('errorHandler', error);
            console.log('error 902 ' + e);
            return;
        }

        if(password != current_lobby.password) {
            error = "Incorrect password (904)";
            io.to(socket.id).emit('errorHandler', error);
            console.log('error 904');
            return;
        }

        // Search for the object with a duplicate name (same name as input)
        if(duplicate_name_object = players_in_lobby.find(x => x.name === Player.name)) {
            error = "This name is already taken (903)";
            io.to(socket.id).emit('errorHandler', error);
            console.log('error 903');
            return;
        }

        // Push the new player name in the lobby
        lobbys[lobbyIndex].players.push(Player);
        console.log(lobbys[lobbyIndex].players);
    
        //Join the lobby
        socket.join(lobbyID);
        //Send new lobby info to all users in the lobby
        socket.to(lobbyID).emit('playerJoined', current_lobby, Player.name);

        //Send the lobby info to the current user
        socket.emit('joinLobby', current_lobby);
        getPlayerInLobbyIndex(socket.id);
    });

    socket.on('createLobby', (username, password) => {
        lobbyID = uuid_v4();
        Player = {
            name: username,
            socket_id: socket.id
        }

        current_lobby = {
            id: lobbyID,
            password: password,
            players: [Player],
            current_round: 1
        }

        lobbys.push(current_lobby);
        socket.join(lobbyID);

        lobbyIndex = lobbys.findIndex(x => x.id == current_lobby.id);

        socket.emit('lobbyCreated', current_lobby);
        console.log('lobbyCreated: ', current_lobby.id);
        // console.log(lobbys);
        console.log(current_lobby);
        getPlayerInLobbyIndex(socket.id);
    });

    socket.on('prepareGame', () => {
        let lobbyPlayerCount = current_lobby.players.length;
        //Search lobby by lobby object
        //Get with lobby object all player and check if the player is the first in the list

        //Check if the player is the lobby leader
        if(getPlayerInLobbyIndex(socket.id) === 0) {
            //Check if there are 4 or more players in the lobby
            if(lobbyPlayerCount >= minAmountOfPlayers) {
                console.log('Game started');
                current_lobby['rounds'] = [];
                //Set all rounds in an array
                for(i = 1; i <= rounds; i++) {
                    current_lobby['rounds']['round_' + i] = [];
                    //Put every player with an input in an array
                    for(j = 0; j < lobbyPlayerCount; j++) {
                        current_lobby['rounds']['round_' + i].push({
                            socket_id: current_lobby.players[j].socket_id,
                            input: ""
                        })
                    }
                }
                console.log(current_lobby.rounds);
                startGame();


            } else {
                error = "You need atleast " + minAmountOfPlayers + " players to start (905)";
                io.to(socket.id).emit('errorHandler', error);
                console.log('error 905');
            }
        }
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
        if(current_lobby == null || current_lobby == undefined || Object.getOwnPropertyNames(current_lobby).length === 0) {
            //Not in a lobby
            console.log(socket.id + " is not in a lobby");
        } else {
            //In a lobby
            console.log(socket.id + " is in a lobby");
            let playerIndex = getPlayerIndexBySocketid();
            removePlayerFromLobbyByIndex(playerIndex);
        }
    });

    //Change Rounds
    socket.on('changeRounds', function(roundAmount) {
        rounds = roundAmount;
        console.log(rounds);
    });

    socket.on('submitInput', function(input) {
        //Check here if the lobby is still running
        let playerIndex = getPlayerRoundIndexBySocketid();
        lobbys[lobbyIndex]['rounds']['round_' + current_lobby.current_round][playerIndex]['input'] = input;
        console.log(lobbys[lobbyIndex]['rounds']['round_' + current_lobby.current_round]);
    });

    function getPlayerIndexBySocketid(player_socket_id = socket.id) {
        //Get the array index of the player with socket_id
        let playerIndex = lobbys[lobbyIndex].players.findIndex(x => x.socket_id === player_socket_id);
        return playerIndex;
    }

    function getPlayerRoundIndexBySocketid(player_socket_id = socket.id) {
        //Get the array index of the player with socket_id
        let playerIndex = lobbys[lobbyIndex]['rounds']['round_' + current_lobby.current_round].findIndex(x => x.socket_id === socket.id);
        return playerIndex;
    }

    function removePlayerFromLobbyByIndex(playerIndex) {
        //Remove the player from the lobby by the index
        lobbys[lobbyIndex].players.splice(playerIndex, 1);
        //Update the lobby for the remaining players
        socket.to(lobbyID).emit('playerLeft', current_lobby, Player.name);
    }

    function getPlayerInLobbyIndex(player_socket_id) {
        var playerInLobbyIndex = lobbys[lobbyIndex].players.findIndex(x => x.socket_id === player_socket_id);
        return playerInLobbyIndex;
    }

    //Game functions
    function sendAllToPage(page) {
        io.in(lobbyID).emit('sendAllToPage', page);
    }
});

server.listen(conn_port, () => console.log(`Server running on port ${conn_port}`));