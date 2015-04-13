
var express = require('express');
var router = express.Router();

/* GET user information. */
router.get('/', function(req, res, next) {
    console.log('in market route.');
    var sess = req.session;

    if(sess.access_token){
        res.render('market/market', { title : 'Market Information' });
    }
    else{
        res.redirect('/eve/login/');
    }
});

module.exports = router;
