var streamsController = require('./controllers/streamsController');
var usersController = require('./controllers/usersController');
var encoder = require('./controllers/encoder');
var path = require('path');
var express = require('express');
var passport = require('passport');

module.exports = function(app, express, ensureAuth) {
  app.post('/api/stream', streamsController.createStream);

  app.get('/api/stream/:stream', streamsController.getStream);
  app.put('/api/stream/:stream', streamsController.upHeart);
  app.put('/api/stream/status/:stream', streamsController.toggleStream);
  app.put('/api/listener/:stream', streamsController.addListener);
  app.put('/api/nolistener/:stream', streamsController.removeListener);

  app.put('/api/deejay/:stream', streamsController.modifyStreamDetails);

  app.get('/api/streams', streamsController.getAllStreams);

  app.get('/api/soundcloud/:user', usersController.getUserSoundcloudID);
  
  app.get('/api/user/:user', usersController.getUserWithStreams);
  app.put('/api/user/:user', usersController.modifyUser);

  app.get('/stream/:id', encoder.listenHandler);
  app.get('/user', ensureAuth, function(req, res) {
    res.json(req.user);
  });

  app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
  });

  app.get('/auth/soundcloud', passport.authenticate('soundcloud', {
    failureRedirect: '/'
  }), function(req, res) {
    // on success, closes out the pop-up
    // res.redirect('/broadcast/setup')
    res.sendFile(path.join(__dirname + '/../public', 'success.html'));
  });

  app.get('*', function(req, res) {
    console.log('hitting the catchall route');
    res.sendFile(path.join(__dirname + '/../web_client', 'index.html'));
  });
};
