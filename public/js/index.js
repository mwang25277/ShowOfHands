(function(angular) {
  'use strict';
  var app = angular.module('homeApp', []);
  app.controller('billsCtrl', function($scope, $rootScope, $http, $window) {
    //get most recent bills to display on home page
    $scope.x = 4;
    $scope.bills = [];
    $scope.view = 1;
    console.log("bills controller starting up");
    console.log("bills controller getting");
    $http({
      url: '/bills',
      method: 'GET',
      params: {
        num: $scope.x
      }
    }).then(function successCallback(response) {
      $scope.bills = response.data;
      console.log(response.data);
      console.log("got bills");
      console.log("rootScope", $rootScope.bills);
    }, function errorCallback(response) {
      console.log(response);
    });
    // $scope.loadPage = function(billID) {
    //   console.log(billID);
    //   $http({
    //     url: '/getPage',
    //     method: 'GET',
    //     params: {
    //       id: billID
    //     }
    //   }).then(function successCallback(response) {
    //     console.log(response.data);
    //     window.location.href = (response.data);
    //   });
    // };
  });

  app.controller('peopleCtrl', function($scope, $http, $window) {
    var Geo = {};
    $scope.state;
    $scope.members = [];
    $scope.senators = [];
    $scope.reps = [];
    $scope.num = 2;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, error);
    } else {
      alert("Geolocation is not supported");
    }

    function success(position) {
      var found = false;
      var lat = position.coords.latitude;
      var lng = position.coords.longitude;
      var latlng = new google.maps.LatLng(lat, lng);
      var geocoder = new google.maps.Geocoder();
      geocoder.geocode({
        'latLng': latlng
      }, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          if (results[1]) {
            for (var ac = 0; ac < results[0].address_components.length; ac++) {
              var component = results[0].address_components[ac];
              for (var i = 0; i < component.types.length; i++) {
                if (component.types[0] == "administrative_area_level_1") {
                  var state = component.short_name;
                  $scope.state = state;
                  found = true;
                  break;
                }
              }
              if (found) {
                break;
              }
            }
          }
        }
        console.log($scope.state);
        $http({
          url: '/get-members',
          method: 'GET',
          params: {
            state: $scope.state
          }
        }).then(function successCallback(response) {
          $scope.members = response.data;
          for (var i = 0; i < $scope.members.length; i++) {
            if ($scope.members[i].chamber == "senate") {
              $scope.senators.push($scope.members[i]);
            } else {
              $scope.reps.push($scope.members[i]);
            }
          }
          console.log($scope.senators);
        }, function errorCallback(respones) {
          console.log(response);
        });
      })
    }

    function error() {
      console.log("no geolocation!");
    }
    $scope.x = 6;
  });
})(window.angular);

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

function getImages() {
  $.post('/get-images', function(data, status) {
    console.log(data);
  });
}