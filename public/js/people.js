// Map from https://github.com/cody1213/twism

// Dictionary of state abbrevisations to names
//var states = {'AL': 'Alabama','AK': 'Alaska','AZ': 'Arizona','AR': 'Arkansas','CA': 'California','CO': 'Colorado','CT': 'Connecticut','DE': 'Delaware','FL': 'Florida','GA': 'Georgia','HI': 'Hawaii','ID': 'Idaho','IL': 'Illinois','IN': 'Indiana','IA': 'Iowa','KS': 'Kansas','KY': 'Kentucky','KY': 'Kentucky','LA': 'Louisiana','ME': 'Maine','MD': 'Maryland','MA': 'Massachusetts','MI': 'Michigan','MN': 'Minnesota','MS': 'Mississippi','MO': 'Missouri','MT': 'Montana','NE': 'Nebraska','NV': 'Nevada','NH': 'New Hampshire','NJ': 'New Jersey','NM': 'New Mexico','NY': 'New York','NC': 'North Carolina','ND': 'North Dakota','OH': 'Ohio','OK': 'Oklahoma','OR': 'Oregon','PA': 'Pennsylvania','RI': 'Rhode Island','SC': 'South Carolina','SD': 'South Dakota','TN': 'Tennessee','TX': 'Texas','UT': 'Utah','VT': 'Vermont','VA': 'Virginia','WA': 'Washington','WV': 'West Virginia','WI': 'Wisconsin','WY': 'Wyoming'};

// how many house representatives there are
//var representatives = {'AL' : 7,'AK': 1, 'AZ': 9, 'AR': 4, 'CA': 53,'CO': 7,'CT': 5, 'DE': 1,'FL': 27, 'GA' : 14, 'HI' : 2, 'ID': 2, 'IL' : 18, 'IN': 9, 'IA' : 4, 'KS' : 4, 'KY' : 6, 'LA' : 6, 'ME': 2, 'MD': 8, 'MA': 9, 'MI': 14,'MN' : 8,'MS' : 4, 'MO' : 8, "MT" : 1, 'NE': 3, 'NV':  4,'NH': 2, 'NJ': 12, 'NM': 3,'NY' : 27, 'NC' : 13, 'ND' :1, 'OH': 16,'OK' : 5, 'OR' : 5, 'PA' : 18,'RI': 2,'SC' : 7,'SD': 1, 'TN': 9, 'TX': 36, 'UT' : 4, 'VT' : 1, 'VA' : 11, 'WA': 10, 'WV' : 3, 'WI': 8, 'WY': 1};

// senate or house
var choice = "";

var chosenState = "";

// Scrolls to specified div
$.fn.scrollView = function () {
    $('html, body').animate({
        scrollTop: $(this).offset().top + 'px'
    }, 'fast');
    return this;
};

(function(angular) {
   'use strict';
   var app = angular.module('peopleApp', []);
   app.controller('peopleCtrl', function($scope, $http, $window, $timeout) {
      $scope.state = "";
      $scope.choice = ""; //senate or house
      $scope.showMap = false;
      $scope.showRow = true;
      $scope.showBios = false;
      $scope.showLegisRow = true;
      $scope.showStateRow = false;
      $scope.data = []; //list of people

      //after user chooses which legislative body, show the map
      $scope.afterSelect = function(chamber) {
        //console.log(chamber);
        $scope.choice = chamber;
        $scope.showMap = true;
        $scope.showRow = false;
        $scope.showLegisRow = false;
        $scope.showStateRow = true;
      };

      //after user clicks a state, send post request, and load the reps from that state
      $scope.loadPeople = function(state) {
        $scope.state = state;
        if($scope.state != undefined) {
          var post = $http.post('/people', { chamber: $scope.choice, state: $scope.state }).then(function(data){
            // console.log(data);
            // console.log(status);
            $scope.data = data.data;
            $scope.showBios = true;
          });
        }
      }

      //resets the page
      $scope.backButton = function() {
        $scope.showMap = false;
        $scope.showRow = true;
        $scope.showBios = false;
        $scope.showLegisRow = true;
        $scope.showStateRow = false;
      }
      // Create and then hide map
      $('#map').twism("create", {
        map: "usa",
        border: "black",
        borderWidth: 0.3, // Looks worse the smaller it gets?
        color: "#f7f7f7",
        backgroundColor: "transparent",
        hoverColor: "#fff",
        hoverBorder: "red",
        territories: false,
        click: function(state) {
          $scope.loadPeople(state);
          // delete($scope.data);
          // $scope.data = [];
          //send post request and output people on response
          // //let data load before scrolling
          $timeout( function() {
            $("#bios").scrollView();
          },500);
        }
      });
  });

})(window.angular);