var express = require('express');
var router = express.Router();

/* GET user information. */
router.get('/user/:userid', function(req, res, next) {
  console.log(req.params);
  if(req.params['userid']){
    res.send('responding to ' + req.params['userid'] + " with a resource...");
  }
  else{
    res.send('respond with a resource');
  }
});

module.exports = router;
