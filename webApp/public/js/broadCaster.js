var Broadcaster = function(streamId, inputSourcesCB) {
  //handle web audio api not supported
  this._getUserMedia = navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia;

  var protocol = (window.location.protocol === "https:") ? 'wss://' : 'ws://';

  //binaryJS client - make server/socket connection
  this.client = new BinaryClient(protocol + document.location.host + '/binary-endpoint');

  this.stream;
  this.streamId = streamId;
  this.context = new AudioContext();
  this.contextSampleRate = this.context.sampleRate;

  this.client.on('open', function() {
    this.stream = this.client.createStream({
      sampleRate: this.contextSampleRate,
      streamID: this.streamId
    });
  });

  this.audioSource;
  this.recorder;
  this.context;

  //todo - handle api not supported
  if (typeof MediaStreamTrack === 'undefined' ||
    typeof MediaStreamTrack.getSources === 'undefined') {
    alert('This browser does not support MediaStreamTrack.\n\nTry Chrome.');
  } else {
    MediaStreamTrack.getSources(inputSourcesCB);
  }
}

Broadcaster.prototype.start = function() {
  if (!this.audioSource) {
    return 'Broadcast source not set!';
  }

  //???
  if (context) {
    recorder.connect(context.destination);
    return;
  }

  var constraints = {
    audio: {
      optional: [{
        sourceId: this.audioSource
      }]
    },
    video: false
  };

  this._getUserMedia(constraints, function(stream) {
    //context = new AudioContext();
    var audioInput = this.context.createMediaStreamSource(stream);
    // contextSampleRate = context.sampleRate;
    var bufferSize = 0; // let implementation decide
    this.recorder = context.createScriptProcessor(bufferSize, 2, 2);
    this.recorder.onaudioprocess = this.onAudio;
    this.audioInput.connect(recorder);
    this.recorder.connect(context.destination);

  }.bind(this), function(e) {
    console.log('error connectiing to audio source');
    throw e;
  });
}

Broadcaster.prototype.stop = function() {
  this.recorder.disconnect();
  this.client.close();
}

Broadcaster.prototype.setAudioSource = function(value) {
  this.audioSource = value;
}

Broadcaster.prototype.onAudio = function(e, callback) {
  var left = e.inputBuffer.getChannelData(0);
  var right = e.inputBuffer.getChannelData(1);

  var stereoBuff = this._interleave(left, right);

  this.stream.write(this._convertFloat32ToInt16(stereoBuff));

  // resampling code - leaving this out for now
  // worker.postMessage({
  //     cmd: "resample",
  //     buffer: stereoBuff
  // });

  callback(left); //callback to render audio value
}

Broadcaster.prototype._convertFloat32ToInt16 = function(buffer) {
  var l = buffer.length;
  var buf = new Int16Array(l);
  while (l--) {
    buf[l] = Math.min(1, buffer[l]) * 0x7FFF;
  }
  return buf.buffer;
}

Broadcaster.prototype._interleave = function(leftChannel, rightChannel) {
  var length = leftChannel.length + rightChannel.length;
  var result = new Float32Array(length);

  var inputIndex = 0;

  for (var index = 0; index < length;) {
    result[index++] = leftChannel[inputIndex];
    result[index++] = rightChannel[inputIndex];
    inputIndex++;
  }
  return result;
}
