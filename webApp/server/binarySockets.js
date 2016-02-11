var encoder = require('./controllers/encoder');
var binaryServer = require('binaryjs').BinaryServer;
var streamsController = require('./controllers/streamsController');

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
        
        //support multiple streams  
        var streamId = meta.streamId;
        encoder.stdin[streamId] = stream;

        //update database stream model as started
        streamsController.streamWasStartedOrStopped(streamId, 'started', function(err, results) {
          if (err) {
            console.log(err);
          }
        });

        //handle listeners arriving to stream before it starts broadcasting
        //if there is a queue of clients waiting for this stream to start
        if (encoder.streamQueue[streamId]) {
          encoder.streamQueue[streamId].forEach(function(req) {
            encoder.addStreamHandlers(streamId, req[0], req[1]);
          });
          delete encoder.streamQueue[streamId];
        }

        stream.on('end', function() {
          console.log('broadcast end');
          //update database stream model as stopped
          streamsController.streamWasStartedOrStopped(streamId, 'stopped', function(err, results) {
            if (err) {
              console.log(err);
            }
          });
          encoder.stdin[streamId].end();
          delete encoder.stdin[streamId];
        });
      } else {
        console.log(meta);
        //broadcast event to 
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