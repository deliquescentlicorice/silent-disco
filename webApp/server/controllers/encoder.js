var spawn = require("child_process").spawn;

exports.stdin = {};

// Stdin is expecting raw PCM data of the format:
var SAMPLE_SIZE = 16; // 16-bit samples, Little-Endian, Signed
var CHANNELS = 2; // 2 channels (left and right)

exports.SAMPLE_RATE = 44100; // 44,100 Hz sample rate.

// If we're getting raw PCM data as expected, calculate the number of bytes
// that need to be read for `1 Second` of audio data.
var BLOCK_ALIGN = SAMPLE_SIZE / 8 * CHANNELS; // Number of 'Bytes per Sample'
var BYTES_PER_SECOND = exports.SAMPLE_RATE * BLOCK_ALIGN;

// A simple "Burst-on-Connect" implementation. We'll store the previous "10
// seconds" worth of raw PCM data, and send it each time a new Icecast
// connection is made.
var bocData = [];
var bocSize = BYTES_PER_SECOND * 10; // 10 raw PCM seconds in bytes

var metadata = {};
var currentTrack = "unknown";
var currentTrackStartTime, duration, dId;

var name = "My Music";
var metaint = 8192;

// Array of HttpServerResponse objects that are listening clients.
var clients = [];

// note sure if this is needed
var maxClients = 15;

exports.onInStreamPCM = function(chunk) {
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

exports.Encoder = function(stream, contentType, spawnName, spawnOpts) {

  console.log('encoder was invoked');

  return function(req, res, next) {

    console.log('enconder child function was invoked');
    var parsed = require('url').parse(req.url, true);

    if (parsed.pathname == stream) {

      // Sorry, too busy, try again later!
      if (clients.length >= maxClients) {
        res.writeHead(503);
        return res.end("The maximum number of clients (" + exports.maxClients + ") are aleady connected, try connecting again later...")
      }

      console.log(req.headers);

      var headers = {
        'Content-Type': 'audio/mpeg',
        'Transfer-Encoding': 'chunked',
        "Connection": "close"
      };

      res.writeHead(200, headers);

      var encoder = spawn(spawnName, spawnOpts);
      encoder.stdout.on("data", function(chunk) {
        res.write(chunk);
      });

      // First, send what's inside the "Burst-on-Connect" buffers.
      for (var i = 0, l =bocData.length; i < l; i++) {
        encoder.stdin.write(bocData[i]);
      }

      // Then start sending the incoming PCM data to the MP3 encoder
      var callback = function(chunk) {
        console.log('pcm chunk sent to mp3');
        encoder.stdin.write(chunk);
      }

      exports.stdin.on("data", callback);
      clients.push(res);

      req.connection.on("close", function() {
        // This occurs when the HTTP client closes the connection.
        clients.splice(clients.indexOf(res), 1);
        encoder.stdin.end();
        exports.stdin.removeListener("data", callback);
      });
    } else {
      next();
    }
  }
}
