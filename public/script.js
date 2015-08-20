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
  var users = [];

  socket.on('color', function(col){
    setColor(col);
  });

  socket.on('msg', function(msg, col, lat, lng){
    registerMsg(msg, col, lat, lng);
  });

  function sendMessage(){
    var btn = document.getElementById('send');
    var msg = document.getElementById('msg-input').value;
    if(msg !== ''){
      navigator.geolocation.getCurrentPosition(function(pos){
        var coords = pos.coords;
        socket.emit('msg', msg, color, coords.latitude, coords.longitude);
      });
    }
    document.getElementById('msg-input').value = '';
  };

  function setColor(col){
    color = col;
    document.getElementById('send').style.backgroundColor = "hsl("+color+",100%,50%)";
    //document.getElementById('send').style.boxShadow = "0 8px hsl("+color+",50%,50%)";
  }

  function registerMsg(msg, col, lat, lng){
    //Check if we have a user registered for this color
    if(users[col] === undefined){
      //We don't, add a new marker
      var marker = new google.maps.Marker({
        position: {lat: lat, lng: lng},
        map: map,
        animation: google.maps.Animation.DROP,
        icon: {
          fillColor: 'hsl('+col+', 100%, 50%)',
          fillOpacity: 1,
          path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
          scale: 5,
          strokeWeight: 1,
        }
      });
      var info = new google.maps.InfoWindow({
        content: '<div class="info"></div>',
      });
      marker.addListener('click', function(){
        marker.setAnimation(null);
        info.open(map, marker);
      });
      users[col] = {
        marker: marker,
        info: info,
      };
    }
    var user = users[col];
    //Move the marker
    user.marker.setPosition({lat: lat, lng: lng});
    //Put the message in the info window
    user.info.setContent(user.info.getContent().slice(0,-6) + '<p>'+msg+'</p></div>');
    //Bounce the marker (new message !)
    user.marker.setAnimation(google.maps.Animation.BOUNCE);
  }

  //Event binding on elements
  document.getElementById('send').addEventListener('click', sendMessage);
  document.getElementById('msg-input').addEventListener('keydown', function(event){
    if(event.keyCode === 13){
      document.getElementById('send').className = 'active';
      sendMessage();
    }
  });
  document.getElementById('msg-input').addEventListener('keyup', function(){
    document.getElementById('send').className = '';
  });
}
