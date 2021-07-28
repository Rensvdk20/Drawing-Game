var socket = io();
var current_lobby = {};

var defaultRoundSelected = 3;

// ##### ---------- Error handling ---------- ##### //

// Error handling
socket.on('errorHandler', (error) => {
    alert(error);
})

// ##### ---------- Default ---------- ##### //

if(URLGet('lobby')) {
    $('#page').load('/pages/join_lobby.html');
}

// ##### --- Buttons --- ##### //

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
    if(!jQuery.isEmptyObject(current_lobby)) {
        socket.emit('prepareGame');
    }
});

$(document).on('click', '#submit_input', function () {
    if(!jQuery.isEmptyObject(current_lobby)) {
        socket.emit('submitInput', $("#input_1").val());
    }
});

// ##### --- Inputs --- ##### //

//Change rounds
$(document).on('change', '#rounds', function (event) {
    let rounds = this.value;
    socket.emit('changeRounds', rounds);
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

function updateLobby() {
    let players = current_lobby.players;
    console.log(players);
    $('#lobby_players').html('');
    for(i = 0; i < players.length; i++) {
        if(i == 0) {
            $('#lobby_players').append("<li>" + players[i].name + " &#x1F451;</li>");
        } else {
            $('#lobby_players').append("<li>" + players[i].name + "</li>");
        }
    }
}

function getInviteLink() {
    if(window.location.hostname == "localhost") {
        $("input#invite_link").val(window.location.hostname + ":3100?lobby=" + current_lobby.id);
    } else {
        $("input#invite_link").val(window.location.hostname + "?lobby=" + current_lobby.id);
    }
}

//Get lobby info for new joining player
socket.on('joinLobby', received_current_lobby => {
    current_lobby = received_current_lobby;
    console.log(current_lobby);
    $('#page').load('/pages/lobby.html', function() {
        updateLobby();
        getInviteLink();
    });
});

//Get lobby info when a players joins your lobby
socket.on('playerJoined', (received_current_lobby, username) => {
    current_lobby = received_current_lobby;
    console.log(username + ' joined');
    updateLobby();
});

socket.on('playerLeft', (received_current_lobby, username) => {
    current_lobby = received_current_lobby;
    console.log(username + ' left');
    updateLobby();
});

//Get lobby info when creating a lobby
socket.on('lobbyCreated', (received_current_lobby) => {
    current_lobby = received_current_lobby;
    console.log('Lobby: ' + current_lobby.id + ' has been created');
    console.log(current_lobby);
    $('#page').load('/pages/lobby.html', function() {
        updateLobby();
        getInviteLink();

        $("#options").append("<select id='rounds'>");
        for(i = 1; i < 11; i++) {
            if(i === defaultRoundSelected) {
                $("#rounds").append("<option value='" + i + "' selected>" + i + " Rounds</option>");
            } else {
                $("#rounds").append("<option value='" + i + "'>" + i + " Rounds</option>");
            }
        }
        $("#options").append("</select>");
        $("#options").append("<br /><br />");
        $("#options").append('<button id="start_game">Start</button>');
    });
});

//Game
socket.on('sendAllToPage', (page) => {
    console.log('Send to ' + page);
    $('#page').load('/pages/game/' + page + '.html');
});