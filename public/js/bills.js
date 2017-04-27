(function(angular) {
   'use strict';
   var app = angular.module('billsApp', []); //set app module
   app.controller('billsCtrl', function($scope, $http, $window) { //set controller
      //used to display bills onto page
      $scope.x = 120;
      $scope.bills = [];
      $scope.sites = [];
      $scope.view= 1;


      $scope.class = [];
      $scope.class2 = [];
  	  $scope.changeClass = function(){
    	   //currently does nothing
  	  }


      $scope.getBills = function(){

      	$http({ //get bill information from server (from DB)
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
        $http({ //get bill page on congress.gov
          url: '/getPage',
          method: 'GET',
          params: {
            id: billID
          }
        }).then(
          function successCallback(response){
          console.log(response.data);
          window.location.href = (response.data); //take user to page for bill
          /* window.open could be used to open page in a new tab, but most pop-up blockers
             will prevent this from running correctly, thus window.location.href was used. */
          }
        );
      }


      $scope.drawCanvas = function(billID) {

        $http({ //get bill vote positions from server (from DB)
          url: '/bill-contr',
          method: 'POST',
          params: { bill_id : billID }
        }).then(function successCallback(response) {
          console.log(response.data);
          if (response.data.abst_votes != 100) { // if there has been action taken on the bill
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

          } else { //if no action has been taken on the bill
            $scope.billData = [
              {
                "label":"No Action to Date",
                "value":response.data.abst_votes
              }
            ];
          }


          nv.addGraph(function() { //create the chart
            /* set chart parameters */
            var chart = nv.models.pieChart()
                .x(function(d) { return d.label })
                .y(function(d) { return d.value })
                .showLabels(true)
                .labelThreshold(.05)
                .labelType("percent");

              d3.select("#pc"+billID+" svg") //get the current bill id
                  .datum($scope.billData)
                .transition().duration(1200)
                  .call(chart);

            return chart;
          });

        }, function errorCallback(response) {
          // called asynchronously if an error occurs
          // or server returns response with an error status.
          console.log(response);
        });
      }

   });

})(window.angular);
