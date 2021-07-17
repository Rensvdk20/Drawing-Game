var socket = io();

// ##### ---------- Error handling ---------- ##### //

// Error handling
socket.on('errorHandler', (error) => {
    alert(error);
})

// ##### ---------- Default ---------- ##### //

if(URLGet('lobby')) {
    $('#page').load('/pages/join_lobby.html');
    // console.log(URLGet('lobby'));
}

//Button pageload
$(document).on('click', '.page_button', function () {
    let page = $(this).data('page');

    if(page != 'index') {
        $('#page').load('/pages/' + page + '.html');
    } else {
        $('#page').load('/' + page + '.html');
    }
});

//Copy invite link
$(document).on('click', 'input#invite_link', function () {
    $("input#invite_link").select();
    document.execCommand("copy");
});

//Start game
$(document).on('click', '#start_game', function () {

});

function URLGet(val) {
    var url = new URL(window.location.href);
    var get = url.searchParams.get(val);
    return get;
}

// ##### ---------- Lobby ---------- ##### //

//Create lobby
function createLobby() {
    var username = $("#username_input_create").val();
    var password = $("#password_input_create").val();

    socket.emit('createLobby', username, password);
}

//Join Lobby
function joinLobbyRequest() {
    var lobbyID = URLGet('lobby');
    var username = $("#username_input_join").val();
    var password = $("#password_input_join").val();

    socket.emit('joinLobbyRequest', lobbyID, username, password);
}

function updateLobby(current_lobby) {
    let players = current_lobby.players;
    $('#lobby_players').html('');
    for(i = 0; i < players.length; i++) {
        $('#lobby_players').append("<li>" + players[i].name + "</li>");
    }

    if(window.location.hostname == "localhost") {
        $("input#invite_link").val(window.location.hostname + ":3100?lobby=" + current_lobby.id);
    } else {
        $("input#invite_link").val(window.location.hostname + "?lobby=" + current_lobby.id);
    }
}

//Get lobby info for new joining player
socket.on('joinLobby', current_lobby => {
    console.log(current_lobby);
    $('#page').load('/pages/lobby.html', function() {
        updateLobby(current_lobby);
    });
});

//Get lobby info when a players joins your lobby
socket.on('playerJoined', (current_lobby, username) => {
    console.log(username + ' joined');
    console.log(current_lobby);
    updateLobby(current_lobby);
});

socket.on('playerLeft', (current_lobby, username) => {
    console.log(username + ' left');
    console.log(current_lobby);
    updateLobby(current_lobby);
});

//Get lobby info when creating a lobby
socket.on('lobbyCreated', (lobbyID, current_lobby) => {
    console.log('Lobby: ' + lobbyID + ' has been created');
    console.log(current_lobby);
    $('#page').load('/pages/lobby.html', function() {
        updateLobby(current_lobby);
    });
    $("#options").append('<button id="start_game">Start</button>');
});