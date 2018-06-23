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
//var sudhanshu="group";
var sudhanshudatabase;
var friend;
var putIntoDatabase=function(databaseof,databaseabout,messageby,msg){
  	var url = "mongodb://"+ip+databaseof;
	MongoClient.connect(url, function(err, client) {
		if (err){
		  console.log("error");
		}
		  console.log("Putting data into "+databaseof);
		  sudhanshudatabase=client.db(databaseof);
		  const messageS=sudhanshudatabase.collection(databaseabout);
  		  messageS.insertMany([{name:messageby,msg:msg}],function(err,result){});
		  client.close();
	});
};

///////////////////////////////////////

io.on('connection', function(socket){
  console.log('user connected');
///////////////////////////////////////

/////////////////////////////////////

  socket.on('join',function(roome,proome,user){
  	socket.leave(proome);
  	socket.join(user+roome);
  	var sudhanshu=user;
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
		  		//different bug in here
    			io.sockets.in(user+roome).emit('new chat message',x.name, x.msg);
   		  	}
		  });
		  client.close();
	});
});
	socket.on('seetags',function(roome,user,whosetags){
		var sudhanshu=user;
  		var url = "mongodb://"+ip+sudhanshu;
		MongoClient.connect(url, function(err, client) {
			if(err){
				console.log("Error in seeing tags");
			}
			console.log("Seeing tags of "+whosetags);
			var mydatabase=client.db(user);
			const messageS=mydatabase.collection(roome+whosetags);
			messageS.find({}).toArray(function(err,docs){
				assert.equal(err,null);
				for(var x of docs)
				{
					io.sockets.in(user+roome).emit("chat message",x.name,x.msg);
				}

			});
		});
   });
  socket.on('chat message', function(msg,roome,user){
  	console.log(roome+"|||"+msg);
  	var sudhanshu=user;
  	putIntoDatabase(sudhanshu,roome,sudhanshu,msg);
  	putIntoDatabase(roome,sudhanshu,sudhanshu,msg);
	//bug over here
    io.sockets.in(user+roome).emit('chat message',sudhanshu, msg);
    io.sockets.in(roome+user).emit('chat message',sudhanshu, msg);
  });

  socket.on('group chat message',function(msg,roome,user,to){
  	console.log("Sending group a message "+msg+" Now feeding in "+to);
  	putIntoDatabase(to,roome,user,msg);
  	io.sockets.in(to+roome).emit('chat message',user,msg);
  });
  socket.on('tagMe',function(msg,roome,user,to,who){
  	console.log(who+" will be tagged");
  	putIntoDatabase(to,roome+who,user,msg);
  	io.sockets.in(to+roome).emit('chat message',user,who+" was tagged in "+msg);
  });
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});