var express = require('express');
var app = express();
var morgan = require('morgan');
var debug = require('debug')('server:global');
var server = require('http').createServer(app);
var io = require('socket.io')(server);

app.use(morgan('dev'));

app.use(express.static('public'));

app.get('/*', function(req, res){
  res.status(404).redirect('/');
})

var data = initializeData();

server.listen(3000);
server.on('listening', function(){
  var port = server.address().port;
  debug('Listening on port : ' + port);
});

io.on('connection', function(socket){
  var color = giveColor();
  socket.emit('color', color);

  socket.on('disconnect', function(){
    retrieveColor(color);
  });
});

function giveColor(){
  return data.colors.pop();
}

function retrieveColor(color){
  data.colors.push(color);
}

function initializeData(){
  var data = {};
  //Colors for the chat (limited to 30 people per room)
  data.colors = [];
  for(var i=0; i<30; i++){
    data.colors.push(i*12);
  }
  data.colors = shuffle(data.colors);

  return data;
}

function shuffle(array){ // Fisher–Yates shuffle
  var m = array.length, t, i;
  while(m){
    i = Math.floor(Math.random()*m);
    t = array[m];
    array[m] = array[i];
    array[i] = t;
    m--;
  }
  return array;
}
