$(document).ready(function() {
  $('#map').twism("create", 
  {
    map: "usa",
    border: "red"
  });
  $("#map").hide();
});

$("#senateLink").on("click", function() {
  $(".row").toggle();
  $("#map").show();
});