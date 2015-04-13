
var express = require('express');
var router = express.Router();
var crest = require('../../modules/crest/crest.js');

/* GET user information. */
router.get('/', function(req, res, next) {
    console.log('accessing groups json');
    var sess = req.session;

    if(sess.access_token){
        crest.getCrestElement(['marketGroups'], sess.access_token, function(groups){
            console.log("sending market group data!");
            // console.log(groups.items);
            var filteredGroups = [];
            for(i=0; i<groups.items.length; ++i){
                var g = groups.items[i];
                if(!g.parentGroup){
                    filteredGroups.push(g);
                }
            }
            res.send(filteredGroups);
        })
    }
    else{
        res.redirect('/eve/login/');
    }
});

module.exports = router;
