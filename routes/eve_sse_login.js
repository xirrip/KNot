var express = require('express');
var session = require('express-session');
var router = express.Router();
var querystring = require('querystring');
var https = require('https');

/* GET user information. */
router.get('/skunkonline/login/sse', function(req, res, next) {
  console.log("Authenticated with token: " + req.query['code'] + " and state: " + req.query['state']);

  if(req.query['code']){
    var authString = new Buffer('d43424f9f0574f178654d9e4ab008576' + ':' + 'DsZjeIGMo3Xh7TQcbMqTu3QXPXRd64qtILSh74VW').toString('base64');
    console.log('auth = ' + authString);

    // should get the login from public crest actually!
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
        console.log('sse post completed: ' + loginData);
        var loginObj = JSON.parse(loginData)
        var sess = req.session;
        sess.access_token = loginObj['access_token'];
        res.redirect('/user');
      });
    });

    // post the data
    var post_data = querystring.stringify({ 'grant_type' : 'authorization_code', 'code' : req.query['code']});
    console.log('writing post: ' + post_data);
    post_req.write(post_data);
    post_req.end();
  }
});

module.exports = router;
