var app=angular.module('myApp',[]);

app.controller('mainController',['$scope',function($scope){
 var socket = io.connect();
 var roome="Sudhanshu";
 var preroome;
 var user;
 $scope.submituser=function(response){
 	//socket.emit('user',response);
 	$scope.You=response;
 	user=response;
 }
 $scope.submit =function(response){
 	preroome=roome;
 	roome=response;
 	$scope.roome=roome;
 	$scope.messages=[];
 	socket.emit('join',roome,preroome,user);
 }

 $scope.send = function(){
	var msg=$scope.message;
	socket.emit('chat message', msg,roome,user);
	$scope.message="";
}
socket.on('new chat message',function(user,msg){
	$scope.messages.push({"name":user,"msg":msg});
});
 socket.on('chat message', function(user,msg){
 	$scope.messages.push({"name":user,"msg":msg});
 });
}]);