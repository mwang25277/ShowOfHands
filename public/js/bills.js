(function(angular) {
   'use strict';
   var app = angular.module('billsApp', []);
   app.controller('billsCtrl', function($scope, $http, $window) {
      //used to display bills onto page
      $scope.x = 120;
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
  	  }


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


      }



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
      }


      $scope.drawCanvas = function(billID) {

        $scope.check = true;
        $http({
          url: '/bill-contr',
          method: 'POST',
          params: { bill_id : billID }
        }).then(function successCallback(response) {
          console.log(response.data);
          if (response.data.abst_votes != 100) {
            $scope.billData = [
              {
                "label":"Yes",
                "value":response.data.yes_votes
              },
              {
                "label":"No",
                "value":response.data.no_votes
              },
              {
                "label":"Abstain",
                "value":response.data.abst_votes
              }
            ];

          } else {
            $scope.billData = [
              {
                "label":"No Action to Date",
                "value":response.data.abst_votes
              }
            ];
          }


          nv.addGraph(function() {
            var chart = nv.models.pieChart()
                .x(function(d) { return d.label })
                .y(function(d) { return d.value })
                .showLabels(true)
                .labelThreshold(.05)
                .labelType("percent");

              d3.select("#pc"+billID+" svg")
                  .datum($scope.billData)
                .transition().duration(1200)
                  .call(chart);

            return chart;
          });

        }, function errorCallback(response) {
          // called asynchronously if an error occurs
          // or server returns response with an error status.
        });
      }

   });

})(window.angular);
