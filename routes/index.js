var express = require('express');
var router = express.Router();

var http = require('http');

function getWeather(city, res){
  var options = {
    host: 'api.openweathermap.org',
    path: '/data/2.5/weather?q=' + city
  };
  http.request(options,
      function(weatherResponse){
        parseWeather(weatherResponse, res);
      }).end();
}

function parseWeather(weatherResponse, res) {
  var weatherData = '';
  weatherResponse.on('data', function (chunk) {
    weatherData += chunk;
  });
  weatherResponse.on('end', function () {
    sendResponse(weatherData, res);
  });
}

function sendResponse(weatherData, res){
  console.log(weatherData);
  var weatherObj = JSON.parse(weatherData);
  res.render('index', { title: 'Express', location: weatherObj["name"], weather: weatherObj['weather'][0]['description'] });
}
var MongoClient = require('mongodb').MongoClient;

var myDb = {
  doIt: function() {
    // Open the connection to the server
    MongoClient.connect("mongodb://localhost:27017/KNot", {native_parser: true}, myDb.onConnected);
  },
  onConnected: function(err, db){
    if (err) {
      console.log("Connection Failed Via Client Object.");
    } else {
      console.log("Connected Via Client Object connect . . .");
      db.authenticate("KNot", "toNK", function(err, result){
        myDb.onAuthenticated(err, result, db);
      });
    }
  },
  onAuthenticated: function(err, result, db){
    if (err) {
      console.log("authentication failed!");
    }
    else {
      console.log("authenticated");

      var collection = db.collection("elements");
      addObject(collection, {name:"srzchx", value:1000});
      collection.stats(function (err, stats) {
        if(err){
          console.log("Could not get stats.");
        }
        else {
          console.log(stats);
        }
        db.close();
      });
    }
  }
}

function addObject(collection, object){
  collection.insert(object, function(err, collection){
    if(err){
      console.log("Could not insert object!");
    }
  });
}

/* GET home page. */
router.get('/', function(req, res, next) {

  // myDb.doIt();
  getWeather(encodeURIComponent("Hausen am Albis, CH"), res);
});

module.exports = router;
