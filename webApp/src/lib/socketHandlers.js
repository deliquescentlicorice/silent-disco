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