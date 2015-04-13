var express = require('express');
var router = express.Router();
var querystring = require('querystring');
var https = require('https');
var crest = require('../modules/crest/crest.js');

var async = require('async');

router.get('/skunkonline/login/sse', function(req, res, next) {
  console.log("Authenticated with token: " + req.query['code'] + " and state: " + req.query['state']);

  function getAccessToken(callback){
    if(req.query['code']){
      var authString = new Buffer('d43424f9f0574f178654d9e4ab008576' + ':' + 'DsZjeIGMo3Xh7TQcbMqTu3QXPXRd64qtILSh74VW').toString('base64');
      console.log('auth = ' + authString);

      var post_options = {
        host: 'login-tq.eveonline.com',
        path: '/oauth/token',
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + authString,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      };

      // Set up the request
      var post_req = https.request(post_options, function(post_res) {
        // post_res.setEncoding('utf8');
        var loginData = '';
        post_res.on('data', function (chunk) {
          loginData += chunk;
        });
        post_res.on('end', function () {
          console.log('sso post completed: ' + loginData);
          var loginObj = JSON.parse(loginData)

          var sess = req.session;
          sess.access_token = loginObj['access_token'];

          console.log('access object stored.');

          callback();
        });
      });

      // post the data
      var post_data = querystring.stringify({ 'grant_type' : 'authorization_code', 'code' : req.query['code']});
      console.log('writing post: ' + post_data);
      post_req.write(post_data);
      post_req.end();
    }
  }

  function getCharacterFromToken(callback){
    var sess = req.session;

    var options = {
      host : 'login.eveonline.com',
      path : '/oauth/verify/',
      headers: {
        'Authorization' : 'Bearer ' + sess.access_token
      }
    };
    https.request(options, function parseOrders(crestResponse){
      console.log("Login verification:");
      var crestData = '';
      crestResponse.on('data', function (chunk) {
        crestData += chunk;
      });
      crestResponse.on('end', function () {
        var parsedData = JSON.parse(crestData);
        if(!parsedData['exceptionType']){
          console.log(parsedData);
          req.session.name = parsedData.CharacterName;
          callback();
        }
      });
    }).end();
  }

  async.series([
    getAccessToken,
    getCharacterFromToken
    ],
    function(err, results){
      console.log('finally redirecting to /user');
      res.redirect('/user');
    });
});

module.exports = router;
