var express = require('express');
var router = express.Router();

/* GET users listing. */
// Careful: if routed as get -> needs correct url, if "use"d it needs '/' url
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
