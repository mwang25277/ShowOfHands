(function(angular) {
  'use strict';
  var app = angular.module('homeApp', []); //set app module
  app.controller('billsCtrl', function($scope, $rootScope, $http, $window) { //set controller
    //get most recent bills to display on home page
    $scope.x = 4;
    $scope.bills = [];
    $scope.view = 1;
    console.log("bills controller starting up");
    console.log("bills controller getting");
    $http({ //get bill information from server (from DB)
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
    $scope.loadPage = function(billID) {
      console.log(billID);
      $http({
        url: '/getPage',
        method: 'GET',
        params: {
          id: billID
        }
      }).then(function successCallback(response) {
        console.log(response.data);
        window.location.href = (response.data);
      });
    };
  });

  app.controller('peopleCtrl', function($scope, $http, $window) { //set controller
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
      //get client location
      var lat = position.coords.latitude;
      var lng = position.coords.longitude;
      var latlng = new google.maps.LatLng(lat, lng); //create new lat/lng object with client info
      var geocoder = new google.maps.Geocoder(); //create new geocoder object
      //get state from location
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
                  $scope.state = state; //set state
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
        $http({ //get member information from server (from DB)
          url: '/get-members',
          method: 'GET',
          params: {
            state: $scope.state
          }
        }).then(function successCallback(response) {
          $scope.members = response.data;
          for (var i = 0; i < $scope.members.length; i++) {
            //add member to their respective array
            if ($scope.members[i].chamber == "senate") {
              $scope.senators.push($scope.members[i]);
            } else {
              $scope.reps.push($scope.members[i]);
            }
          }
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

//update funtion to update DB without having to restart server (for testing)
function update(code) {
  if (code == "WebsciGroup3-Update-123") {
    $.post('/update-db', function(data, status) {
      console.log(data);
    });
  }
}

//Testing functions
// function mems() {
//   $.post('/party-distr', function(data, status) {
//     console.log(data);
//   });
// }
//
// function getBillTest() {
//   $.post('/bill-contr', function(data, status) {
//     console.log(data);
//   });
// }
//
// function getImages() {
//   $.post('/get-images', function(data, status) {
//     console.log(data);
//   });
// }
