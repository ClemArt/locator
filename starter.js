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

server.listen(3000);
server.on('listening', function(){
  var port = server.address().port;
  debug('Listening on port : ' + port);
})
