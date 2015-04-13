
var express = require('express');
var session = require('express-session');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var user = require('./routes/user');
var itemgroups = require('./routes/itemgroups');
var regions = require('./routes/regions');
var market_route = require('./routes/market/market_route');
var regions_json = require('./routes/market/regions_json');
var groups_json = require('./routes/market/groups_json');

var eve_sse_login = require('./routes/eve_sse_login');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session( { secret : 'VeryPrivateIndeed' } ));
app.use(express.static(path.join(__dirname, 'public')));

// app.route('/user/:userid').get(user);
app.route('/user').get(user);

app.route('/eve/login').get(function(req, res){
  res.redirect('https://login.eveonline.com/oauth/authorize/?response_type=code&redirect_uri=https://localhost:3000/skunkonline/login/sse&client_id=d43424f9f0574f178654d9e4ab008576&scope=publicData&state=uniquestate123')
});
app.route('/logout').get(function(req, res){
  delete req.session.name;
  delete req.session.access_token;
  res.redirect('/');
})
app.route('/skunkonline/login/sse').get(eve_sse_login);

// app.route('/users').get(users);
app.use('/', routes);
app.use('/itemGroups', itemgroups);
app.use('/regions', regions);
app.use('/market', market_route);
app.use('/data/regions', regions_json);
app.use('/data/groups', groups_json);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
