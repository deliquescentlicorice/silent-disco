var protocol = (window.location.protocol === "https:") ? 'wss://' : 'ws://';
window.bClient = new BinaryClient(protocol + document.location.host + '/binary-endpoint');

//event handlers
window.bClient.on('stream', function(data, meta) {
  if (meta.type === 'event') {
    if (data.action === 'enterStream') {
      console.log('onEnterStream-' + data.streamId);
      //todo
    }

    if (data.action === 'leaveStream') {
      console.log('onLeaveStream-' + data.streamId);
      //todo
    }

    if (data.action === 'upHeart') {
      console.log('onUpHeart-' + data.streamId);
      //todo
    }
  }
});

//event emmitters
var enterStream = function(streamId) {
  window.bClient.send({
    streamId: streamId,
    action: "enterStream"
  }, {
    type: "event"
  });
}

var leaveStream = function(streamId) {
  window.bClient.send({
    streamId: streamId,
    action: "leaveStream"
  }, {
    type: "event"
  });
}

var upHeart = function(streamId) {
  window.bClient.send({
    streamId: streamId,
    action: "upHeart"
  }, {
    type: "event"
  });
}