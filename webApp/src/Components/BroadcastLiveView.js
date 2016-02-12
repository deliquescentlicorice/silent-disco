import React from 'react';

// COMPONENTS
import BroadcastStats from './BroadcastStats.js';
import BroadcastLiveViewAUX from './BroadcastLiveViewAUX.js';
import BroadcastLiveViewSC from './BroadcastLiveViewSC.js';

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
import Tabs from '../../node_modules/material-ui/lib/tabs/tabs';
import Tab from '../../node_modules/material-ui/lib/tabs/tab';

import Paper from '../../node_modules/material-ui/lib/paper';

import ListItem from '../../node_modules/material-ui/lib/lists/list-item';
import Avatar from '../../node_modules/material-ui/lib/avatar';
import PlayCircleOutline from 'material-ui/lib/svg-icons/av/play-circle-outline';
import List from '../../node_modules/material-ui/lib/lists/list';

class BroadcastLiveView extends React.Component {
  render() {
    var partial;

    if (this.props.isLive === "AUX") {
      partial = (
        <div style={styles.aux}>
          <div style={styles.visualizerContainer}>
            <canvas style={styles.visualizer} id="visualizer"></canvas>
          </div>
          <BroadcastLiveViewAUX
            startBroadcast={this.props.startBroadcast}
            stopBroadcast={this.props.stopBroadcast}
            sourceInput={this.props.sourceInput}
            audioSources={this.props.state.audioSources}
            selectedSource={this.props.state.selectedSource}
            disabled={this.props.state.disabled} />
        </div>
      )
    } else if (this.props.isLive === "SC") {
      partial = <BroadcastLiveViewSC
        submitSearch={this.props.submitSearch}
        addSongToQueue={this.props.addSongToQueue}
        removeSongFromQueue={this.props.removeSongFromQueue}
        currentSong={this.props.state.currentSong}
        handleMediaEnd={this.props.handleMediaEnd}
        startHTMLBroadcast={this.props.startHTMLBroadcast}
        stopBroadcast={this.props.stopBroadcast}
        loadMoreSongs={this.props.loadMoreSongs}
        songQueue={this.props.state.songQueue}
        endedSongQueue={this.props.state.endedSongQueue}
        favorites={this.props.state.favorites}
        searchResults={this.props.state.searchResults}
        disabled={this.props.state.disabled} />
    }

    return (
      <div>
        <div style={styles.cardContainer}>
          <Card style={styles.mainBox}>
            {partial}
          </Card>
          <Card style={styles.box}>
            <BroadcastStats 
              listenerLiveCount={this.props.state.listenerLiveCount} 
              listenerMaxCount={this.props.state.listenerMaxCount} 
              listenerTotalCount={this.props.state.listenerTotalCount}
              heart={this.props.state.heartCount} />
            <a href="#">
              <CardHeader
                onClick={this.props.goProfile}
                title={this.props.state.artistAlias}
                subtitle={this.props.state.artist}
                avatar={this.props.state.artistImage} />
            </a>
            <div style={styles.image}>
              <CardMedia style={styles.streamImage}>
                <img src={this.props.state.streamImage}/>
              </CardMedia>
            </div>
            <CardTitle title={this.props.state.name}/>
            <CardText>
              {this.props.state.description}
            </CardText>
          </Card>
        </div>
      </div>
    )
  }
}

var styles = {
  aux: {
    'position': 'absolute',
    'top': '30%'
  },

  cardContainer:{
    'display': 'flex',
    'flexDirection':'row',
    'flexWrap': 'wrap'
  },

  box: {
    'flex': 2
  },

  mainBox: {
    'flex': 3,
  },

  image: {
    'display':'flex',
    'justifyContent':'center'
  },

  streamImage:{
    'maxWidth': '300px',
    'border': 'solid 1px grey',
    'padding': '5px'
  },

  count:{
    'fontWeight': 'bold'
  },

  visualizer: {
    'width': '100%',
    'height': '100%'
  },

  visualizerContainer: {
    'height': '300px',
    'margin': '10px',
    'border': '1px solid black'
  }
}

export default BroadcastLiveView;
