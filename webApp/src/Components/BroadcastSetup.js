import React from 'react';
import TextField from '../../node_modules/material-ui/lib/text-field';
import RaisedButton from '../../node_modules/material-ui/lib/raised-button';
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


    var  onAudio  = function (e) {
      var left = e.inputBuffer.getChannelData(0);
      var right = e.inputBuffer.getChannelData(1);

      var stereoBuff = interleave(left, right);

      // worker.postMessage({
      //   cmd: "resample",
      //   buffer: stereoBuff
      // });
    };

    client.on('open', function() {
      bStream = client.createStream({
        sampleRate: resampleRate
      });
    });

    if (context) {
      recorder.connect(context.destination);
      return;
    }

    // var audioSource = audioSelect.value;

    //we'll have to specify a source later
    var constraints = {
      audio: true,
      video: false
    };

    navigator.getUserMedia = navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia;

    navigator.getUserMedia(constraints, function(stream) {
      context = new AudioContext();
      var audioInput = context.createMediaStreamSource(stream);
      contextSampleRate = context.sampleRate;
            var bufferSize = 0; // let implementation decide
            recorder = context.createScriptProcessor(bufferSize, 2, 2);
            recorder.onaudioprocess = onAudio;
            audioInput.connect(recorder);
            recorder.connect(context.destination);

          }, function(e) {
            console.log('error connectiing to audio source');
            throw e;
          });
    // this.props.history.push({
    //   pathname: '/broadcast/live'
    // })
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