(function(angular) {
   'use strict';
   var app = angular.module('homeApp', []);
   app.controller('billsCtrl', function($scope, $http, $window) {
      //get most recent bills to display on home page
   });

   app.controller('peopleCtrl', function($scope, $http, $window) {
      //get user location. display their local senators/reps
   });

})(window.angular);