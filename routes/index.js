var express = require('express');
var router = express.Router();

var http = require('http');
var async = require('async');

function getWeather(city, callback){
  var options = {
    host: 'api.openweathermap.org',
    path: '/data/2.5/weather?q=' + city
  };
  http.request(options,
      function(weatherResponse){
        parseWeather(weatherResponse, callback);
      }).end();
}

function parseWeather(weatherResponse, callback) {
  var weatherData = '';
  weatherResponse.on('data', function (chunk) {
    weatherData += chunk;
  });
  weatherResponse.on('end', function () {
    var weatherObj = JSON.parse(weatherData);
    callback(weatherObj);
  });
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

  var output = {};
  async.parallel(
      [
          function getWeatherReport(onTaskDone){
            getWeather(encodeURIComponent("Hausen am Albis, CH"), function onWeatherReportReceived(weather){
              output.weather = weather;
              onTaskDone();
            });
          }
      ],
      function onDone(){
        res.render('index',
            { title: 'Express',
              user: req.session['name'],
              location: output.weather["name"],
              weather: output.weather['weather'][0]['description']
            });
      }
  )

  // myDb.doIt();
});

module.exports = router;
