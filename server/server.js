var express=require("express");
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
app.use(express.static("/home/sudhanshu/soc/client"));
app.get('/', function(req, res){
  res.sendFile('/home/sudhanshu/soc/client/index.html');
});

io.on('connection', function(socket){
  console.log('user connected');
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});