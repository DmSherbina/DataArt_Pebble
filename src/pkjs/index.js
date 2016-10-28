// PebbleKit JS (pkjs)

var myAPIKey = 'db6e8b809ff42855de357c37716aec64';


Pebble.on('message', function(event) {
  // Get the message that was passed
  var message = event.data;

  if (message.fetch) {
    navigator.geolocation.getCurrentPosition(function(pos) {
      
//       var url = "http://api.openweathermap.org/data/2.5/find/city?cnt=1" +
//       "&lat=" + pos.coords.latitude +
//       "&lon=" + pos.coords.longitude +
//       '&appid=' + myAPIKey;
      
      var url = 'http://api.openweathermap.org/data/2.5/weather' +
              '?lat=' + pos.coords.latitude +
              '&lon=' + pos.coords.longitude +
              '&appid=' + myAPIKey;

      request(url, 'GET', function(respText) {
        var weatherData = JSON.parse(respText);

        //Sent message to rocky 
        Pebble.postMessage({
          'weather': {
            // Convert from Kelvin
            'celcius': Math.round(weatherData.main.temp - 273.15),
            'fahrenheit': Math.round((weatherData.main.temp - 273.15) * 9 / 5 + 32),
            'desc': weatherData.weather[0].main
          }
        });
      });
    }, function(err) {
      console.error('Error getting location');
    },
    { timeout: 15000, maximumAge: 60000 });
  }
});

function request(url, type, callback) {
  var xhr = new XMLHttpRequest();
  xhr.onload = function (e) {
    // HTTP 4xx-5xx are errors:
    if (xhr.status >= 400 && xhr.status < 600) {
      console.error('Request failed with HTTP status ' + xhr.status + ', body: ' + this.responseText);
      return;
    }
    callback(this.responseText);
  };
  xhr.open(type, url);
  xhr.send();
}