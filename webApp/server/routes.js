var streamsController = require('./streamsController');
var usersController = require('./usersController');
var path = require('path');
var express = require('express');
var passport = require('passport');

module.exports = function(app, express, ensureAuth) {
  app.post('/api/:stream', streamsController.createStream);
  app.get('/api/listen/:stream', streamsController.getStream);
  app.put('/api/listen/:stream', streamsController.upHeart);
  app.put('/api/broadcast/:stream', streamsController.modifyStreamDetails);
  app.get('/api/streams', streamsController.getAllStreams);

  app.get('/broadcast', function(req, res) {
    res.sendFile(path.join(__dirname + '/../public', 'index.html'));
  });

  app.get('/auth/soundcloud', function(req, res) {
    // on success, closes out the pop-up
    // res.redirect('/broadcast/setup')
    res.sendFile(path.join(__dirname + '/../public', 'success.html'));
  });

  app.get('/user', ensureAuth, function (req, res){
    res.json(req.user);
  });
};
