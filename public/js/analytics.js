(function(angular) {
   'use strict';
   var app = angular.module('analyticsApp', ['nvd3']);
   app.controller('analyticsCtrl', function($scope, $http, $window) {
      $scope.getSenGraphs = function() {
        $http.post('/senate-vote-pct', { chamber: "senate", party: "D" } ).then(function( response ) {
          console.log(response);
          // partyD = response.data;
          // requests = requests + 1;
          // console.log(partyD);
          $scope.demSenOptions = {
              chart: {
                  type: 'multiBarChart',
                  height: 450,
                  x: function(d){return d.label;},
                  y: function(d){return d.value;},
                  stacked: false,
                  xAxis: {
                      axisLabel: 'Members of Congress'
                  },
                  yAxis: {
                      axisLabel: 'Voting Percentage (%)'
                  }
              },
              title: {
                enable: true,
                text: 'Senate Voting Percentages: Democrats'
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

        $http.post('/senate-vote-pct', { chamber: "senate", party: "R" } ).then(function( response ) {
          //console.log(response);
          // console.log(partyD);
          $scope.repSenOptions = {
              chart: {
                  type: 'multiBarChart',
                  height: 450,
                  x: function(d){return d.label;},
                  y: function(d){return d.value;},
                  stacked: false,
                  xAxis: {
                      axisLabel: 'Members of Congress'
                  },
                  yAxis: {
                      axisLabel: 'Voting Percentage (%)'
                  }
              },
              title: {
                enable: true,
                text: 'Senate Voting Percentages: Republicans'
              }
          };
          //console.log(response.data[0]);
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
      };

      $scope.getHouseGraphs = function() {
        $http.post('/house-vote-pct', { chamber: "house", vote: "party" } ).then(function( response ) {
          console.log(response);
          // partyD = response.data;
          // requests = requests + 1;
          // console.log(partyD);
          $scope.partyOptions = {
              chart: {
                  type: 'boxPlotChart',
                  height: 450,
                  x: function(d){return d.label;},
                  //y: function(d){return d.value;},
                  yAxis: {
                      axisLabel: 'Voting Percentage (%)'
                  }
              },
              "color": [
                "darkblue",
                "darkred"
              ],
              title: {
                enable: true,
                text: 'House of Reps: Voting with Party Percentages'
              }
          };
          console.log(response.data);
          $scope.party = response.data;
        });

        $http.post('/house-vote-pct', { chamber: "house", vote: "missed" } ).then(function( response ) {
          //console.log(response);
          // console.log(partyD);
          $scope.missedOptions = {
              chart: {
                  type: 'boxPlotChart',
                  height: 450,
                  x: function(d){return d.label;},
                  //y: function(d){return d.value;},
                  yAxis: {
                      axisLabel: 'Voting Percentage (%)'
                  }
              },
              title: {
                enable: true,
                text: 'House of Reps: Missed Voting Percentages'
              }
          };
          //console.log(response.data[0]);
          $scope.missed = response.data;
        });
      };
   });

})(window.angular);