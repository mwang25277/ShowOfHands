(function(angular) {
   'use strict';
   var app = angular.module('billsApp', []);
   app.controller('billsCtrl', function($scope, $http, $window) {
      //used to display bills onto page
      $scope.x = 5;
      $scope.bills = [];
      $scope.view= 1;


      $scope.class = [];
      $scope.class2 = [];
  	  $scope.changeClass = function(){
    	/*if ($scope.class === "active"){
      		$scope.class.pop('active');
      		$scope.class2.push('active');
    	}
    	else if ($scope.class === "active"){
      		$scope.class.pop('active');
      		$scope.class2.push('active');
    	}
    	else if ($scope.class === "active"){
      		$scope.class.pop('active');
      		$scope.class2.push('active');
    	}
    	else if ($scope.class === "active"){
      		$scope.class.pop('active');
      		$scope.class2.push('active');
    	}
    	else {
      		$scope.class.pop('active');
      		$scope.class2.push('active');
      	}*/
  	  };


      $scope.getBills = function(){
      	
      	$http({
      		url: '/bills',
      		method: 'GET'
      	}).then(
      		function successCallback(response){
      			$scope.bills = response.data;

      		},
      		function errorCallback(response){

      			console.log(response);
      		}


      	);


      };
      



   });

})(window.angular);