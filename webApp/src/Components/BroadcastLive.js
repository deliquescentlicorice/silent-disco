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

// VISUALIZER
import visualizer from './visualizer.js';

// AJAX GET CALL
import $ from '../../public/js/jquery-1.11.1.min';

class BroadcastLive extends React.Component {
  constructor(props) {
    var user = JSON.parse(localStorage.getItem("me"));
    super(props);
    this.state = {
      disabled: false,
      heartCount: 4000,
      listenerLiveCount: 1000,
      listenerMaxCount: 1000000,
      name: "Screw It, We're Doing It Live",
      description: "Description of the station",
      artist: user.full_name || "pseudonymous",
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
    this.bc = new Broadcaster(this.props.location.state.streamId, this.gotMediaDevices.bind(this), visualizer);
    this.fetchData();
  }

  fetchData() {
    $.ajax({
      url: '/api/stream/'+this.props.location.state.streamId
    })
    .done((stream) => {
      this.setState({
        name: stream.name,
        description: stream.description,
        heartCount: stream.heartCountNum,
        listenerLiveCount: stream.listenerLiveCount,
        listenerMaxCount: stream.listenerMaxCount
      });
      console.log('State',this.state);
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
      pathname: '/profile/'+ this.state.stream.creator
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
                <div><span style={styles.count}>{this.state.listenerMaxCount.toLocaleString()}</span><span> Total Listeners <Face /></span></div>
                <div><span style={styles.count}>{this.state.listenerLiveCount.toLocaleString()}</span><span> Current Listeners <Face /></span></div>
                <div><span style={styles.count}>{this.state.heartCount.toLocaleString()}</span><span> Hearts <Favorite color={Colors.red500}/></span></div>
            </CardText>
            <canvas width="600" height="100" id="visualizer"></canvas>
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
