var socket = io();
var drawingColor = 'black';
// var sessionId = io.socket.sessionid;

// ##### RECEIVER ##### //
var coords;

paper.install(window);
paper.setup('DrawArea');

var path;

socket.on('startPath', (coords, color) => {
    path = new Path();
    path.strokeColor = color;
    path.add(coords);
    console.log(coords);
});

socket.on('continuePath', coords => {
    path.add(new Point(coords));
});

socket.on('endPath', coords => {
    path.simplify();
});

// ##### SENDER ##### //
var pen = new Tool();
pen.minDistance = 1;
path = new Path();
var send_coords;

pen.onMouseDown = function(event) {
    path = new Path();
    path.strokeColor = drawingColor;
    path.add(event.point);
    send_coords = event.point.x + ', ' + event.point.y;
    socket.emit('startPath', send_coords, drawingColor);
}

pen.onMouseDrag = function(event) {
    path.add(event.point);
    send_coords = event.point.x + ', ' + event.point.y;
    socket.emit('continuePath', send_coords);
};

pen.onMouseUp = function(event) {
    path.simplify();
    socket.emit('endPath', send_coords);
}

document.getElementById('clearDrawing').onclick = function() {
    console.log('test');
	paper.project.activeLayer.removeChildren();
}

$("#undoDrawing").click(function() {
	path.remove();
});

//ColorPicker
$(".cls-2").click(() => { drawingColor = '#8602af' });
$(".cls-3").click(() => { drawingColor = '#fdfd33' });
$(".cls-4").click(() => { drawingColor = '#fc5309' });
$(".cls-5").click(() => { drawingColor = '#a7194b' });
$(".cls-6").click(() => { drawingColor = '#cfe92c' });
$(".cls-7").click(() => { drawingColor = '#f9bb03' });
$(".cls-8").click(() => { drawingColor = '#66b033' });
$(".cls-9").click(() => { drawingColor = '#0347fd' });
$(".cls-10").click(() => { drawingColor = '#fe0101' });
$(".cls-11").click(() => { drawingColor = '#01018b' });
$(".cls-12").click(() => { drawingColor = '#0491cd' });
$(".cls-13").click(() => { drawingColor = '#fa9903' });
$(".cls-14").click(() => { drawingColor = '#000000' });