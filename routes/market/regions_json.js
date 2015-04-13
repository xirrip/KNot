
var express = require('express');
var router = express.Router();
var crest = require('../../modules/crest/crest.js');

/* GET user information. */
router.get('/', function(req, res, next) {
    console.log('accessing regions json');
    var sess = req.session;

    if(sess.access_token){
        crest.getCrestElement(['regions'], sess.access_token, function(regions){
            console.log("sending regions data!");
            console.log(regions.items);

            res.send(regions.items);
        })
    }
    else{
        res.redirect('/eve/login/');
    }
});

module.exports = router;
