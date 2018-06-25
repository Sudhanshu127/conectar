var app=angular.module('myApp',[]);

app.controller('mainController',['$scope',function($scope){
 var socket = io.connect();
 var roome;
 var preroome;
 var user;
 var iWillBeTagged;
 var seeMytags;
 var group="group";
 var groupmembers=["Sudhanshu","Vishal","Vipul","Ayush","Jayesh"];
 var ul=document.getElementById("myUL");
 var li = ul.getElementsByTagName('li');
 for (i = 0; i < li.length; i++) {
    a = li[i].getElementsByTagName("a")[0];
    li[i].style.display = "none";
}

$scope.loveit=function(){
	socket.emit('loveit',user,roome,$scope.love);
}
//Used to create a user id
 $scope.submituser=function(response){
 	//socket.emit('user',response);
 	$scope.You=response;
 	user=response;
 }

 //Submit the user you want to talk too
 $scope.submit =function(response){
 	preroome=roome;
 	roome=response;
 	$scope.roome=roome;
 	$scope.messages=[];
 	socket.emit('join',roome,preroome,user);
 }
//Click and see tags
 $scope.seetags =function(response){
 	socket.emit('seetags',roome,user,response);
 }
//send messages when you press enter
 $scope.send = function(){
 	if(roome==group)
 	{
 		groupchat();
 		$scope.message="";
 		return;
 	}
	var msg=$scope.message;
	socket.emit('chat message', msg,roome,user);
	$scope.message="";
}

//while typing you get tags which are stored in id="myUL" and "li" 
 $scope.searchForTags=function(){
 	if(roome==group)
 	{
		var input,filter,ul,li,a,i;
		input = document.getElementById("m");
		filter = input.value.toUpperCase();
		var space=filter.lastIndexOf(" ");
		filter=filter.substring(space+1,filter.length);

		ul=document.getElementById("myUL");
		li = ul.getElementsByTagName('li');
	    for (i = 0; i < li.length; i++) {
	        a = li[i];
	        if ((a.innerHTML.toUpperCase().indexOf(filter) > -1)&&(filter.length>=3)) {
	            li[i].style.display = "";
	        } else {
	            li[i].style.display = "none";
	        }
	    } 		
 	}

};

//When clicked on any tag this is used to replace tag and store it
$scope.TagMe=function(tag){
	var a=$scope.message.lastIndexOf(" ");
	var res =$scope.message.substring(0,a+1);
	res+=tag;
	$scope.message=res;
	iWillBeTagged=tag;
};

//You dont need to know there on
var groupchat=function(){
	var msg=$scope.message;
	for(var to in groupmembers)
	{
		var tosend=groupmembers[to];
		socket.emit('group chat message', msg,roome,user,tosend);
		$scope.test=iWillBeTagged.length;
		if(iWillBeTagged.length>0)
		{
			socket.emit('tagMe',msg,roome,user,tosend,iWillBeTagged);
		}		
	}
	iWillBeTagged="";
	$scope.message="";
}
socket.on('loveit',function(love){
	$scope.love=love;
	$scope.$apply();
});
socket.on('new chat message',function(user,msg){
	$scope.messages.push({"name":user,"msg":msg});
	$scope.$apply();
});
 socket.on('chat message', function(user2,msg){
 	if((user2==roome)||(user2==user)||(roome==group)){
	 	$scope.messages.push({"name":user2,"msg":msg});
		$scope.$apply();	
 	}

 });
}]);