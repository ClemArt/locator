var app = require('express')();
var morgan = require('morgan');
var debug = require('debug')('server:global');
var server = require('http').createServer(app);
var io = require('socket.io')(server);


app.use(morgan('dev'));


server.listen(3000);
server.on('listening', function(){
  var port = server.address().port;
  debug('Listening on port : ' + port);
})
