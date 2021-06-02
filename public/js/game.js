var socket = io();
var drawingColor = 'black';
var paths = [];
// var sessionId = io.socket.sessionid;

// ##### RECEIVER ##### //
var coords;
var my_path;

paper.install(window);
paper.setup('DrawArea');

socket.on('startPath', (coords, color) => {
    my_path = new Path();
    my_path.strokeColor = color;
    my_path.add(coords);
    console.log(coords);
});

socket.on('continuePath', coords => {
    my_path.add(new Point(coords));
});

socket.on('endPath', coords => {
    my_path.simplify();
});

socket.on('toolbox', tool => {
    console.log(tool);

    switch(tool) {
        case 'clearDrawing':
            console.log("clear");
            break;
        case 'undoDrawing':
            console.log("undo");
            break;
        default:
            console.log('nothing found');
    }

    // path = paths.pop();
    // path.remove();
});

// ##### SENDER ##### //
var pen = new Tool();
var path;

pen.minDistance = 1;
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
    paths.push(path);
}

document.getElementById('clearDrawing').onclick = () => {
	paper.project.activeLayer.removeChildren();
    socket.emit('toolbox', 'clearDrawing');
}

$("#undoDrawing").click(() => {
    //Check if array is already empty
    var path = paths.pop();
	path.remove();
    socket.emit('toolbox', 'undoDrawing');
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