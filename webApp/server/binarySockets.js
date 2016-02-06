
var encoder = require('./controllers/encoder');

exports.connect = function(client) {
  console.log("new binary socket connection...");

  client.on('stream', function(stream, meta) {
    console.log(meta);
    console.log("Stream Start...@" + meta.sampleRate + "Hz");
    console.log("Stream Id:" + meta.streamId);
      
    //support for multiple streams  
    var streamId = meta.streamId;
    encoder.stdin[streamId] = stream;
    // encoder.stdin[streamId].on('data', encoder.onInStreamPCM);

    stream.on('end', function() {
      encoder.stdin[streamId].end();
      delete encoder.stdin[streamId];
    });
  });


  //handle disconnect
  client.on('close', function() {

    console.log('binary js client connection closed');
  })
} 
