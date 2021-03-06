(function(angular) {
   'use strict';
   var app = angular.module('billsApp', []);
   app.controller('billsCtrl', function($scope, $http, $window) {
      //used to display bills onto page
      $scope.x = 120; //number of bills
      $scope.bills = [];
      $scope.sites = [];
      $scope.view= 1;


      $scope.class = [];
      $scope.class2 = [];
  	  


      $scope.getBills = function(){

      	$http({ //get bills data when the page loads
      		url: '/bills',
      		method: 'GET',
      		params: {
      			num: $scope.x
      		}
      	}).then(
      		function successCallback(response, sites){
      			$scope.bills = response.data; //set bills scope variable to return value
            //$scope.sites = sites.data.sites;
      		},
      		function errorCallback(response){

      			console.log(response);
      		}


      	);


      }



      $scope.loadPage = function(billID){  //load the bills page on congressdotgov
        console.log(billID);
        $http({
          url: '/getPage',
          method: 'GET',
          params: {
            id: billID  //use the bill id to get the site
          }
        }).then(
          function successCallback(response){
          console.log(response.data);
          window.location.href =(response.data); //change location to the congressdotgov page we got in the call back
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
            var data = [
              {"Yes":response.data.yes_votes, "color":"green"},
              {"No":response.data.no_votes, "color":"orange"},
              {"Abstain":response.data.abst_votes, "color":"black"}
            ];

            var pie_data = [];
            pie_data[0] = response.data.yes_votes;
            pie_data[1] = response.data.no_votes;
            pie_data[2] = response.data.abst_votes;

          } else {
            var data = [{"abst":response.data.abst_votes, "color":"grey"}];
            var pie_data = [];
            pie_data[0] = response.data.abst_votes;
          }

          var domElem = "#pc"+billID;
          console.log(domElem);

          var width = 200;
          var height = 200;
          var radius = Math.min(width, height) / 2;
          var color = d3.scale.category20b();  //builtin range of colors
          var svg = d3.select(domElem).append('svg').attr('width', width).attr('height', height).append('g').attr('transform', 'translate(' + (width / 2) +',' + (height / 2) + ')');
          var arc = d3.svg.arc().outerRadius(radius);
          var pie = d3.layout.pie().value(function(d,i) { return  pie_data[i]; }).sort(null);

          var path = svg.selectAll('path')
            .data(pie(data))
            .enter()
            .append('path')
            .attr('d', arc)
            .attr('fill', function(d, i) {
              return data[i].color;
            });


        }, function errorCallback(response) {
          // called asynchronously if an error occurs
          // or server returns response with an error status.
        });
      }

   });

})(window.angular);
