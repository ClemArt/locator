window.onload = loadScript;

function loadScript() {
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyD1GV7nRU-6pq2_DZJklc2BXRSrwsy2O5E&callback=initialize';
  document.body.appendChild(script);
}

function initialize() {
  var mapOptions = {
    zoom: 8,
    center: new google.maps.LatLng(43.4331, 6.7372)
  };

  var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

  var socket = io();
  var color = 0;

  socket.on('color', function(color){
    setColor(color);
  });
}

function setColor(color){

}
