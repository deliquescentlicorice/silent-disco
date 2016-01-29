/**
 * Created on 1/28/16
 */
var express = require('express');
var path = require('path');
var webpack = require('webpack');
var config = require('../webpack.config.dev');

var MongoClient = require('mongodb');
var mongoose = require('mongoose');
var Admin = mongoose.mongo.Admin;

var app = express();
var port = process.env.PORT || 3000;

var compiler = webpack(config);

app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath
}));

app.use(require('webpack-hot-middleware')(compiler));

app.use(express.static(__dirname + '/../src'))
app.get('/broadcast', function(req, res) {
  res.sendFile(path.join(__dirname + '/../public', 'index.html'));
});
app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname+ '/../src', 'index.html'));
});

var throttle = require('throttle'),
  encoder = require('./encoder');

encoder.stdin = {};

var binaryServer = require('binaryjs').BinaryServer;
var fs = require('fs');

// Stdin is expecting raw PCM data of the format:
var SAMPLE_SIZE = 16, // 16-bit samples, Little-Endian, Signed
  CHANNELS = 1, // 2 channels (left and right)
  SAMPLE_RATE = 44100; // 44,100 Hz sample rate.

// If we're getting raw PCM data as expected, calculate the number of bytes
// that need to be read for `1 Second` of audio data.
var BLOCK_ALIGN = SAMPLE_SIZE / 8 * CHANNELS, // Number of 'Bytes per Sample'
  BYTES_PER_SECOND = SAMPLE_RATE * BLOCK_ALIGN;

// A simple "Burst-on-Connect" implementation. We'll store the previous "10
// seconds" worth of raw PCM data, and send it each time a new Icecast
// connection is made.
encoder.bocData = bocData = [];
var bocSize = BYTES_PER_SECOND * 10; // 10 raw PCM seconds in bytes

function onInStreamPCM(chunk) {
  bocData.push(chunk);
  var removed = 0;
  while (currentBocSize() > bocSize) {
    removed += bocData.shift().length;
  }

  // If we've removed a number of bytes that isn't a multiple of BLOCK_ALIGN,
  // then we'd be left with a partial audio sample, which at best case reverses
  // the audio channels, and at worst makes the bytes 16-bit ints be offset by 1,
  // resulting in awful static sound.
  var stillToRemove = removed % BLOCK_ALIGN;
  while (stillToRemove > 0) {
    if (bocData[0].length <= stillToRemove) {
      stillToRemove -= bocData.shift().length;
    } else {
      bocData[0] = bocData[0].slice(stillToRemove);
      stillToRemove = 0;
    }
  }
}

function currentBocSize() {
  var size = 0,
    i = 0,
    l = bocData.length
  for (; i < l; i++) {
    size += bocData[i].length;
  }
  return size;
}

var name = "My Music",
  metaint = 8192;
encoder.name = name;
encoder.metaint = metaint;
// Array of HttpServerResponse objects that are listening clients.
encoder.clients = clients = [];
encoder.icecastClients = icecastClients = [];

// The max number of listening Icecast clients allowed at a time.
// There's a limit because each connection invokes it's own instance of
// lame, oggenc, aacplusenc, etc. The HTTP Live Streaming is just a matter of
// serving regular static files, so those clients don't increment the count...
encoder.maxClients = maxClients = 15;

encoder.metadata = metadata = {};
encoder.currentTrack = currentTrack = "unknown";
var currentTrackStartTime, duration, dId;


app.use(encoder.Encoder('/listen', 'audio/mpeg', "lame", [
    "-S" // Operate silently (nothing to stderr)
  , "-r" // Input is raw PCM
  , "-s", SAMPLE_RATE / 1000 // Input sampling rate: 44,100
  , "-"// Input from stdin
  , "-" // Output to stderr
]));

app.listen(port);
console.log('Listening on port:' + port);

// opener("http://localhost:8080");

var server = binaryServer({
  port: 9001
});

server.on('connection', function(client) {
  console.log("new connection...");

  client.on('stream', function(stream, meta) {

    console.log("Stream Start@" + meta.sampleRate + "Hz");

    // throttle(stream, BYTES_PER_SECOND);
    encoder.stdin = stream;
    encoder.stdin.on('data', onInStreamPCM);
  });
});

// Takes a Number in seconds, and returns a String in format mm:ss.
// Used in metadata events to compatible clients (VLC).
function prettyPrintTime(seconds) {
  seconds = Number(seconds);
  var mins = Math.floor(seconds/60);
  var secs = seconds % 60;
  return mins + ":" + (secs < 10 ? "0":"") + Math.floor(secs);
}

