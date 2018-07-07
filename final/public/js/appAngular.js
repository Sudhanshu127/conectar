var app=angular.module('myApp',[]);
app.config(function ($interpolateProvider) {
  $interpolateProvider.startSymbol('[[');
  $interpolateProvider.endSymbol(']]');
});

app.controller('mainController',['$scope',function($scope){
            $scope.tags='App';
}]);