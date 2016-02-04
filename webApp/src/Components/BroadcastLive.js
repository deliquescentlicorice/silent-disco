import React from 'react';

// MATERIAL DESIGN
import Card from 'material-ui/lib/card/card';
import CardActions from '../../node_modules/material-ui/lib/card/card-actions';
import CardHeader from '../../node_modules/material-ui/lib/card/card-header';
import CardMedia from '../../node_modules/material-ui/lib/card/card-media';
import CardTitle from '../../node_modules/material-ui/lib/card/card-title';
import DropDownMenu from '../../node_modules/material-ui/lib/DropDownMenu';
import FlatButton from '../../node_modules/material-ui/lib/flat-button';
import FloatingActionButton from '../../node_modules/material-ui/lib/floating-action-button';
import Favorite from '../../node_modules/material-ui/lib/svg-icons/action/favorite';
import Face from '../../node_modules/material-ui/lib/svg-icons/action/face';
import TrendingUp from '../../node_modules/material-ui/lib/svg-icons/action/trending-up';
import MenuItem from '../../node_modules/material-ui/lib/menus/menu-item';
import Mic from '../../node_modules/material-ui/lib/svg-icons/av/mic';
import MicOff from '../../node_modules/material-ui/lib/svg-icons/av/mic-off';
import CardText from '../../node_modules/material-ui/lib/card/card-text';
import TextField from '../../node_modules/material-ui/lib/text-field';
import RaisedButton from '../../node_modules/material-ui/lib/raised-button';
import Colors from '../../node_modules/material-ui/lib/styles/colors';

import Paper from '../../node_modules/material-ui/lib/paper';

// ROUTER
import { History } from 'react-router';
import reactMixin from 'react-mixin';

// COMPONENTS
import NavBar from './NavBar.js';

class BroadcastLive extends React.Component {
  constructor(props) {
    var user = JSON.parse(localStorage.getItem("me"));
    super(props);
    this.state = {
      disabled: false,
      heartCount: 4000,
      listnerLiveCount: 1000,
      name: "Screw It, We're Doing It Live",
      description: "Description of the station",
      artist: user.full_name || "anonymous",
      artistAlias: user.username || "QuantumRadio Broadcaster",
      artistImage: user.avatar_url,
      selectedSource: null,
      audioSources: []
    };
  }

  gotMediaDevices(devices) {
    var audioSources = [];
    console.log('GMD was called');
    devices.forEach(function(device) {
      if (device.kind === 'audio') {
        audioSources.push({
          id: device.id,
          label: device.label || 'Input ' + audioSources.length + 1
        })
      }
    });
    this.setState({
      audioSources: audioSources
    });
  }

  componentWillMount() {
    console.log(this.props.location.state.streamId);
    // var streamId = 44;
    this.bc = new Broadcaster(this.props.location.state.streamId, this.gotMediaDevices.bind(this), function(data) {
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
    });
  }

  startBroadcast() {
    if (this.state.selectedSource) {
      this.setState({
        disabled: true
      });
      this.bc.start(this.state.selectedSource);
    }
  }

  stopBroadcast() {
    this.setState({
      disabled: false
    })
    this.bc.stop();
  }

  sourceInput(event, index, value) {
    this.setState({
      selectedSource: value
    })
  }

  goToProfile() {
    this.props.history.push({
      pathname: '/broadcast/profile'
    })
  }

  render() {
    console.log(this.state.audioSources);
    var dropDown = (
      <DropDownMenu value={this.state.selectedSource} onChange={this.sourceInput.bind(this)}>
        <MenuItem value={null} key={null} primaryText={"Select a source..."} />
        {this.state.audioSources.map(source => <MenuItem value={source.id} key={source.id} primaryText={source.label} />)}
      </DropDownMenu>
    )

    return (
      <div style={styles.container}>
        <NavBar history={this.history}/>
        <div style={styles.cardContainer}>
          
          <Card style={styles.mainBox}>
            <a href="#">
            <CardHeader
              onClick={this.goToProfile.bind(this)}
              title={this.state.artistAlias}
              subtitle={this.state.artist}
            /></a>
            <CardMedia style={styles.streamImage}>
              <img src={this.state.artistImage}/>
            </CardMedia>
        
            <CardActions>
              <FloatingActionButton onClick={this.startBroadcast.bind(this)} disabled={this.state.disabled}>
                <Mic />
              </FloatingActionButton>
              <FloatingActionButton onClick={this.stopBroadcast.bind(this)} disabled={!this.state.disabled}>
               <MicOff />
              </FloatingActionButton>
              {dropDown}
            </CardActions>

            <CardTitle title={this.state.name}/>
            <CardText>
              {this.state.description}
            </CardText>
          </Card>
          <Card style={styles.box}>
            <CardText>
                <h2>STATS <TrendingUp /></h2>
                <div><span style={styles.count}>{this.state.listnerLiveCount.toLocaleString()}</span><span> Listens <Face /></span></div>
                <div><span style={styles.count}>{this.state.heartCount.toLocaleString()}</span><span> Hearts <Favorite color={Colors.red500}/></span></div>
            </CardText>
            <div id="canvas-container">
              <canvas width="600" height="100" id="canvas"></canvas>
            </div>
          </Card>

        </div>
      </div>
    )
  } 
}

var styles = {
  container:{
    'display': 'flex',
    'flexDirection' :'column',
  },

  cardContainer:{
    'display': 'flex',
    'flexDirection':'row',
    'flexWrap': 'wrap'
  },

  box: {
    'flex':1
  },

  mainBox: {
    'flexGrow':1,
    'maxWidth': '600px'
  },

  streamImage:{
    'maxWidth': '300px'
  },

  count:{
    fontWeight: 'bold'
  }
}

reactMixin.onClass(BroadcastLive, History);

export default BroadcastLive;
