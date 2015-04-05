var express = require('express');
var router = express.Router();

/* GET user information. */
router.get('/', function(req, res, next) {

  function onReceiveItemGroups(itemgroups){
    var groups = [];
    for(var i=0, len=itemgroups['items'].length; i<len; ++i){
      groups.push(itemgroups['items'][i]['name']);
    }
    console.log(groups);
    res.render('itemgroups', { title: 'ItemGroups', itemgroups: groups });
  }

  var crest = require('../modules/crest/crest.js');
  crest.getItemGroups(onReceiveItemGroups);
  // res.send('so far so good');

});

module.exports = router;
