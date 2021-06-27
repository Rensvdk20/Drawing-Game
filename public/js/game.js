var socket = io();
var drawingColor = 'black';
var paths = [];

paper.install(window);
paper.setup('DrawArea');

// ##### -------------------------------------------------------------------------------------------------------------------- ##### //

// ##### SENDER ##### //
var pen = new Tool();
var path;

var send_coords;
pen.minDistance = 1;

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
    if(path != undefined) {
        path.remove();   
    }
    socket.emit('toolbox', 'undoDrawing');
});

// ##### -------------------------------------------------------------------------------------------------------------------- ##### //

// ##### RECEIVER ##### //
var coords;

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
    paths.push(path);
});

socket.on('toolbox', tool => {
    console.log(tool);

    switch(tool) {
        case 'clearDrawing':
            paper.project.activeLayer.removeChildren();
            break;
        case 'undoDrawing':
            var path = paths.pop();
            if(path != undefined) {
                path.remove();   
            }
            break;
        default:
            console.log('No tool found');
    }
});

// ##### -------------------------------------------------------------------------------------------------------------------- ##### //

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