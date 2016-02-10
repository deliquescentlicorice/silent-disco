/**
 * Created on 1/28/16
 */

// general dependencies
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var scAuth = require('./config/scAuth.js');
var passport = require('passport');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var SoundCloudStrategy = require('passport-soundcloud').Strategy;
var apiKeys = require('./config/apiKeys');

// database
var MongoClient = require('mongodb');
var mongoose = require('mongoose');
var Admin = mongoose.mongo.Admin;
var localMongo = 'mongodb://localhost:27017/silentdisco';
mongoose.connect(localMongo);

// server setup
var app = express();
var port = process.env.PORT || 3000;

// var binarySocketHandler = require('./binarySockets.js');

// dev stuff
var version = process.env.version || 'DEV';
if (version === 'DEV') {
  var webpack = require('webpack');
  var config = require('../webpack.config.dev');
  var compiler = webpack(config);

  app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath
  }));

  app.use(require('webpack-hot-middleware')(compiler));
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

// auth + session
app.use(cookieParser());
app.use(session({ secret: 'disco' , resave: true, saveUninitialized: false}));
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(obj, done) {
  done(null, obj);
});
passport.use(new SoundCloudStrategy({
  clientID: apiKeys.clientID,
  clientSecret: apiKeys.clientSecret,
  callbackURL: "http://localhost:" + port + "/auth/soundcloud"
}, function(accessToken, refreshToken, profile, done) {
  scAuth.signup({profile: profile}, function (err, result){
    console.log('done', result);
    return done(err, result);
  });
  }
));

// routes
app.use(express.static(__dirname + '/../src'));
require('./routes.js')(app, express, scAuth.ensureAuth);

// server startup
var server = app.listen(port);
console.log('Listening on port:' + port);

var binarySockets = require('./binarySockets');
binarySockets(server);

module.exports = app;
