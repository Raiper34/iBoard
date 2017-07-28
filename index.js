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
app.use('/fabric', express.static(__dirname + '/node_modules/fabric/dist/'));
http.listen(3000, function () {
  console.log('Example app listening on port 3000!')
  //db.push("/test3", {test:"test", json: {test:["test"]}});
  console.log(db.getData("/"));
});

app.get('/', function (req, res) {
  res.render('index', {title: "iBoard"});
});

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
  socket.on('canvas', function(canvas){
    console.log(canvas);
    io.emit('canvas', canvas);
  });
});
