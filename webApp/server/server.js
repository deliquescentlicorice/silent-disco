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

var encoder = require('./encoder');
var binaryServer = require('binaryjs').BinaryServer;
var binarySocketHandler = require('./binarySockets.js');

var version = process.env.version || 'DEV';

if (version === 'DEV') {
  var webpack = require('webpack');
  var config = require('../webpack.config.dev');
  var compiler = webpack(config);

  app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath
  }));
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

require('./routes.js')(app, express);

app.use(require('webpack-hot-middleware')(compiler));

app.use(express.static(__dirname + '/../src'));

//broadcasting client
app.use("/broadcast", express.static(__dirname + '/../public'));

//listen API route
app.use(encoder.Encoder('/listen', 'audio/mpeg', "lame", [
  "-S" // Operate silently (nothing to stderr)
  , "-r" // Input is raw PCM
  , "-s", encoder.SAMPLE_RATE / 1000 // Input sampling rate
  , "-" // Input from stdin
  , "-" // Output to stderr
  , "-V 5" //variable bit rate
]));

app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname + '/../src', 'index.html'));
});

app.listen(port);
console.log('Listening on port:' + port);

var server = binaryServer({
  port: 9001
});

server.on('connection', binarySocketHandler.connect);
