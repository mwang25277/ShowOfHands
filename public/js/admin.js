(function(angular) {
   'use strict';
   var app = angular.module('adminApp', []);
   app.controller('adminCtrl', function($scope, $http, $window) {
      $scope.updateDB = function() {
        console.log("Update...");
        $.post('/update-db', function(data, status) {
          console.log(data);
        });
      };
    });

})(window.angular);