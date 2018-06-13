var app=angular.module('myApp',[]);

app.controller('mainController',['$scope',function($scope){
 var socket = io.connect();
 var roome="Sudhanshu";
 var preroome;
 $scope.submit =function(response){
 	preroome=roome;
 	roome=response;
 	$scope.roome=roome;
 	socket.emit('join',roome,preroome);
 }

 $scope.send = function(){
	var msg=$scope.message;
	socket.emit('chat message', msg,roome);
	$scope.message="";
}
 socket.on('chat message', function(msg){
  var li=document.createElement("li");
  li.appendChild(document.createTextNode(msg));
  document.getElementById("messages").appendChild(li);
 });
}]);