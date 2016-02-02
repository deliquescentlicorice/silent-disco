import React from 'react';
import TextField from '../../node_modules/material-ui/lib/text-field';
import RaisedButton from '../../node_modules/material-ui/lib/raised-button';
import DropDownMenu from '../../node_modules/material-ui/lib/DropDownMenu';
import MenuItem from '../../node_modules/material-ui/lib/menus/menu-item';
import { History } from 'react-router';
import reactMixin from 'react-mixin';
import {BinaryClient} from 'binaryjs-client';
import $ from '../../public/js/jquery-1.11.1.min';

class BroadcastSetup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: (new Date).getTime().toString() + Math.random().toFixed(2),
      broadcaster: 'anonymous',
      desc: 'Hi, I\'m anonymous and you\'re listening to QuantumRadio',
      isInitializing: false,
      isLoggedIn: false,
      isLive: true,
      favorites: []
    };
  }

  componentDidMount() {
    if (!this.state.isLoggedIn) {
      SC.initialize({
        client_id: '67e4bbe5a2b1b64416b0ed84366b34ca',
        redirect_uri: 'http://localhost:3000/auth/soundcloud'
      });

      var component = this;

      // initiate auth popup
      SC.connect()
      .then(function(err, result) {
        return SC.get('/me');
      })
      .then(function(me) {
        localStorage.setItem("me", JSON.stringify(me));
        component.setState({
          isLoggedIn: true
        });
        return SC.get('/me/favorites');
      })
      .then(function(favorites) {
        localStorage.setItem("favorites", JSON.stringify(favorites));
        this.setState({
          favorites: favorites
        });
      });
    }
  }

  stationNameInput(event, index, value) {
    this.setState({
      name: value
    });
  }

  stationDescriptionInput(event, index, value) {
    this.setState({
      desc: value
    });
  }

  stationLiveInput(event, index, value) {
    this.setState({
      isLive: value
    })
  }


  startBroadcast() {
    if (this.state.isLive) {
      this.props.history.push({
        pathname: '/broadcast/live'
      });
    } else {
      this.props.history.push({
        pathname: '/broadcast/soundcloud'
      });
    }
    console.log(this)
    console.log("station name", this.state.name)
    console.log("station broadcaster", this.state.broadcaster)
    console.log("station description", this.state.desc)
    /* copy-paste from site.js for recording functionality */

    var context;
    var bStream;
    var  contextSampleRate = (new AudioContext()).sampleRate;
    var resampleRate = 44100;
    var recorder;
    // var workerLoc = 'webApp/public/js/worker/resampler-worker.js';
    // var worker = new Worker(workerLoc);

    var protocol = (window.location.protocol === "https:") ? 'wss://' : 'ws://';
    var client = new BinaryClient(protocol + document.location.host + '/binary-endpoint');

    var  interleave = function(leftChannel, rightChannel) {
      var length = leftChannel.length + rightChannel.length;
      var result = new Float32Array(length);

      var inputIndex = 0;

      for (var index = 0; index < length;) {
        result[index++] = leftChannel[inputIndex];
        result[index++] = rightChannel[inputIndex];
        inputIndex++;
      }
      return result;
    };


    var Broadcaster = function(streamId, inputSourcesCB, renderAudioCallback) {
  //handle web audio api not supported
  navigator.getUserMedia = navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia;


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
    var partial;
    if (this.state.isLoggedIn) {
      partial = (
        <div style={styles.container}>
          <p style={styles.title}>Tell us about your station</p>
          <TextField onChange={this.stationNameInput.bind(this)}
            hintText="Stream Name"
            floatingLabelText="Stream Name"
          /><br/>
          <TextField onChange={this.stationDescriptionInput.bind(this)}
            hintText="Description"
            floatingLabelText="Description"
          /><br/><br/>
          <DropDownMenu value={this.state.isLive} onChange={this.stationLiveInput.bind(this)}>
            <MenuItem value={true} primaryText="Live"/>
            <MenuItem value={false} primaryText="SoundCloud"/>
          </DropDownMenu><br/><br/>
          <RaisedButton primary={true} onClick={this.startBroadcast.bind(this)} label="Start Broadcasting"/>
        </div>
      )
    } else {
      partial = (
        <div>
          <p style={styles.title}>Broadcasting requires a SoundCloud account. Please sign in!</p>
        </div>
      )
    }

    return partial;
  } 
}

var styles = {
  container: {
    'flexDirection': 'column',
    'justifyContent': 'center',
    'alignContent': 'center'
  },
  title:{
    'fontFamily':'Roboto, sans-serif'
  }
}

reactMixin.onClass(BroadcastSetup, History);


export default BroadcastSetup;
