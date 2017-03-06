jQuery(document).ready(function () {
  jQuery('#map').vectorMap({
    map: 'usa_en',
    enableZoom: false,
    showTooltip: true,
    selectedColor: null,
    hoverColor: '#000',
    colors: {
      mo: '#C9DFAF',
      fl: '#C9DFAF',
      or: '#C9DFAF'
    },
    onRegionClick: function(event, code, region){
      event.preventDefault();
      console.log(event, code, region);
    }
  });
});

$("#map").hide();