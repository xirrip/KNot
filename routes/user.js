var express = require('express');
var router = express.Router();

/* GET user information. */
router.get('/user', function(req, res, next) {
  console.log(req.params);
  var sess = req.session;

  if(sess.access_token){
    res.send('We do have an authenticated user with access token here! Hip hip... hooray!');
  }
  else{
    res.send('Sorry, we do not know you');
    // res.redirect(login);
  }
});

module.exports = router;
