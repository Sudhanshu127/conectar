var app=angular.module('myApp',[]);

app.controller('mainController',['$scope',function($scope){
 var socket = io.connect();
 var roome="Sudhanshu";
 $scope.submit =function(response){
 	roome=response;
 	$scope.roome=roome;
 	socket.emit('join',roome);
 }

 $scope.send = function(){
	var msg={msg:$scope.message , room:roome};
	socket.emit('chat message', msg);
	$scope.message="";
}
 socket.on('chat message', function(msg){
  var li=document.createElement("li");
  li.appendChild(document.createTextNode(msg));
  document.getElementById("messages").appendChild(li);
 });
}]);