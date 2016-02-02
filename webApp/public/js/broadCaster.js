var Broadcaster = function(streamId, inputSourcesCB, renderAudioCallback) {
  //handle web audio api not supported
  navigator.getUserMedia = navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia;

  var protocol = (window.location.protocol === "https:") ? 'wss://' : 'ws://';

  //binaryJS client - server/socket connection
  this.client = new BinaryClient(protocol + document.location.host + '/binary-endpoint');

  this.stream;

  this.ctx = new AudioContext();
  // this.ctxSampleRate = this.ctx.sampleRate;
  //console.log('streamId:' + streamId);
  this.client.on('open', function() {
    this.stream = this.client.createStream({
      sampleRate: this.ctx.sampleRate,
      streamId: streamId
    });
  }.bind(this));
  // below method is new and only supported on chrome desktop
  // if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
  //   alert('This browser does not support MediaStreamTrack. Try Chrome.');
  // } else {
  //   navigator.mediaDevices.enumerateDevices().then(inputSourcesCB);
  // }

  //this method is deprecated but supported on both chrome and android
  if (typeof MediaStreamTrack === 'undefined' ||
    typeof MediaStreamTrack.getSources === 'undefined') {
    alert('This browser does not support MediaStreamTrack.\n\nTry Chrome.');
  } else {
    MediaStreamTrack.getSources(inputSourcesCB);
  }

  this.renderAudioCallback = renderAudioCallback;
}

Broadcaster.prototype.start = function(sourceId) {
  if (!sourceId) {
    return 'Broadcast source not set!';
  }

  var constraints = {
    audio: {
      optional: [{
        sourceId: sourceId
      }]
    },
    video: false
  };

  navigator.getUserMedia(constraints, function(stream) {
    var audioInput = this.ctx.createMediaStreamSource(stream);

    var bufferSize = 0; // let implementation decide
    this.recorder = this.ctx.createScriptProcessor(bufferSize, 2, 2);

    this.recorder.onaudioprocess = function(e) {
      this.onAudio(e);
    }.bind(this);

    audioInput.connect(this.recorder);
    this.recorder.connect(this.ctx.destination);

  }.bind(this), function(e) {
    console.log('error connectiing to audio source');
    throw e;
  });
}

Broadcaster.prototype.startFromHTML = function(elementId) {
  var audioElement = document.getElementById(elementId);
  var audioSrc = this.ctx.createMediaElementSource(audioElement);
  
  var bufferSize = 0; // let implementation decide
  this.recorder = this.ctx.createScriptProcessor(bufferSize, 2, 2);

  this.recorder.onaudioprocess = function(e) {
    this.onAudio(e);
  }.bind(this);

  audioSrc.connect(this.recorder);
  this.recorder.connect(this.ctx.destination);
}

Broadcaster.prototype.stop = function() {
  this.recorder.disconnect();
  this.client.close();
}

Broadcaster.prototype.onAudio = function(e) {
  var left = e.inputBuffer.getChannelData(0);
  var right = e.inputBuffer.getChannelData(1);

  var stereoBuff = this._interleave(left, right);

  this.stream.write(this._convertFloat32ToInt16(stereoBuff));

  // resampling code - leaving this out for now
  // worker.postMessage({
  //     cmd: "resample",
  //     buffer: stereoBuff
  // });

  if (this.renderAudioCallback) {
    this.renderAudioCallback(left); //callback to render audio value
  }
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