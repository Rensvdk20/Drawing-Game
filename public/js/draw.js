// var socket = io();

// var path;
// var DrawingColor = '#00000';
// var TempDrawingColor = '#00000';
// var ScrollIndicatorNumber = 0;
// var coords = [];
// var xy = [];

// socket.on('receive-coords', socket_draw(xy));

// function socket_draw(xy) {
// 	// path.add(xy);
// 	console.log(xy);
// }

// //Drawing
// function onMouseDown(event) {
// 	//Create DrawingPath
// 	path = new Path();

// 	//DrawingColor
// 	path.strokeColor = DrawingColor;

// 	//LineWidth
// 	if(ScrollIndicatorNumber == 0) {
// 		path.strokeWidth = ScrollIndicatorNumber + 1;
// 	}
// 	else {
// 		path.strokeWidth = ScrollIndicatorNumber;
// 	}
	
// 	path.add(event.point);
// }

// function onMouseDrag(event) {
// 	// Every drag event, add a segment
// 	// to the path at the position of the mouse:
// 	path.add(event.point);
// 	console.log(event.point);
// 	socket.emit('send-coords', event.point);
// }

// function onMouseUp(event) {
// 	var segmentCount = path.segments.length;
	
// 	//When the mouse is released, simplify it:
// 	//Make this optional
// 	path.simplify();
	
// 	//Debug paths
// 	//path.fullySelected = true;
	
// 	//var newSegmentCount = path.segments.length;
// 	//var difference = segmentCount - newSegmentCount;
// 	//var percentage = 100 - Math.round(newSegmentCount / segmentCount * 100);
// 	//console.log(difference + ' of the ' + segmentCount + ' segments were removed. Saving ' + percentage + '%');
// }

// //Scrollweel
// window.addEventListener('wheel', function(event)
// {
//  if (event.deltaY < 0)
//  {
//   console.log('scrolling up');
//   if(ScrollIndicatorNumber < 10) {
// 	  ScrollIndicatorNumber = ScrollIndicatorNumber + 2.5;
// 	  console.log(ScrollIndicatorNumber);
//   }
//  }
//  else if (event.deltaY > 0)
//  {
//   console.log('scrolling down');
//   if(ScrollIndicatorNumber > 1) {
// 	ScrollIndicatorNumber = ScrollIndicatorNumber - 2.5;
// 	console.log(ScrollIndicatorNumber);
// }
//  }
// });

// //ColorPicker
// $(".cls-2").click(function() {
// 	DrawingColor = '#8602af';
// });
// $(".cls-3").click(function() {
// 	DrawingColor = '#fdfd33';
// });
// $(".cls-4").click(function() {
// 	DrawingColor = '#fc5309';
// });
// $(".cls-5").click(function() {
// 	DrawingColor = '#a7194b';
// });
// $(".cls-6").click(function() {
// 	DrawingColor = '#cfe92c';
// });
// $(".cls-7").click(function() {
// 	DrawingColor = '#f9bb03';
// });
// $(".cls-8").click(function() {
// 	DrawingColor = '#66b033';
// });
// $(".cls-9").click(function() {
// 	DrawingColor = '#0347fd';
// });
// $(".cls-10").click(function() {
// 	DrawingColor = '#fe0101';
// });
// $(".cls-11").click(function() {
// 	DrawingColor = '#01018b';
// });
// $(".cls-12").click(function() {
// 	DrawingColor = '#0491cd';
// });
// $(".cls-13").click(function() {
// 	DrawingColor = '#fa9903';
// });
// $(".cls-14").click(function() {
// 	DrawingColor = '#000000';
// });

// paper.setup('DrawArea');
// document.getElementById('clear').onclick = function() {
// 	paper.project.activeLayer.removeChildren();
// }

// $("#pen").click(function() {
// 	//Set drawingcolor to last selected color before erasing (if not erased standard color = black)
// 	DrawingColor = TempDrawingColor;
// });

// $("#undo").click(function() {
// 	//Set drawingcolor to last selected color before erasing (if not erased standard color = black)
// 	path.remove();
// });

// //Save the last selected color and then turn it into an eraser
// $("#erase").click(function() {
// 	TempDrawingColor = DrawingColor;
// 	DrawingColor = '#ffffff';
// });