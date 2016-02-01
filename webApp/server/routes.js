var streamsController = require('./controllers/streamsController');
var usersController = require('./controllers/usersController');
var path = require('path');
var express = require('express');

module.exports = function(app, express) {


    app.post('/api/:stream', streamsController.createStream);
    app.get('/api/listen/:stream', streamsController.getStream);
    app.put('/api/listen/:stream', streamsController.upHeart);
    app.put('/api/broadcast/:stream', streamsController.modifyStreamDetails);
    app.get('/api/streams', streamsController.getAllStreams);

    app.get('/broadcast', function(req, res) {
      res.sendFile(path.join(__dirname + '/../public', 'index.html'));
  });
};