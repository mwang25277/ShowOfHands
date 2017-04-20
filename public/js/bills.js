(function(angular) {
   'use strict';
   var app = angular.module('billsApp', []);
   app.controller('billsCtrl', function($scope, $http, $window) {
      //used to display bills onto page
      $scope.x = 20;
      $scope.bills = [];
      $scope.sites = [];
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
      		method: 'GET',
      		params: {
      			num: $scope.x
      		}
      	}).then(
      		function successCallback(response, sites){
      			$scope.bills = response.data;
            //$scope.sites = sites.data.sites;
      		},
      		function errorCallback(response){

      			console.log(response);
      		}


      	);


      };



      $scope.loadPage = function(billID){
        console.log(billID);
        $http({
          url: '/getPage',
          method: 'GET',
          params: {
            id: billID
          }
        }).then(
          function successCallback(response){
          console.log(response.data);
          window.location.href =(response.data);
          }
        );



      };
      



   });

})(window.angular);