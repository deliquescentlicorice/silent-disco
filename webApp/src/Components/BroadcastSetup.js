import React from 'react';
import TextField from '../../node_modules/material-ui/lib/text-field';
import RaisedButton from '../../node_modules/material-ui/lib/raised-button';
import { History } from 'react-router';
import reactMixin from 'react-mixin';

class BroadcastSetup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: (new Date).getTime().toString() + Math.random().toFixed(2),
      broadcaster: 'anonymous',
      desc: 'Hi, I\'m anonymous and you\'re listening to QuantumRadio',
      isInitializing: false,
      isLoggedIn: false
    };
  }

  componentDidMount() {
    if (!this.state.isLoggedIn) {
      SC.initialize({
        client_id: '67e4bbe5a2b1b64416b0ed84366b34ca',
        redirect_uri: 'http://localhost:3000/auth/soundcloud'
      });

      // initiate auth popup
      SC.connect()
      // .then(function(err, result) {
      //   return SC.get('/me');
      // })
      // .then(function(me) {
      //   this.setState({
      //     isLoggedIn: true
      //   })
      //   .catch(function(error) {

      //   alert(error);
      //   })
      // });
    }
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
            var protocol = (window.location.protocol === "https:") ? 'wss://' : 'ws://';
        var client = new BinaryClient(protocol + document.location.host + '/binary-endpoint');
        
        client.on('open', function() {
            bStream = client.createStream({
                sampleRate: resampleRate
            });
        });

        if (context) {
            recorder.connect(context.destination);
            return;
        }

        var audioSource = audioSelect.value;

        var constraints = {
            audio: {
                optional: [{
                    sourceId: audioSource
                }]
            },
            video: false
        };

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
    // var serverURL = "http://10.6.32.108:8000/testpost";
    
    // this.setState({
    //   isInitializing: true
    // });

    // fetch(serverURL, {
    //   method: 'POST',
    //   body: JSON.stringify({
    //     name: this.state.name,
    //     broadcaster: this.state.broadcaster,
    //     desc: this.state.desc
    //   })
    // })
    // .then((response) => response.json())
    // .then((responseData) => {
    //   this.setState({
    //     isInitializing: false
    //   })

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
    } else {
      partial = (
        <div>
          <p style={styles.title}>Please log in with your SoundCloud account!</p>
        </div>
      )
    }

    return partial;
  } 
}

var styles = {
  title:{
    'fontFamily':'Roboto, sans-serif'
  }
}

reactMixin.onClass(BroadcastSetup, History);


export default BroadcastSetup;