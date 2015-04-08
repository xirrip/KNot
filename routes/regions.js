var express = require('express');
var session = require('express-session');

var router = express.Router();

/* GET user information. */
router.get('/', function(req, res, next) {

  function onReceiveRegions(regions){
    var groups = [];
    for(var i=0, len=regions['items'].length; i<len; ++i){
      groups.push(regions['items'][i]['name']);
    }
    // console.log(groups);
    res.render('regions', { title: 'Regions', regions: groups });
  }

  function onReceiveBuyOrders(buyOrders){
    console.log(buyOrders);
  }

  function onReceiveRegion(region){
    console.log(region);
    crest.getBuyOrders(req.session, region, 'Tritanium', onReceiveBuyOrders);
  }

  var crest = require('../modules/crest/crest.js');
  crest.getRegion(req.session, "Metropolis", onReceiveRegion);

  crest.getRegions(req.session, onReceiveRegions);
});

module.exports = router;
