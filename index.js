/*
 * Index js
 * Main frontend js file - canvas manipulationg, socket communication, ui manipulating
 * @Author: Filip Gulan
 * @Date: 2018
 */

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

//Message arrived - objects
socket.on('objects', function (object) {
  //Make objects from strings
  object = object.map(function (item) {
    return JSON.parse(item);
  });
  //Add arrived objects to canvas
  fabric.util.enlivenObjects(object, function (objects) {
    var origRenderOnAddRemove = canvas.renderOnAddRemove;
    canvas.renderOnAddRemove = false;

    objects.forEach(function (o) {
      if (!canvas.contains(o)) {
        canvas.add(o);
      }
    });

    canvas.renderOnAddRemove = origRenderOnAddRemove;
    canvas.renderAll();
  });
});

socket.on('erase', function () {
  canvas.clear();
});

//On draw new object
canvas.on('mouse:up', function (event) {
  socket.emit('objects', JSON.stringify(event.target));
});

/***** Materialize UI *****/
$('#eraseCanvasButton').click(function() {
  socket.emit('erase');
});

$(document).ready(function () {
  $(".button-collapse").sideNav();
  $('.modal').modal();
});

$("#pencil-size").change(function (event) {
  canvas.freeDrawingBrush.width = event.target.value;
});

$('#saveButton').click(function () {
  var canvas = document.getElementById("board");
  this.href = canvas.toDataURL('image/png');
});

function onChangeColor(value) {
  canvas.freeDrawingBrush.color = '#' + value;
};

/***** Other function ******/
responsive();
window.addEventListener('resize', responsive);

function responsive() {
  var width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
  var height = (window.innerHeight > 0) ? window.innerHeight : screen.height;
  canvas.setDimensions({
    width: width,
    height: height - 65
  });
}