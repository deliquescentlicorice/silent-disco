window.bProtocol = (window.location.protocol === "https:") ? 'wss://' : 'ws://';
window.bClient = new BinaryClient(window.bProtocol + document.location.host + '/binary-endpoint');

//event handlers
window.bClient.on('stream', function(data, meta) {
  if (meta.type === 'event') {
    if (meta.action === 'enterStream') {
      //console.log('onEnterStream-' + meta.streamId);
      //todo
    }

    if (meta.action === 'leaveStream') {
      //console.log('onLeaveStream-' + meta.streamId);
      //todo
    }

    if (meta.action === 'upHeart') {
      //console.log('onUpHeart-' + meta.streamId);
      //todo
    }
  }
});

//event emmitters
var enterStream = function(streamId) {
  window.bClient.send('', {
    streamId: streamId,
    action: "enterStream",
    type: "event"
  });
}

var leaveStream = function(streamId) {
  window.bClient.send('', {
    streamId: streamId,
    action: "leaveStream",
    type: "event"
  });
}

var upHeart = function(streamId) {
  window.bClient.send('', {
    streamId: streamId,
    action: "upHeart",
    type: "event"
  });
}