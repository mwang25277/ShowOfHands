(function(angular) {
   'use strict';
   var app = angular.module('analyticsApp', ['nvd3']);
   app.controller('analyticsCtrl', function($scope, $http, $window) {
      $scope.getSenGraphs = function() {
        var requests = 0;
        var partyD = {};
        var partyR = {};
        var missedD = {};
        var missedR = {};
        $http.post('/party-vote-pct', { chamber: "senate", party: "D" } ).then(function( response ) {
          console.log(response);
          // partyD = response.data;
          // requests = requests + 1;
          // console.log(partyD);
          $scope.options = {
              chart: {
                  type: 'multiBarChart',
                  height: 450,
                  x: function(d){return d.label;},
                  y: function(d){return d.value;},
                  stacked: false,
              }
          };
          console.log(response.data[0]);
          $scope.demSen = [
            {
              key: "party",
              values: response.data[0]
            },
            {
              key: "missed",
              values: response.data[1]
            }
          ]
        });

        $http.post('/party-vote-pct', { chamber: "senate", party: "R" } ).then(function( response ) {
          console.log(response);
          // partyD = response.data;
          // requests = requests + 1;
          // console.log(partyD);
          $scope.options = {
              chart: {
                  type: 'multiBarChart',
                  height: 450,
                  x: function(d){return d.label;},
                  y: function(d){return d.value;},
                  stacked: false,
              }
          };
          console.log(response.data[0]);
          $scope.repSen = [
            {
              key: "party",
              color: "red",
              values: response.data[0]
            },
            {
              key: "missed",
              color: "#ff8282",
              values: response.data[1]
            }
          ]
        });

        // $http.post('/missed-vote-pct', { chamber: "senate", party: "D"} ).then(function( response ) {
        //   missedD = response.data;
        //   requests = requests + 1;
        // });
        // $http.post('/party-vote-pct', { chamber: "senate", party: "R"} ).then(function( response ) {
        //   partyR = response.data;
        //   requests = requests + 1;
        // });

        // $http.post('/missed-vote-pct', { chamber: "senate", party: "R"} ).then(function( response ) {
        //   missedR = response.data;
        //   requests = requests + 1;
        // });
        // console.log(requests);
        // //if(requests == 4) { //once all posts have finished
        //   console.log(partyR);
        //   console.log(partyD);

        //   $scope.$apply();
        //}
      };
   });

})(window.angular);