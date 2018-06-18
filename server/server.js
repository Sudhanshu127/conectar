var express=require("express");
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
app.use(express.static("./../client"));
app.get('/', function(req, res){
  res.sendFile('./../client/index.html');
});

var MongoClient =require('mongodb').MongoClient;
const assert = require('assert');
var ip="localhost:27017/";
var sudhanshu="group";
var sudhanshudatabase;
var friend;

///////////////////////////////////////

io.on('connection', function(socket){
  console.log('user connected');
///////////////////////////////////////
	socket.on('user',function(user){
		sudhanshu=user;
	});


/////////////////////////////////////

  socket.on('join',function(roome,proome){
  	socket.leave(proome);
  	socket.join(roome);
  	var url = "mongodb://"+ip+sudhanshu;
	MongoClient.connect(url, function(err, client) {
		if (err){
		  console.log("error");
		}
		  console.log("Retreving data from "+sudhanshu);
		  sudhanshudatabase=client.db(sudhanshu);
		  const messageS=sudhanshudatabase.collection(roome);
		  messageS.find({}).toArray(function(err,docs){
		  	assert.equal(err,null);
		  	for(var x of docs)
		  	{
		  		//different but in here
    			io.sockets.in(roome).emit('chat message',x.name, x.msg);
   		  	}
		  });
		  client.close();
	});


   });
  socket.on('chat message', function(msg,roome){
  	console.log(roome+"|||"+msg);
  	var url = "mongodb://"+ip+sudhanshu;
	MongoClient.connect(url, function(err, client) {
		if (err){
		  console.log("error");
		}
		  console.log("Putting data into "+sudhanshu);
		  sudhanshudatabase=client.db(sudhanshu);
		  const messageS=sudhanshudatabase.collection(roome);
  		  messageS.insertMany([{name:sudhanshu,msg:msg}],function(err,result){});
		  client.close();
	});
  	
  	url = "mongodb://"+ip+roome;

	MongoClient.connect(url, function(err, client) {
		if (err){
		  console.log("error");
		}
		  console.log("Putting data into "+roome);
		  friend=client.db(roome);
		  const messageF=friend.collection(sudhanshu);
  		  messageF.insertMany([{name:sudhanshu,msg:msg}],function(err,result){});
  		  client.close();
	});
	//bug over here
    io.sockets.in(roome).emit('chat message',sudhanshu, msg);
  });
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});