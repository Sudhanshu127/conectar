var app=angular.module('myApp',[]);

app.controller('myCtrl',['$scope',function($scope){
	$scope.x=$scope.t;
}]);