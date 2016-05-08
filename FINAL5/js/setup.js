var CARTOCSS = [
  'Map {',
'-torque-frame-count:256;',
'-torque-animation-duration:20;',
'-torque-time-attribute:"event_date";',
'-torque-aggregation-function:"count(cartodb_id)";',
'-torque-resolution:2;',
'-torque-data-aggregation:linear;',
'}',

'#aviationdata{',
  'comp-op: lighter;',
  'marker-fill-opacity: 0.9;',
  'marker-line-color: #FFF;',
  'marker-line-width: 0;',
  'marker-line-opacity: 1;',
  'marker-type: ellipse;',
  'marker-width: 10;',
  'marker-fill: #F11810;',
'}',
'#aviationdata[frame-offset=1] {',
 'marker-width:12;',
 'marker-fill-opacity:0.45;' ,
'}',
'#aviationdata[frame-offset=2] {',
 'marker-width:14;',
 'marker-fill-opacity:0.225;',
'}',
'#aviationdata[frame-offset=3] {',
 'marker-width:16;',
 'marker-fill-opacity:0.15;',
'}',
'#aviationdata[frame-offset=4] {',
 'marker-width:18;',
 'marker-fill-opacity:0.1125;',
'}',
'#aviationdata[frame-offset=5] {',
 'marker-width:20;',
 'marker-fill-opacity:0.09;',
'}',
'#aviationdata[frame-offset=6] {',
' marker-width:22;',
 'marker-fill-opacity:0.075;',
'}',
'#aviationdata[frame-offset=7] {',
 'marker-width:24;',
 'marker-fill-opacity:0.0642857142857143;',
'}',
'#aviationdata[frame-offset=8] {',
 'marker-width:26;',
 'marker-fill-opacity:0.05625;',
'}',
'#aviationdata[frame-offset=9] {',
 'marker-width:28;',
 'marker-fill-opacity:0.05;',
'}',
'#aviationdata[frame-offset=10] {',
 'marker-width:30;',
 'marker-fill-opacity:0.045;',
'}',
'#aviationdata[frame-offset=11] {',
 'marker-width:32;',
 'marker-fill-opacity:0.04090909090909091;',
'}',
'#aviationdata[frame-offset=12] {',
 'marker-width:34;',
 'marker-fill-opacity:0.0375;',
'}',
'#aviationdata[frame-offset=13] {',
 'marker-width:36;',
 'marker-fill-opacity:0.03461538461538462;',
'}',
'#aviationdata[frame-offset=14] {',
 'marker-width:38;',
 'marker-fill-opacity:0.03214285714285715;',
'}',
'#aviationdata[frame-offset=15] {',
 'marker-width:40;',
 'marker-fill-opacity:0.030000000000000002;',
'}',
'#aviationdata[frame-offset=16] {',
 'marker-width:42;',
 'marker-fill-opacity:0.028125;',
'}',
'#aviationdata[frame-offset=17] {',
 'marker-width:44;',
 'marker-fill-opacity:0.026470588235294117;',
'}',
'#aviationdata[frame-offset=18] {',
 'marker-width:46;',
 'marker-fill-opacity:0.025;',
'}',
'#aviationdata[frame-offset=19] {',
 'marker-width:48;',
 'marker-fill-opacity:0.02368421052631579;',
'}',
'#aviationdata[frame-offset=20] {',
 'marker-width:50;',
 'marker-fill-opacity:0.0225;',
"}",

].join('\n');


$('.sidebar').toggle();
$('#submit').toggle();

 var map =L.map('map', {
   center:[40.75583970971843,-73.795166015625],
   zoom:4,
   zoomControl:false,
 });

 var CartoDB_DarkMatter = L.tileLayer('http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', {
 	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
 	subdomains: 'abcd',
   ext: 'png'
 }).addTo(map);

 var torqueLayer = new L.TorqueLayer({
   user: 'evanoj',
   cartocss: CARTOCSS
 });
 torqueLayer.addTo(map);



//====
//global variables
var APIKEY = "bd60730eebf9a2d83b7907caea65e718283f0b79";
var cartoDBUserName = "evanoj";

var activeMap;
var userOrigin;
var userDestination;

// get user location??
var homeQuery = "SELECT * FROM global_airline_routes WHERE city='Chicago'";
$.getJSON("https://"+cartoDBUserName+".cartodb.com/api/v2/sql?format=GeoJSON&q="+homeQuery, function(data) {
  activeMap = L.geoJson(data, {
    fillColor: "#B56205",
    color: "#f03b20",
    opacity: 0.1,
    weight: 4.0,
  }).addTo(map);
});




var inputs = $.ajax('https://evanoj.cartodb.com/api/v2/sql/?q=' + "SELECT city FROM global_airline_routes").done(function(results) {
  results = _.flatten(_.map(results.rows,_.values));
  results = _.uniq(results);
  $(function() {
  $( "#originInput" ).autocomplete({
       source: results,
       select: function(event,ui) {
         userOrigin = ui.item.label;
         $.ajax('https://evanoj.cartodb.com/api/v2/sql/?q=' + "SELECT city2 FROM global_airline_routes WHERE city='"+userOrigin+"'").done(function(results2) {
           results2 = _.flatten(_.map(results2.rows,_.values));
           results2 = _.uniq(results2);
           $(function() {
             $( "#destInput" ).autocomplete({
               source: results2,
               select: function(event,ui) {
               userDestination=ui.item.label;
               $('#submit').toggle();
             }
          });
        });
       });
      }
     });
   });
  });


//=====
var blinkPlay = function() {
  $('#play').animate({
      opacity: '0'
  }, function(){
      $(this).animate({
          opacity: '1'
      }, blinkPlay);
  });
};



$("#submit").click(function(){
  map.removeLayer(activeMap);
  torqueLayer.show();
    $('.welcome').toggle(1000, function(){
    console.log(userOrigin);
    console.log(userDestination);
    var userQuery = "SELECT * FROM global_airline_routes WHERE city='"+userOrigin+"' AND city2='"+userDestination+"'";
     $.getJSON("https://"+cartoDBUserName+".cartodb.com/api/v2/sql?format=GeoJSON&q="+userQuery, function(data) {
         activeMap = L.geoJson(data, {
           fillColor: "#B56205",
           color: "#f03b20",
           fillOpacity: 0.8,
           weight: 1.5
         }).addTo(map);
       map.fitBounds(activeMap.getBounds());
     });
     $('.sidebar').toggle();
     $('#flightInfo').text('Flight from '+userOrigin +' to '+userDestination);
     blinkPlay();
     });
});

$('#play').click(function(){
  $('#play').stop();
  torqueLayer.stop();
  torqueLayer.setSQL("SELECT c.* FROM global_airline_routes r JOIN aviationdata c ON ST_DWithin(r.the_geom_webmercator,c.the_geom_webmercator,100000)WHERE r.city='"+userOrigin+"' AND r.city2='"+userDestination+"'");
  torqueLayer.play();
});


// couldnt get the time slider or timer to work
// torqueLayer.on('change:time', function(d) {
//   var time = $('#flightInfo').text('Time - ' + moment(d.time).format('HH:mm'));
// });
//===reset page//

$('#reset').click(function(){
  torqueLayer.hide();
  torqueLayer.setSQL("");
  map.removeLayer(activeMap);
  $('#submit').toggle();
  $('#originInput').val("");
  $('#destInput').val("");
  $('.sidebar').toggle(function(){
    $('.welcome').toggle(function(){
      map.setView([40.75583970971843,-73.795166015625],4);
      $.getJSON("https://"+cartoDBUserName+".cartodb.com/api/v2/sql?format=GeoJSON&q="+homeQuery, function(data) {
        activeMap = L.geoJson(data, {
          fillColor: "#B56205",
          color: "#f03b20",
          opacity: 0.1,
          weight: 4.0,
        }).addTo(map);
      });
    });
  });
});
