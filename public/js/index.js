(function(angular) {
   'use strict';
   var app = angular.module('homeApp', []);
   app.controller('billsCtrl', function($scope, $rootScope, $http, $window) {
      //get most recent bills to display on home page
      $scope.x = 4;
      $scope.bills =[];
      $scope.view= 1;
      console.log("bills controller starting up");


        console.log("bills controller getting");
        $http({
          url: '/bills',
          method: 'GET',
          params: {
            num: $scope.x
          }
          }).then(
          function successCallback(response){
            $scope.bills = response.data;
            console.log(response.data);
            console.log("got bills");
            console.log("rootScope", $rootScope.bills);
          },
          function errorCallback(response){

            console.log(response);
          }


        );





   });

   app.controller('peopleCtrl', function($scope, $http, $window) {
      //get user location. display their local senators/reps
      $scope.x = 6;
   });

})(window.angular);

$(function() {
  //update();
});


function update() {
  $.post('/update-db', function(data, status) {
    console.log(data);
  });
}

function mems() {
  $.post('/party-distr', function(data, status) {
    console.log(data);
  });
}

function getBillTest() {
  $.post('/bill-contr', function(data, status) {
    console.log(data);
  });
}
