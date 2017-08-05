/*
 * Main js
 * Main backend js file - page rendering, server, socket server and socket communication
 * @Author: Filip Gulan
 * @Date: 2018
 */

var express = require('express');
var app = express();
var http = require('http').Server(app);
var mustacheExpress = require('mustache-express');
var io = require('socket.io')(http);
var JsonDB = require('node-json-db');
var db = new JsonDB("canvas", true, false);

//App settings
app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', __dirname + '/');
app.use('/', express.static(__dirname + '/'));
app.use('/libs', express.static(__dirname + '/node_modules/'));

//Page
http.listen(3000, function () {
  console.log('Example app listening on port 3000!')
});
app.get('/', function (req, res) {
  res.render('index');
});

//Sockets
io.on('connection', function(socket){
  //User connect
  console.log('user connected');
  socket.emit('objects', db.getData("/objects"));

  //User disconnect
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });

  //Message arrived - object
  socket.on('objects', function(object){
    console.log('Objects');
    socket.broadcast.emit('objects', [object]);
    db.push("/objects[]", object, true);
  });

  //Massage arrived - erase canvas
  socket.on('erase', function(object){
    console.log('Erase');
    io.emit('erase');
    db.push("/objects", []);
  });
});
