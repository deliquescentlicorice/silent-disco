var Broadcaster = function(streamId, inputSourcesCB) {
  //handle web audio api not supported
  navigator.getUserMedia = navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia;

  //binaryJS client - server/socket connection
  this.stream;
  // window.bClient;
  this.streamId = streamId;

  this.ctx = new AudioContext();

  if (typeof MediaStreamTrack === 'undefined' ||
    typeof MediaStreamTrack.getSources === 'undefined') {
    alert('This browser does not support MediaStreamTrack.\n\nTry Chrome.');
  } else {
    MediaStreamTrack.getSources(inputSourcesCB);
  }
}

Broadcaster.prototype.start = function(sourceId) {
  if (!sourceId) {
    return 'Broadcast source not set!';
  }

  this.stream = window.bClient.createStream({
    sampleRate: this.ctx.sampleRate,
    streamId: this.streamId,
    type: 'stream'
  });

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

    this.analyser = this.ctx.createAnalyser();
    this.analyser.minDecibels = -90;
    this.analyser.maxDecibels = -10;
    this.analyser.smoothingTimeConstant = 0.85;

    audioInput.connect(this.analyser);

    //start audio render
    this.startAudioRender();
  }.bind(this), function(e) {
    console.log('error connectiing to audio source');
    throw e;
  });
}

Broadcaster.prototype.startAudioRender = function() {
  var canvas = document.getElementById("visualizer");

  if (canvas) {
    this.analyser.fftSize = 256;
    var bufferLength = this.analyser.frequencyBinCount;
    var dataArray = new Uint8Array(bufferLength);
    var WIDTH = canvas.width;
    var HEIGHT = canvas.height;
    var context = canvas.getContext('2d');

    context.clearRect(0, 0, WIDTH, HEIGHT);

    window.renderAudio = function() {
      drawVisual = requestAnimationFrame(window.renderAudio);
      this.analyser.getByteFrequencyData(dataArray);

      context.fillStyle = 'rgb(255, 255, 255)';
      context.fillRect(0, 0, WIDTH, HEIGHT);

      var barWidth = (WIDTH / bufferLength) * 2.5;
      var barHeight;
      var x = 0;

      for (var i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i];
        context.fillStyle = 'rgb(' + (barHeight + 100) + ',50,50)';
        context.fillRect(x, HEIGHT - barHeight / 2, barWidth, barHeight / 2);
        x += barWidth + 1;
      }
    }.bind(this);

    window.renderAudio();
  }
}

Broadcaster.prototype.startFromHTML = function(elementId) {
  var protocol = (window.location.protocol === "https:") ? 'wss://' : 'ws://';
  window.bClient = new BinaryClient(protocol + document.location.host + '/binary-endpoint');

  window.bClient.on('open', function() {

    this.stream = window.bClient.createStream({
      sampleRate: this.ctx.sampleRate,
      streamId: this.streamId,
      type: 'stream'
    });

    var audioElement = document.getElementById(elementId);
    var audioSrc = this.ctx.createMediaElementSource(audioElement);

    var bufferSize = 0; // let implementation decide
    this.recorder = this.ctx.createScriptProcessor(bufferSize, 2, 2);

    this.recorder.onaudioprocess = function(e) {
      this.onAudio(e);
    }.bind(this);

    audioSrc.connect(this.recorder);
    this.recorder.connect(this.ctx.destination);

    this.analyser = this.ctx.createAnalyser();
    this.analyser.minDecibels = -90;
    this.analyser.maxDecibels = -10;
    this.analyser.smoothingTimeConstant = 0.85;

    audioSrc.connect(this.analyser);

    //start audio render
    this.startAudioRender();
  }.bind(this));
}

Broadcaster.prototype.stop = function() {
  if (this.recorder) {
    this.recorder.disconnect();
  }
  if (this.stream) {
    this.stream.end();
  }
}

Broadcaster.prototype.onAudio = function(e) {
  var left = e.inputBuffer.getChannelData(0);
  var right = e.inputBuffer.getChannelData(1);
  var stereoBuff = this._interleave(left, right);
  this.stream.write(this._convertFloat32ToInt16(stereoBuff));
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