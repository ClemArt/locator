window.onload = function(){
  if(navigator.geolocation){
    loadScript();
  }
};

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

  socket.on('color', function(col){
    setColor(col);
  });

  socket.on('msg', function(msg, lat, lng){
    var info = new google.maps.InfoWindow({
      content: msg,
      position: {lat: lat, lng: lng},
    });
    info.open(map);
  });

  function sendMessage(){
    var msg = document.getElementById('msg-input').value;
    if(msg !== ''){
      navigator.geolocation.getCurrentPosition(function(pos){
        var coords = pos.coords;
        socket.emit('msg', msg, coords.latitude, coords.longitude);
      });
    }
    document.getElementById('msg-input').value = '';
  };

  function setColor(col){
    color = col;
    document.getElementById('send').style.backgroundColor = "hsl("+color+",100%,50%)";
  }

  //Event binding on elements
  document.getElementById('send').addEventListener('click', sendMessage);
}
