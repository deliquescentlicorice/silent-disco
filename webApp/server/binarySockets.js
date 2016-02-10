var encoder = require('./controllers/encoder');
var binaryServer = require('binaryjs').BinaryServer;

module.exports = function(server) {
  var bServer = binaryServer({
    server: server
  });

  bServer.on('connection', function(client) {
    console.log("new binary socket connection...");

    //todo handle events

    client.on('stream', function(stream, meta) {
      if (meta.type === 'stream') {
        console.log('broadcast start');
        console.log(meta);
        console.log("Stream start...@" + meta.sampleRate + "Hz");
        console.log("Stream Id:" + meta.streamId);

        //support for multiple streams  
        var streamId = meta.streamId;

        //handle listeners arriving to stream before it starts broadcasting
        encoder.stdin[streamId] = stream;

        //if there is a queue of clients waiting for this stream to start
        if (encoder.streamQueue[streamId]) {
          encoder.streamQueue[streamId].forEach(function(req) {
            encoder.addStreamHandlers(streamId, req[0], req[1]);
          });
          delete encoder.streamQueue[streamId];
        }

        stream.on('end', function() {
          console.log('broadcast end');
          encoder.stdin[streamId].end();
          delete encoder.stdin[streamId];
        });
      } else {
        console.log(meta);
        emit(meta);
      }
    });

    //handle global client disconnect
    client.on('close', function() {
      console.log('binary js client connection closed');
    });

    var emit = function(meta) {
      for (var id in bServer.clients) {
        if (bServer.clients.hasOwnProperty(id)) {
          var otherClient = bServer.clients[id];
          if (otherClient != client) {
            console.log('emit:' + meta);
            otherClient.send('', meta);
          }
        }
      }
    }

  });
}