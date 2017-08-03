/***** fabric canvas *****/
var canvas = new fabric.Canvas('board');
canvas.isDrawingMode = true;
var originalWidth = 800;
var width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
var widthRatio = originalWidth / width;
canvas.setWidth(canvas.width * widthRatio);
canvas.setHeight(canvas.height * widthRatio);

/***** Socket io communication *****/
var socket = io();

//Message arrived
socket.on('canvas', function(object) {
  object = object.map(function(item) {
    return JSON.parse(item);
  });
  fabric.util.enlivenObjects(object, function(objects) {
    var origRenderOnAddRemove = canvas.renderOnAddRemove;
    canvas.renderOnAddRemove = false;

    objects.forEach(function(o) {
      if (!canvas.contains(o)) {
        canvas.add(o);
        console.log('ARRIVED');
      }
    });

    canvas.renderOnAddRemove = origRenderOnAddRemove;
    canvas.renderAll();
  });
});

canvas.on('mouse:up', function(event) {
  console.log('ADDED');
  socket.emit('canvas', JSON.stringify(event.target));
});

/***** Materialize UI *****/
$(document).ready(function() {
  $('select').material_select();
  $(".button-collapse").sideNav();
});

$("#pencil-size").change(function(event) {
  canvas.freeDrawingBrush.width = event.target.value;
});

$("#pencil-color").change(function(event) {
  canvas.freeDrawingBrush.color = event.target.value;
});

/***** Other function ******/
responsive();
window.addEventListener('resize', responsive);

function responsive() {
  var width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
  var height = (window.innerHeight > 0) ? window.innerHeight : screen.height;
  canvas.setDimensions({
    width: width - 0,
    height: height - 65
  });
}