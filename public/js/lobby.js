var socket = io();

// ##### -------------------------------------------------------------------------------------------------------------------- ##### //

// Error handling
socket.on('errorHandler', (error) => {
    alert(error);
})

// ##### -------------------------------------------------------------------------------------------------------------------- ##### //

function URLGet() {
    var url = new URL(window.location.href);
    var get = url.searchParams.get("lobby_id");
    return get;
}

//Create lobby
function createLobby() {
    var lobbyID = URLGet('lobby_id');
    var username = $("#username_input_create").val();
    var password = $("#password_input_create").val();

    socket.emit('createLobby', lobbyID, username, password);
}

//Join Lobby
function joinLobby() {
    var lobbyID = URLGet('lobby_id');
    var username = $("#username_input_join").val();
    var password = $("#password_input_join").val();

    socket.emit('joinLobby', lobbyID, username, password);
}

//Lobby test
socket.on('playerJoined', (username) => {
    console.log(username + ' joined your room');
});

socket.on('lobbyCreated', (lobby) => {
    console.log('Lobby ' + lobby + ' has been created');
});


//Create Lobby
