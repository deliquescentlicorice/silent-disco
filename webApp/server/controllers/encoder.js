var spawn = require("child_process").spawn;

exports.stdin = {};
exports.streamQueue = {};

// Stdin is expecting raw PCM data of the format:
var SAMPLE_SIZE = 16; // 16-bit samples, Little-Endian, Signed
var CHANNELS = 2; // 2 channels (left and right)

var SAMPLE_RATE = 44100; // 44,100 Hz sample rate.

// If we're getting raw PCM data as expected, calculate the number of bytes
// that need to be read for `1 Second` of audio data.
var BLOCK_ALIGN = SAMPLE_SIZE / 8 * CHANNELS; // Number of 'Bytes per Sample'
var BYTES_PER_SECOND = exports.SAMPLE_RATE * BLOCK_ALIGN;

// Array of HttpServerResponse objects that are listening clients.
var clients = [];
// not sure if this is needed
var maxClients = 25;

exports.listenHandler = function(req, res) {
  var streamId = req.params.id;

  console.log('streamid:' + streamId);

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

  //check if stream has started yet
  if (exports.stdin[streamId]) {
    console.log('stream exists');
    exports.addStreamHandlers(streamId, req, res);
  } else {
    //handle user arriving to stream early
    exports.streamQueue[streamId] = exports.streamQueue[streamId] || [];
    //add to stream queue
    exports.streamQueue[streamId].push([req,res]);
  }
}

exports.addStreamHandlers = function(streamId, req, res) {
  // start sending the incoming PCM data to the MP3 encoder
  var callback = function(chunk) {
    encoder.stdin.write(chunk);
  }

  //mp3 encoder options  
  var spawnOpts = [
    "-S" // Operate silently (nothing to stderr)
    , "-r" // Input is raw PCM
    , "-s", SAMPLE_RATE / 1000 // Input sampling rate
    , "-" // Input from stdin
    , "-" // Output to stderr
    , "-V 5" //variable bit rate
  ];

  //mp3 encoder
  var encoder = spawn('lame', spawnOpts);

  encoder.stdout.on("data", function(chunk) {
    if (!res.finished) {
      res.write(chunk);
    }
  });

  exports.stdin[streamId].on("data", callback);

  exports.stdin[streamId].on("end", function() {
    console.log('stream on end - ending response');
    res.end();
  });

  req.connection.on("close", function() {
    // occurs when the HTTP client closes the connection.
    clients.splice(clients.indexOf(res), 1);
    //how can we get access to encoder here ???
    encoder.stdin.end();
    if (exports.stdin[streamId]) {
      exports.stdin[streamId].removeListener("data", callback);
    }
  });

  clients.push(res);
}