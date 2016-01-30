import React, { Component } from 'react';
import ReactDOM from 'react-dom';

// COMPONENTS
import TitleBar from './TitleBar.js';

// MEDIA PLAYER
import Sound from '../../node_modules/react-sound';

//  RESPONSIVE CSS
import MediaQuery from '../../node_modules/react-responsive';

// MATERIAL DESIGN
import Card from '../../node_modules/material-ui/lib/card/card';
import CardActions from '../../node_modules/material-ui/lib/card/card-actions';
import CardMedia from '../../node_modules/material-ui/lib/card/card-media';
import CardTitle from '../../node_modules/material-ui/lib/card/card-title';
import FloatingActionButton from '../../node_modules/material-ui/lib/floating-action-button';
import Play from '../../node_modules/material-ui/lib/svg-icons/av/play-arrow';
import Pause from '../../node_modules/material-ui/lib/svg-icons/av/pause';
import Favorite from '../../node_modules/material-ui/lib/svg-icons/action/favorite';
import AppBar from '../../node_modules/material-ui/lib/app-bar';
// import CardHeader from '../../node_modules/material-ui/lib/card/card-header';
// import CardText from '../../node_modules/material-ui/lib/card/card-text';

class SongPlayer extends React.Component {
  
  constructor(props){
    super(props);

    this.state = {
      status : "STOPPED",
      disabled : false
    }
    
  }

  playSong() {
    console.log("playSong")
    this.setState({
      status: "PLAYING",
      disabled: true
    });
    
  }

  stopSong() {
    console.log("stopSong")
    this.setState({
      status: "STOPPED",
      disabled: false
    });
    
  }

  addHeart() {
    console.log("adding heart!")
  }

  render() {
    return (
      <div style={styles.mainContainer}>
          <AppBar title={'Now Playing'} showMenuIconButton={false}/>
        <div style={styles.playerContainer}>
          <MediaQuery minWidth={1081}>
            <div style={styles.padding}></div>
          </MediaQuery>
          
            <Card style={styles.card}>
              <CardMedia style={styles.image}>
                <img src={this.props.location.state.song.image} />
              </CardMedia>
              <CardTitle title={this.props.location.state.song.name} subtitle={this.props.location.state.song.artist}  />
              <CardActions>
                <FloatingActionButton onClick={this.playSong.bind(this)} secondary={true} disabled={this.state.disabled}>
                  <Play />
                </FloatingActionButton>
                <span></span>
                <FloatingActionButton onClick={this.stopSong.bind(this)} secondary={true}  disabled={!this.state.disabled}>
                  <Pause />
                </FloatingActionButton>
                <FloatingActionButton onClick={this.addHeart.bind(this)}>
                  <Favorite />
                </FloatingActionButton>
              </CardActions>
            </Card>
        
          <MediaQuery minWidth={1081}>
            <div style={styles.padding}></div>
          </MediaQuery>
        </div>
        
        <Sound
          url={this.props.location.state.song.url}
          playStatus={this.state.status}
          onLoading={this.handleSongLoading}
          onPlaying={this.handleSongPlaying}
          onFinishedPlaying={this.handleSongFinishedPlaying} />
      </div>
    )
  }
}

var styles = {
  
  mainContainer: {
    'display': 'flex',
    'flex-direction':'column',
    'border': '10px solid purple',
    'height': '100%',
    'width': 'auto'

  },

  playerContainer: {
    'display': 'flex',
    'flex-direction':'row',
    'justify-content':'center',
    'border': '10px solid goldenrod',
  },

  card: {
    'flex':2,
    'align-content': 'center',
    'border': '10px solid yellow',
    'height': '100vh'
  },

  padding: {
    'flex':1,
    'border': '10px solid red',
  }
}

export default SongPlayer;