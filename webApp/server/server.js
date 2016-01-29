/**
 * Created on 1/28/16
 */
var express = require('express');
var path = require('path');
var webpack = require('webpack');
var config = require('../webpack.config.dev');

var app = express();
var port = process.env.PORT || 3000;
var compiler = webpack(config);

var encoder = require('./encoder');
var binaryServer = require('binaryjs').BinaryServer;
var binarySocketHandler = require('./binarySockets.js');

app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath
}));

//static routes
app.use(require('webpack-hot-middleware')(compiler));

app.use(express.static(__dirname + '/../src'));

//broadcasting client
app.use("/broadcast", express.static(__dirname + '/../public'));

//listen API route
app.use(encoder.Encoder('/listen', 'audio/mpeg', "lame", [
    "-S" // Operate silently (nothing to stderr)
  , "-r" // Input is raw PCM
  , "-s", encoder.SAMPLE_RATE / 1000 // Input sampling rate
  , "-"// Input from stdin
  , "-" // Output to stderr
]));

app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname+ '/../src', 'index.html'));
});

app.listen(port);
console.log('Listening on port:' + port);

var server = binaryServer({
  port: 9001
});

server.on('connection', binarySocketHandler.connect);
