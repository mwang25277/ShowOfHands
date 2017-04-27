(function(angular) {
   'use strict';
   var app = angular.module('adminApp', ['nvd3']);
   app.controller('adminCtrl', function($scope, $http, $window) {
    $scope.updateDB = function() {
      $.post('/update-db', function(data, status) {
        console.log(data);
    });
    }

})(window.angular);