(function(angular) {
   'use strict';
   var app = angular.module('homeApp', []);
   app.controller('billsCtrl', function($scope, $http, $window) {
      //get most recent bills to display on home page
      $scope.x = 5;
   });

   app.controller('peopleCtrl', function($scope, $http, $window) {
      //get user location. display their local senators/reps
      $scope.x = 6;
   });

})(window.angular);


function update() {
  $.post('/update-db', function(data, status) {
    console.log(data);
  });
}
