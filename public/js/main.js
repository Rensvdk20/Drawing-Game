function getLobbyTable() {
    var data = getLobbys();
    var table = $('#lobbys');
    var table_data = "";

    table_data += '<table class="table"><thead><tr>';
    table_data += '<th>Lobby ID</th><th>Lobby name</th><th>Join</th><th>Availability</th>';
    table_data += '</tr></thead><tbody>';
    for(i = 0; i < data.length; i++) {
        table_data += '<tr>';
        table_data += '<td>' + data[i]['id'] + '</td>';
        table_data += '<td>' + data[i]['name'] + '</td>';
        table_data += '<td><a href="joinLobby.html?lobby_id=' + data[i]['id'] +'">Join</a></td>';
        table_data += '<td>' + (data[i]['availability'] == 1 ? '<i class="fas fa-lock-open"></i>' : '<i class="fas fa-lock"></i>') + '</td>';
        table_data += '</tr>';
    }
    table_data += '</tbody></table>';

    table.append(table_data);
}

function getLobbys() {
    var result;

    $.ajax({
        url: "/sql",
        type: 'GET',
        dataType: 'json',
        async: false,
        success: (res) => {
            result = res;
        }
    });

    return result;
}