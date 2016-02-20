import React from 'react';

// CLIENTID
import SC_Client from '../../server/config/apiKeys';

// COMPONENTS
import BroadcastSCEntry from './BroadcastSCEntry.js';
import BroadcastQueueEntry from './BroadcastQueueEntry.js';
import BroadcastPlayedEntry from './BroadcastPlayedEntry.js';
import BroadcastAudioPlayer from './BroadcastAudioPlayer.js';

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

class BroadcastLiveViewSC extends React.Component {
  searchSC() {
    this.props.submitSearch(this.refs.soundQuery.getValue());
  }

  showVisualizerIfOnTheAir() {
    // this is used to disable/enable broadcast buttons lower down
    // rather than passing in another prop, we'll use this 
    return this.props.disabled ? (
      <canvas style={styles.visualizer} id="visualizer"></canvas>
    ) : (
      <div style={styles.offTheAir}>OFF THE AIR</div>
    )
  }

  forceNewBroadcastAfterStop() {
    return this.props.hasBroadcasted ? (
      <div>Thank you for broadcasting!</div>
    ) : (
      <div>
        <FloatingActionButton
          style={styles.button}
          onClick={this.props.startHTMLBroadcast}
          disabled={this.props.disabled}>
          <Mic />
        </FloatingActionButton>
        <FloatingActionButton
          style={styles.button}
          onClick={this.props.stopBroadcast}
          disabled={!this.props.disabled}>
          <MicOff />
        </FloatingActionButton>
      </div>
    )
  }

  renderEntriesOrReturnPlaceholder(array, renderCallback, placeholderText) {
    // second check allows this function to check currentSong
    if (!array[0] || !array[0].title) {
      return <ListItem disabled={true} style={styles.noSong}><div>{placeholderText}</div></ListItem>
    } else {
      return array.map(renderCallback);
    }
  }

  renderSCEntry(track, key){
    return <BroadcastSCEntry
      addSongToQueue={this.props.addSongToQueue}
      key={key}
      index={key}
      track={track}
    />
  }

  renderQueueEntry(track, key){
    return <BroadcastQueueEntry
      removeSongFromQueue={this.props.removeSongFromQueue}
      key={key}
      index={key}
      track={track}
    />
  }

  renderPlayedEntry(track, key){
    return <BroadcastPlayedEntry
      key={key}
      index={key}
      track={track}
    />
  }

  render() {
    var moreSongsButton = this.props.searchResults < 10 ? (
      <span></span>
    ) : (
      <CardActions style={styles.actions}>
        <FlatButton
          onClick={this.props.loadMoreSongs}
          label="More Songs"
          primary={true} />
      </CardActions>
    )

    return (
      <div style={styles.cardContainer}>
        <Card style={styles.box}>
          <List subheader="Now Playing">
            {this.renderEntriesOrReturnPlaceholder([this.props.currentSong], this.renderPlayedEntry.bind(this), "Select a Song and Click the 'Mic' Button to Begin Broadcasting")}
          </List>
          <br/>
          <CardActions style={styles.controls}>
            {this.forceNewBroadcastAfterStop()}
            <div style={styles.visualizerContainer}>
              {this.showVisualizerIfOnTheAir()}
            </div>
            <BroadcastAudioPlayer
              src={this.props.currentSong.stream_url + '?client_id=' + SC_Client.clientID}
              handleMediaEnd={this.props.handleMediaEnd} />
          </CardActions>
          <Tabs>
            <Tab label="Playlist">
              <List subheader="Up Next">
                {this.renderEntriesOrReturnPlaceholder(this.props.songQueue, this.renderQueueEntry.bind(this), "No Songs in Queue")}
              </List>
              <List subheader="Played">
                {this.renderEntriesOrReturnPlaceholder(this.props.endedSongQueue, this.renderPlayedEntry.bind(this), "No Songs Have Been Played")}
              </List>
            </Tab>
            <Tab label="Favorites">
              <List subheader="Select Songs for the Queue">
                {this.renderEntriesOrReturnPlaceholder(this.props.favorites, this.renderSCEntry.bind(this), "You Don't Have Any SoundCloud Favorites")}
              </List>
            </Tab>
            <Tab label="Search Soundcloud">
              <div style={styles.searchControl}>
                <TextField
                  ref="soundQuery"
                  hintText="Search Soundcloud"
                  floatingLabelText="Search Soundcloud" />
                <FlatButton
                  onClick={this.searchSC.bind(this)}
                  label="Search"
                  primary={true} />
              </div>
              {this.renderEntriesOrReturnPlaceholder(this.props.searchResults, this.renderSCEntry.bind(this), "No Songs")}
              {moreSongsButton}
            </Tab>
          </Tabs>
        </Card>
      </div>
    )
  }
}

var styles = {
  cardContainer: {
    'flex': 3
  },

  controls: {
    'display': 'flex',
    'justifyContent': 'space-around',
    'alignItems': 'center'
  },

  visualizer: {
    'width': '100%',
    'height': '100%'
  },

  visualizerContainer: {
    'display': 'flex',
    'width': '100px',
    'height': '60px',
    'alignItems': 'center'
  },

  offTheAir: {
    'color': 'red'
  },

  noSong: {
    'display': 'flex',
    'justifyContent':'center'
  },

  action: {
    'display': 'flex',
    'flexDirection': 'row',
    'justifyContent': 'flex-end'
  },

  button: {
    'margin': '8px'
  },

  searchControl: {
    'margin': '0 15px'
  },

  box: {
    'flex':3
  }
}

export default BroadcastLiveViewSC;