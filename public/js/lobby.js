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

$(document).on('click', '.page_button', function () {
    let page = $(this).data('page');

    if(page != 'index') {
        $('#page').load('/pages/' + page + '.html');
    } else {
        $('#page').load('/' + page + '.html');
    }
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
function joinLobby() {
    var lobbyID = URLGet('lobby');
    var username = $("#username_input_join").val();
    var password = $("#password_input_join").val();

    socket.emit('joinLobby', lobbyID, username, password);
}

//Get lobby info
socket.on('getLobbyInfo', current_lobby => {
    console.log(current_lobby);

})

//Lobby test
socket.on('playerJoined', (username) => {
    console.log(username + ' joined your room');
});

socket.on('lobbyCreated', (lobby) => {
    console.log('Lobby ' + lobby + ' has been created');
});