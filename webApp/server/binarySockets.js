
var encoder = require('./encoder');

exports.connect = function(client) {
  console.log("new binary socket connection...");

  client.on('stream', function(stream, meta) {
    console.log("Stream Start...@" + meta.sampleRate + "Hz");
    encoder.stdin = stream;
    encoder.stdin.on('data', encoder.onInStreamPCM);
  });
} 

// Takes a Number in seconds, and returns a String in format mm:ss.
// Used in metadata events to compatible clients (VLC).
// function prettyPrintTime(seconds) {
//   seconds = Number(seconds);
//   var mins = Math.floor(seconds/60);
//   var secs = seconds % 60;
//   return mins + ":" + (secs < 10 ? "0":"") + Math.floor(secs);
// }
