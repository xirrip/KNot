var express = require('express');
var router = express.Router();

/* GET user information. */
router.get('/user', function(req, res, next) {
  console.log(req.params);
  var sess = req.session;

  if(sess.access_token){
    res.render('user', { user : sess.name });
  }
  else{
    res.redirect('/eve/login/');
  }
});

module.exports = router;
