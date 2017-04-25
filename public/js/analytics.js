(function(angular) {
   'use strict';
   var app = angular.module('analyticsApp', ['nvd3']);
   app.controller('analyticsCtrl', function($scope, $http, $window) {
      $scope.welcomeJumbo = true;
      //gets graphs when the Senate option is chosen
      //graphs are multi bar charts. bars show each senator's votes with party pct and their missed votes pct
      $scope.getSenGraphs = function() {
        $scope.welcomeJumbo = false;
        //democrats
        $http.post('/senate-vote-pct', { chamber: "senate", party: "D" } ).then(function( response ) {
          //D3 chart options
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
                  },
                  showControls: false
              },
              title: {
                enable: true,
                text: 'Senate Voting Percentages: Democrats'
              }
          };
          //console.log(response.data[0]);
          //D3 data format
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
        //republicans
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
                  },
                  showControls: false
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

      //get graphs when House option is selected
      //graphs are box plots showing/comparing the distribution of each party's 
      //votes with party percentages and missed votes pct
      $scope.getHouseGraphs = function() {
        $scope.welcomeJumbo = false;
        //get votes with party data
        $http.post('/house-vote-pct', { chamber: "house", vote: "party" } ).then(function( response ) {
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
          //console.log(response.data);
          $scope.party = response.data;
        });

        //get missed votes data
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