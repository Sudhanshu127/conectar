var app=angular.module('myApp',[]);

app.controller('mainController',['$scope',function($scope){
 var socket = io.connect();
 $scope.messages="1";
 $scope.send = function(){
  socket.emit('chat message', $scope.message);
  $scope.message="";
 }
 socket.on('chat message', function(msg){
 });
}]);