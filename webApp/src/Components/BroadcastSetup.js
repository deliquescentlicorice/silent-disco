import React from 'react';
import TextField from '../../node_modules/material-ui/lib/text-field';
import RaisedButton from '../../node_modules/material-ui/lib/raised-button';
import { History } from 'react-router';
import reactMixin from 'react-mixin';
import {BinaryClient} from 'binaryjs-client';
import $ from '../../public/js/jquery-1.11.1.min';

class Canvas extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
              <div id="canvas-container">
        <canvas width="600" height="100" id="canvas"></canvas>
    </div>
      )
  }
}


class BroadcastSetup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: (new Date).getTime().toString() + Math.random().toFixed(2),
      broadcaster: 'anonymous',
      desc: 'Hi, I\'m anonymous and you\'re listening to QuantumRadio',
      isInitializing: false
    };
  }

  stationNameInput(event) {
    this.setState({
      name: event.target.value
    });
  }

  stationBroadcasterInput(event) {
    this.setState({
      broadcaster: event.target.value
    });
  }

  stationDescriptionInput(event) {
    this.setState({
      desc: event.target.value
    });
  }


  startBroadcast() {
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
  
  this.context = new AudioContext();
  // this.contextSampleRate = this.context.sampleRate;

  this.client.on('open', function() {
    console.log('client opened');
    this.stream = this.client.createStream({
      sampleRate: this.context.SampleRate,
      streamID: this.streamId
    });
    console.log('stream sRate is: ', this.stream.sampleRate);
  }.bind(this));

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

  this.renderAudioCallback = renderAudioCallback;
}

Broadcaster.prototype.start = function() {
  if (!this.audioSource) {
    return 'Broadcast source not set!';
  }

  var constraints = {
    audio: {
      optional: [{
        sourceId: this.audioSource
      }]
    },
    video: false
  };

  navigator.getUserMedia(constraints, function(stream) {
    var audioInput = this.context.createMediaStreamSource(stream);
    
    var bufferSize = 0; // let implementation decide
    this.recorder = this.context.createScriptProcessor(bufferSize, 2, 2);
    
    this.recorder.onaudioprocess = function(e) {
      this.onAudio(e);
    }.bind(this);

    audioInput.connect(this.recorder);
    this.recorder.connect(this.context.destination);

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
    var audioSelect = document.querySelector('select#audioSource');

        var gotSources = function(sourceInfos) {
        for (var i = 0; i !== sourceInfos.length; ++i) {
            var sourceInfo = sourceInfos[i];
            if (sourceInfo.kind === 'audio') {
                var option = document.createElement('option');
                option.value = sourceInfo.id;
                option.text = sourceInfo.label || 'microphone ' +
                    (audioSelect.length + 1);
                audioSelect.appendChild(option);
            }
        }
    };


    // this.props.history.push({
    //   pathname: '/broadcast/live'
    // })

    var renderAudio = function(data) {
        var canvas = document.getElementById("canvas"),
            width = canvas.width,
            height = canvas.height,
            context = canvas.getContext('2d');

        context.clearRect(0, 0, width, height);
        var step = Math.ceil(data.length / width);
        var amp = height / 2;
        for (var i = 0; i < width; i++) {
            var min = 1.0;
            var max = -1.0;
            for (var j = 0; j < step; j++) {
                var datum = data[(i * step) + j];
                if (datum < min)
                    min = datum;
                if (datum > max)
                    max = datum;
            }
            context.fillRect(i, (1 + min) * amp, 1, Math.max(1, (max - min) * amp));
        }
    }

        var streamId = 1;
    var bc = new Broadcaster(streamId, gotSources, renderAudio);

        var audioSource = audioSelect.value;
        //need to set audio source before calling start
        bc.audioSource = audioSource;
        console.log('my audio Source is: ', audioSource);
        bc.start();


var serverURL = "http://localhost:3000/api/" + this.state.name;

    // this.setState({
    //   isInitializing: true
    // });

  //fetch can't run JSON
  $.ajax({
    url: serverURL,
    method: 'POST',
    contentType:"application/x-www-form-urlencoded",
    data: {
        // name: this.state.name,
        creator: "John Doe",
        desc: this.state.desc,
        lng: 40,
        lat: 30
      },
      success: function(data) {
      },
      error: function(xhr, status, err) {
      }
    });

    //   console.log(responseData);

    //   if (responseData.broadcastInfo) {
    //     this.props.navigator.push({
    //       title: this.state.name,
    //       component: OnAir,
    //       passProps: {broadcastInfo: responseData.broadcastInfo}
    //     })
    //   }
    // })
}

render() {
  return (
    <div>
            <div class="select">
            <label for="audioSource">Audio source: </label><select id="audioSource"></select>
        </div>
    <p style={styles.title}>Tell us about your station...</p>
    <TextField onChange={this.stationNameInput.bind(this)}
    hintText="Station Name"
    floatingLabelText="Station Name"
    /><br/>
    <TextField onChange={this.stationBroadcasterInput.bind(this)}
    hintText="Broadcast Name"
    floatingLabelText="Broadcast Name"
    /><br/>
    <TextField onChange={this.stationDescriptionInput.bind(this)}
    hintText="Description"
    floatingLabelText="Description"
    /><br/><br/>
    <RaisedButton primary={true} onClick={this.startBroadcast.bind(this)} label="Start Broadcasting"/>
    <Canvas />
    </div>
    )
} 
}

var styles = {
  title:{
    'fontFamily':'Roboto, sans-serif'
  }
}

reactMixin.onClass(BroadcastSetup, History);


export default BroadcastSetup;