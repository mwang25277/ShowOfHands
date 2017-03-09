// Map from https://github.com/cody1213/twism

// Dictionary of state abbrevisations to names
var states = {'AL': 'Alabama','AK': 'Alaska','AZ': 'Arizona','AR': 'Arkansas','CA': 'California','CO': 'Colorado','CT': 'Connecticut','DE': 'Delaware','FL': 'Florida','GA': 'Georgia','HI': 'Hawaii','ID': 'Idaho','IL': 'Illinois','IN': 'Indiana','IA': 'Iowa','KS': 'Kansas','KY': 'Kentucky','KY': 'Kentucky','LA': 'Louisiana','ME': 'Maine','MD': 'Maryland','MA': 'Massachusetts','MI': 'Michigan','MN': 'Minnesota','MS': 'Mississippi','MO': 'Missouri','MT': 'Montana','NE': 'Nebraska','NV': 'Nevada','NH': 'New Hampshire','NJ': 'New Jersey','NM': 'New Mexico','NY': 'New York','NC': 'North Carolina','ND': 'North Dakota','OH': 'Ohio','OK': 'Oklahoma','OR': 'Oregon','PA': 'Pennsylvania','RI': 'Rhode Island','SC': 'South Carolina','SD': 'South Dakota','TN': 'Tennessee','TX': 'Texas','UT': 'Utah','VT': 'Vermont','VA': 'Virginia','WA': 'Washington','WV': 'West Virginia','WI': 'Wisconsin','WY': 'Wyoming'};

// how many house representatives there are
var representatives = {'AL' : 7,'AK': 1, 'AZ': 9, 'AR': 4, 'CA': 53,'CO': 7,'CT': 5, 'DE': 1,'FL': 27, 'GA' : 14, 'HI' : 2, 'ID': 2, 'IL' : 18, 'IN': 9, 'IA' : 4, 'KS' : 4, 'KY' : 6, 'LA' : 6, 'ME': 2, 'MD': 8, 'MA': 9, 'MI': 14,'MN' : 8,'MS' : 4, 'MO' : 8, "MT" : 1, 'NE': 3, 'NV':  4,'NH': 2, 'NJ': 12, 'NM': 3,'NY' : 27, 'NC' : 13, 'ND' :1, 'OH': 16,'OK' : 5, 'OR' : 5, 'PA' : 18,'RI': 2,'SC' : 7,'SD': 1, 'TN': 9, 'TX': 36, 'UT' : 4, 'VT' : 1, 'VA' : 11, 'WA': 10, 'WV' : 3, 'WI': 8, 'WY': 1};

// senate or house
var choice = "";

// take state and house/senate and loads congressmen
function loadPeople(state, choice) {
  // Clear bios in case they already loaded some people
  $("#bios").empty();

  var data = [];
  // phony data
  data.push({
    'img': 'http://placehold.it/350',
    'name': (choice==="senate") ? "Senator 1" : "Representative 1",
    'state': state,
    'site': '#'
  });
  data.push({
    'img': 'http://placehold.it/350',
    'name': (choice==="senate") ? "Senator 2" : "Representative 2",
    'state': state,
    'site': '#'
  });
  if (choice != "senate"){
      for (var i = 3; i <= representatives[state]; i++){

        data.push({
          'img': 'http://placehold.it/350',
          'name':  "Representative  "+ i ,
          'state': state,
          'site': '#'
        });


      }
      // end phony data
  }

  for (var i in data) {
    person = data[i];
    var str = "<div class='card text-center col-12 col-sm-6 col-md-3'>";
    str += "<img class='round img-fluid card-img-top' src='" + person.img + "'>";
    str += "<div class='card-block'>";
    str += "<h4 class='card-title'>" + person.name + "</h4>";
    str += "<p class='card-text'>" + states[person.state] + "</p>";
    str += "<a href='" + person.site + "' class='btn btn-primary'>Website</a>";
    str += "</div></div>";
    $("#bios").append(str);
  }

  $("#bios").show();
}

// Scrolls to specified div
$.fn.scrollView = function () {
  return this.each(function () {
    $('html, body').animate({
        scrollTop: $(this).offset().top
    }, 1000);
  });
}

// Create and then hide map
$(document).ready(function() {
  $('#map').twism("create", 
  {
    map: "usa",
    border: "black",
    borderWidth: 0.3, // Looks worse the smaller it gets?
    color: "#f7f7f7",
    backgroundColor: "transparent",
    hoverColor: "#fff",
    hoverBorder: "red",
    territories: false,
    click: function(state) {
      loadPeople(state, choice);
      $("#bios").scrollView();
    }
  });
  $("#map").hide();
});

// Links hide options and show map
$("#senateLink").on("click", function() {
  $(".row").toggle();
  $("#map").show();
  choice = "senate";
});

$("#houseLink").on("click", function() {
  $(".row").toggle();
  $("#map").show();
  choice = "house";
});