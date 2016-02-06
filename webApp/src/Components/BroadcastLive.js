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

import ListItem from '../../node_modules/material-ui/lib/lists/list-item';
import Avatar from '../../node_modules/material-ui/lib/avatar';
import PlayCircleOutline from 'material-ui/lib/svg-icons/av/play-circle-outline';
import List from '../../node_modules/material-ui/lib/lists/list';

// ROUTER
import { History } from 'react-router';
import reactMixin from 'react-mixin';

// COMPONENTS
import NavBar from './NavBar.js';
import Loading from './Loading.js';
import BroadcastStats from './BroadcastStats.js';
import BroadcastAUX from './BroadcastAUX.js';
import BroadcastSCEntry from './BroadcastSCEntry.js';

// VISUALIZER
import visualizer from './visualizer.js';

// AJAX GET CALL
import $ from '../../public/js/jquery-1.11.1.min';

//CLIENTID
import SC_Client from '../../server/config/apiKeys'

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
      audioSources: [],
      isLoading: true
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
    console.log(this.props.params.streamId);
    this.bc = new Broadcaster(this.props.params.streamId, this.gotMediaDevices.bind(this), visualizer);
    this.fetchData();
  }

  componentWillUnmount() {
    this.bc.stop();
  }

  fetchData() {
    $.ajax({
      url: '/api/stream/' + this.props.params.streamId
    })
    .done((stream) => {
      let fav = JSON.parse(localStorage.getItem("favorites"));
      console.log('State',stream);
      this.setState({
        name: stream.name,
        description: stream.description,
        heartCount: stream.heartCountNum,
        listenerLiveCount: stream.listenerLiveCount,
        listenerMaxCount: stream.listenerMaxCount,
        isLoading: false,
        creator: stream.creator,
        broadcaster: stream.broadcaster,
        playing: stream.playing,
        favorites: fav,
        currentSong: fav[2] || null
      });

    });
  }
  startHTMLBroadcast(){
    this.bc.startFromHTML("playerID");
  }

  stopHTMLBroadcast(){
    this.bc.stop();
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
    console.log("value",value)
    this.setState({
      selectedSource: value
    })
    console.log("changed state",this.state)
  }

  goToProfile() {
    this.props.history.push({
      pathname: '/user/'+ this.state.creator
    })
  }

  changeSCSong(selectedSong){
    console.log("currentSong", this)
    console.log("selectedSong", selectedSong)

    this.setState({
      currentSong: selectedSong
    })
    console.log(this.state)
  }

  renderSCEntry(key){
    return <BroadcastSCEntry history={this.history} changeSCSong={this.changeSCSong.bind(this)} state={this.state} key={key.id} index={key} title={key.title} genre={key.genre} stream_url={key.stream_url} artwork={key.artwork_url || key.user.avatar_url} />
  }

  render() {
    var dropDown = (
      <DropDownMenu value={this.state.selectedSource} onChange={this.sourceInput.bind(this)}>
        <MenuItem value={null} key={null} primaryText={"Select a source..."} />
        {this.state.audioSources.map(source => <MenuItem value={source.id} key={source.id} primaryText={source.label} />)}
      </DropDownMenu>
    )

    var partial = <Loading />
    console.log("state", this.state)
    if (!this.state.isLoading) {
      partial = (
        <div style={styles.cardContainer}>
          <Card style={styles.mainBox}>
            <a href="#">
            <CardHeader
              onClick={this.goToProfile.bind(this)}
              title={this.state.artistAlias}
              subtitle={this.state.artist}
              avatar={this.state.artistImage}
            /></a>
            <CardMedia style={styles.streamImage}>
              <img src={this.state.artistImage}/>
            </CardMedia>
        

            <CardActions>
              <FloatingActionButton onClick={this.startBroadcast.bind(this)} disabled={this.disabled}>
                <Mic />
              </FloatingActionButton>
              <FloatingActionButton onClick={this.stopBroadcast.bind(this)} disabled={!this.disabled}>
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
            <BroadcastStats listenerLiveCount={this.state.listenerLiveCount} listenerMaxCount={this.state.listenerMaxCount} heart={this.state.heartCount}/>
            <canvas width="600" height="100" id="visualizer"></canvas>
          </Card>
          <Card style={styles.box}>
            <CardTitle title="Now Playing"/>
            <List>
              <ListItem
                // onClick={this.props.goToStream.bind(this)}
                primaryText={this.state.currentSong.title}
                secondaryText={this.state.currentSong.genre}
                leftAvatar={<Avatar src={this.state.currentSong.artwork_url || this.state.currentSong.user.avatar_url} />}
                // secondaryText={this.state.favorites[2].stream_url}
                // rightIcon={<PlayCircleOutline />}
              />
            </List>
            <audio crossOrigin="anonymous" id="playerID" src={this.state.currentSong.stream_url + '?client_id=' + SC_Client.clientID } controls ></audio>

            <FloatingActionButton onClick={this.startHTMLBroadcast.bind(this)}>
              <Mic />
            </FloatingActionButton>
            <FloatingActionButton onClick={this.stopHTMLBroadcast.bind(this)} >
             <MicOff />
            </FloatingActionButton>
            <List>
              {this.state.favorites.map(this.renderSCEntry.bind(this))}
            </List>
          </Card>
        </div>
      )
    }
    return (
      <div style={styles.container}>
        <NavBar history={this.history}/>
        {partial}
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
    'flex':3
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

// var dropDown = (
//       <DropDownMenu value={this.state.selectedSource} onChange={this.sourceInput.bind(this)}>
//         <MenuItem value={null} key={null} primaryText={"Select a source..."} />
//         {this.state.audioSources.map(source => <MenuItem value={source.id} key={source.id} primaryText={source.label} />)}
//       </DropDownMenu>
//     )

// <BroadcastAUX 
              // startBroadcast={this.startBroadcast}
              // stopBroadcast={this.stopBroadcast}
              // disabled={this.state.disabled}
              // selectedSource={this.state.selectedSource}
              // sourceInput={this.sourceInput}
              // audioSources={this.state.audioSources}
            // />


