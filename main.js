var express = require('express');
var app = express();
var http = require('http').Server(app);
var mustacheExpress = require('mustache-express');
var io = require('socket.io')(http);
var JsonDB = require('node-json-db');
var db = new JsonDB("canvas", true, false);

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
  res.render('index', {title: "iBoard"});
});

//Sockets
io.on('connection', function(socket){
  //User connect
  console.log('a user connected');
  socket.emit('canvas', db.getData("/objects"));

  //User disconnect
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });

  //Message arrived
  socket.on('canvas', function(object){
    console.log('ARRIVED');
    socket.broadcast.emit('canvas', [object]);
    db.push("/objects[]", object, true);
  });
});
