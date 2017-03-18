(function(angular) {
   'use strict';
   var app = angular.module('billsApp', []);
   app.controller('billsCtrl', function($scope, $http, $window) {
      //used to display bills onto page
      $scope.x = 5;
   });

})(window.angular);