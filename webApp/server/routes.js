var streamsController = require('./streamsController');
var usersController = require('./usersController');
var path = require('path');

module.exports = function(app, express) {
    app.get('/broadcast', function(req, res) {
  res.sendFile(path.join(__dirname + '/../public', 'index.html'));
});

app.post('/api/:stream', streamsController.createStream);
app.get('/api/listen/:stream', streamsController.getStream);
app.put('/api/listen/:stream', streamsController.upHeart);
app.put('/api/broadcast/:stream', streamsController.modifyStreamDetails);
app.get('/api/streams', streamsController.getAllStreams);
app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname+ '/../src', 'index.html'));
});
}