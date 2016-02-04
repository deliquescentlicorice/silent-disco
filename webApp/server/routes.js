var streamsController = require('./controllers/streamsController');
var usersController = require('./controllers/usersController');
var path = require('path');
var express = require('express');
var passport = require('passport');

module.exports = function(app, express, ensureAuth) {
  app.post('/api/stream', streamsController.createStream);

  app.get('/api/stream/:stream', streamsController.getStream);
  app.put('/api/stream/:stream', streamsController.upHeart);
  app.put('/api/listener/:stream', streamsController.addListener);
  app.put('api/nolistener/:stream', streamsController.removeListener);

  app.put('/api/deejay/:stream', streamsController.modifyStreamDetails);

  app.get('/api/streams', streamsController.getAllStreams);
  
  app.get('/api/user/:user', usersController.getUser);
  app.post('/api/users/:user', usersController.createUser);
  app.get('api/')
  app.get('/user', ensureAuth, function(req, res) {
    res.json(req.user);
  });

  app.get('/broadcast', function(req, res) {
    res.sendFile(path.join(__dirname + '/../public', 'index.html'));
  });

  app.get('/auth/soundcloud', passport.authenticate('soundcloud', {
    failureRedirect: '/'
  }), function(req, res) {
    // on success, closes out the pop-up
    // res.redirect('/broadcast/setup')
    res.sendFile(path.join(__dirname + '/../public', 'success.html'));
  });
};
