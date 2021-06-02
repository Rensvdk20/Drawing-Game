var socket = io();
var coords;
var send_coords;

paper.install(window);
paper.setup('DrawArea');

var path;
// var sessionId = io.socket.sessionid;

// ##### RECEIVER ##### //
socket.on('startPath', coords => {
    path = new Path();
    path.strokeColor = 'black';
    path.add(coords);
    console.log(coords);
});

socket.on('continuePath', coords => {
    path.add(new Point(coords));
    // console.log(coords);
});

socket.on('endPath', coords => {
    path.simplify();
});

var pen = new Tool();
pen.minDistance = 1;


// ##### SENDER ##### //
path = new Path();
path.strokeColor = 'black';

pen.onMouseDown = function(event) {
    // console.log('click');
    path = new Path();
    path.strokeColor = 'black';
    path.add(event.point);
    send_coords = event.point.x + ', ' + event.point.y;
    socket.emit('startPath', send_coords);
}

pen.onMouseDrag = function(event) {
    // console.log(event.point);
    path.add(event.point);
    send_coords = event.point.x + ', ' + event.point.y;
    socket.emit('continuePath', send_coords);
};

pen.onMouseUp = function(event) {
    path.simplify();
    socket.emit('endPath', send_coords);
}