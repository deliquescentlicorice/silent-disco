/**
 * Created on 1/28/16
 */
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');


var MongoClient = require('mongodb');
var mongoose = require('mongoose');
var Admin = mongoose.mongo.Admin;

var localMongo = 'mongodb://localhost:27017/silentdisco';
mongoose.connect(localMongo);

var app = express();
var port = process.env.PORT || 3000;

var encoder = require('./controllers/encoder');
var binaryServer = require('binaryjs').BinaryServer;
var binarySocketHandler = require('./binarySockets.js');

var scAuth = require('./config/scAuth.js');
var passport = require('passport');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var SoundCloudStrategy = require('passport-soundcloud').Strategy;
var apiKeys = require('./config/apiKeys');

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

require('./routes.js')(app, express, scAuth.ensureAuth);

app.use(express.static(__dirname + '/../src'));

//broadcasting client
app.use("/broadcast", express.static(__dirname + '/../public'));

//listen API route
app.get('/stream/:id', encoder.listenHandler);

app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname + '/../src', 'index.html'));
});

var server = app.listen(port);

console.log('Listening on port:' + port);

var bServer = binaryServer({
  server: server
});

bServer.on('connection', binarySocketHandler.connect);

passport.use(new SoundCloudStrategy({
  clientID: apiKeys.clientID,
  clientSecret: apiKeys.clientSecret,
  callbackURL: "http://localhost:" + port + "/auth/soundcloud"
}, function(accessToken, refreshToken, profile, done) {
  scAuth.signup({profile: profile}, function (err, profile){
    console.log('done');
    return done(err, profile);
  });
  // controller.isUserInDb([unique identifier goes here], function (inDb){
  //   if(inDb){
  //     scAuth.login({profile: profile}, function (err, profile){
  //       return done(err, profile);
  //     });
  //   } else {
  //     scAuth.signup({profile: profile}, function (err, profile){
  //       return done(err, profile);
  //     });
  //   }
  // });
  }
));

module.exports = app;
