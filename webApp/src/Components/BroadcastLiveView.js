import React from 'react';

// COMPONENTS
import BroadcastStats from './BroadcastStats.js';
import BroadcastAUX from './BroadcastAUX.js';
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
    var dropDown = (
      <DropDownMenu value={this.props.state.selectedSource} onChange={this.props.sourceInput}>
        <MenuItem value={null} key={null} primaryText={"Select a source..."} />
        {this.props.state.audioSources.map(source => <MenuItem value={source.id} key={source.id} primaryText={source.label} />)}
      </DropDownMenu>
    )

    return (
      <div>
        <div style={styles.cardContainer}>
          <Card style={styles.mainBox}>
            <a href="#">
            <CardHeader
              onClick={this.props.goProfile}
              title={this.props.state.artistAlias}
              subtitle={this.props.state.artist}
              avatar={this.props.state.artistImage}
            /></a>
            <CardMedia style={styles.streamImage}>
              <img src={this.props.state.artistImage}/>
            </CardMedia>
            <CardActions>
              <FloatingActionButton onClick={this.props.startBroadcast} disabled={this.props.state.disabled}>
                <Mic />
              </FloatingActionButton>
              <FloatingActionButton onClick={this.props.stopBroadcast} disabled={!this.props.state.disabled}>
               <MicOff />
              </FloatingActionButton>
              {dropDown}
            </CardActions>
            <CardTitle title={this.props.state.name}/>
            <CardText>
              {this.props.state.description}
            </CardText>
          </Card>
          <Card style={styles.box}>
            <BroadcastStats 
              listenerLiveCount={this.props.state.listenerLiveCount} 
              listenerMaxCount={this.props.state.listenerMaxCount} 
              heart={this.props.state.heartCount}/>
            <canvas width="600" height="100" id="visualizer"></canvas>
          </Card>
        </div>
        <BroadcastLiveViewSC
          submitSearch={this.props.submitSearch}
          addSongToQueue={this.props.addSongToQueue}
          removeSongFromQueue={this.props.removeSongFromQueue}
          currentSong={this.props.state.currentSong}
          handleMediaEnd={this.props.handleMediaEnd}
          startHTMLBroadcast={this.props.startHTMLBroadcast}
          stopHTMLBroadcast={this.props.stopHTMLBroadcast}
          loadMoreSongs={this.props.loadMoreSongs}
          songQueue={this.props.state.songQueue}
          endedSongQueue={this.props.state.endedSongQueue}
          favorites={this.props.state.favorites}
          searchResults={this.props.state.searchResults} />
      </div>
    )
  }
}

var styles = {
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

export default BroadcastLiveView;