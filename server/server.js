var express=require("express");
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
app.use(express.static("./../client"));
app.get('/', function(req, res){
  res.sendFile('./../client/index.html');
});
var room;
/////////////////////////////////////
var talker = require('mongoose');////
var talking = require('mongoose');/////
var ip='localhost:3000/';///////////////////
/////////////////////////////////////
io.on('connection', function(socket){
  console.log('user connected');
  socket.on('join',function(roome,proome){
  	socket.leave(proome);
  	socket.join(roome);
  	room=roome;
  	
///////////////////////////////////
 	var a,b;
  	var connect = 'mongodb://localhost:3000/test';
  	talking.connect(connect, function(err, db) {
    if (err) {
        console.log('Unable to connect to the server. Please start the server. Error:', err);
    } else {
        console.log('Connected to Server successfully!');
    }
	});
  	talker.connect('mongodb://'+ip+'test', function(err, db) {
    if (err) {
        console.log('Unable to connect to the server. Please start the server. Error:', err);
    } else {
        console.log('Connected to Server successfully!');
    }
	});
  	var messagingmodel =talking.Schema({
  		name : String,
  		array : []
  	});
  	var messagermodel =talker.Schema({
  		name :String,
  		array :[]
  	});
  	var messaging =talking.model('messaging',messagingmodel);
  	var messager =talker.model('messager',messagermodel);
 
  	messaging.find({ name: room},function(err,docs){
  		if(err)
  		{
  			a=new messaging({name:room});
  		}
  		a=docs;
  	});
  	messager.find({ name: "group"},function(err,docs){
  		if(err)
  		{
  			b=new messaging({name:room});
  		}
  		b=docs;
  	});


  });
  socket.on('chat message', function(msg,roome){
  	a.array.push(msg);
  	b.array.push(msg);
  	a.save(callback);
  	b.save(callback);
  	console.log(roome+"|||"+msg);
  	var message=messaging.find({ name:roome });
    io.sockets.in(roome).emit('chat message', message.mess[0]);
  });
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});