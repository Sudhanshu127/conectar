var express=require("express");
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
app.use(express.static("./../client"));
app.get('/', function(req, res){
  res.sendFile('./../client/index.html');
});
var room;
io.on('connection', function(socket){
  console.log('user connected');
  socket.on('join',function(roome){
  	socket.join(roome);
  	room=roome;
  })
  socket.on('chat message', function(msg){
    io.sockets.in(room).emit('chat message', msg.msg);
  });
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});