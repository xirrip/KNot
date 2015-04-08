var express = require('express');
var session = require('express-session');

var router = express.Router();

/* GET user information. */
router.get('/', function(req, res, next) {

  function onReceiveItemGroups(itemgroups){
    var groups = [];
    for(var i=0, len=itemgroups['items'].length; i<len; ++i){
      groups.push(itemgroups['items'][i]['name']);
    }
    // console.log(groups);
    res.render('itemgroups', { title: 'ItemGroups', itemgroups: groups });
  }

  function onReceiveBuyOrders(orders){
    console.log('orders: ' + orders);
  }

  function onReceiveCharacter(character){
    req.session['name'] = character['CharacterName'];
    console.log('Hello ' + req.session['name']);
  }

  var crest = require('../modules/crest/crest.js');
  crest.getCharacterFromToken(req.session, onReceiveCharacter);

  crest.getBuyOrders(req.session, '10000042', onReceiveBuyOrders);

  crest.getItemGroups(req.session, onReceiveItemGroups);
  // res.send('so far so good');


});

module.exports = router;
