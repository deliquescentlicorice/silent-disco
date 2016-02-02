var streamsController = require('./controllers/streamsController');
var usersController = require('./controllers/usersController');
var path = require('path');
var express = require('express');

module.exports = function(app, express) {


    app.post('/api/:stream', streamsController.createStream);
    app.get('/api/stream/:stream', streamsController.getStream);
    app.put('/api/stream/:stream', streamsController.upHeart);
    app.put('/api/deejay/:stream', streamsController.modifyStreamDetails);
    app.get('/api/streams', streamsController.getAllStreams);
};