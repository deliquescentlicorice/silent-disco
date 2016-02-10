import React from 'react';

// CLIENTID
import SC_Client from '../../server/config/apiKeys';

// COMPONENTS
import BroadcastSCEntry from './BroadcastSCEntry.js';
import BroadcastQueueEntry from './BroadcastQueueEntry.js';
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
    this.props.submitSearch(this.refs.soundQuery.getValue())
    this.props.submitSearch(this.refs.soundQuery.setValue(""))
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

  render() {
    console.log(this.props)
    return (
      <div style={styles.cardContainer}>
        <Card style={styles.box}>
          <List subheader="Now Playing">
            <ListItem
              primaryText={this.props.currentSong.title}
              secondaryText={this.props.currentSong.genre}
              leftAvatar={<Avatar src={this.props.currentSong.artwork_url || this.props.currentSong.user.avatar_url} />}
              disabled={true} />
          </List>
          <br/>
          <FloatingActionButton onClick={this.props.startHTMLBroadcast} disabled={this.props.disabled}>
            <Mic />
          </FloatingActionButton>
          <FloatingActionButton onClick={this.props.stopBroadcast} disabled={!this.props.disabled}>
            <MicOff />
          </FloatingActionButton>
          <BroadcastAudioPlayer
            src={this.props.currentSong.stream_url + '?client_id=' + SC_Client.clientID}
            handleMediaEnd={this.props.handleMediaEnd} />
          <Tabs>
            <Tab label="Playlist">
              <List subheader="Up Next">
                {this.props.songQueue.map(this.renderQueueEntry.bind(this))}
              </List>
              <List subheader="Played">
                {this.props.endedSongQueue.map(this.renderQueueEntry.bind(this))}
              </List>
            </Tab>
            <Tab label="Favorites">
              <List subheader="Select Songs for the Queue">
                {this.props.favorites.map(this.renderSCEntry.bind(this))}
              </List>
            </Tab>
            <Tab label="Search Soundcloud">
              <TextField
                ref="soundQuery"
                hintText="Search Soundcloud"
                floatingLabelText="Search Soundcloud" /> 
              <FlatButton
                onClick={this.searchSC.bind(this)}
                label="Search"
                primary={true} />
              {this.props.searchResults.map(this.renderSCEntry.bind(this))}
                <FlatButton
                  onClick={this.props.loadMoreSongs}
                  label="More Songs"
                  primary={true} />
            </Tab>
          </Tabs>
        </Card>
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
  }
}

export default BroadcastLiveViewSC;