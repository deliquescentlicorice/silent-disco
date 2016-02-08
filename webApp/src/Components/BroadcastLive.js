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
import Tabs from '../../node_modules/material-ui/lib/tabs/tabs';
import Tab from '../../node_modules/material-ui/lib/tabs/tab';


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
      isLoading: true,
      songQueue:[],
      search: "",
      searchResults:[],
      nextSearch:'',
      currentSong: {
        title:"",
        genre:"",
        artwork_url:"",
        user: {
          avatar_url:""
        }

      }
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
        favorites: fav
      });

    });
  }
  startHTMLBroadcast(){
    this.bc.startFromHTML("soundcloudPlayer");
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
    let newQueue = this.state.songQueue
    newQueue.push(selectedSong)
    if(newQueue.length===1){
      this.setState({
        songQueue: newQueue,
        currentSong: newQueue[0]
      })
    } else {
      this.setState({
        songQueue: newQueue
      })
    }
    
    console.log(this.state)
  }

  searchInput(event, index, value) {
    this.setState({
      search: event.target.value
    });
  }

  submitSearch(event) {
    //get the value of search
    let search = this.state.search

    //query the soundcloud database
    SC.initialize({
      client_id: SC_Client.clientID
    });

    var page_size = 10;

    SC.get('/tracks', {
      limit: page_size, linked_partitioning: 1, q: search
    }).then((tracks) => {
      // page through results, 100 at a time
      console.log('track results', tracks)
      this.setState({
        search: "",
        searchResults:tracks.collection,
        nextSearch:tracks.next_href
      })
      
    });
  }

  loadMoreSongs(){
    let query = this.state.nextSearch

    SC.get(query).then((tracks) => {
      // page through results, 100 at a time
      console.log('track results', tracks)
      this.setState({
        search: "",
        searchResults:tracks.collection,
        nextSearch:tracks.next_href || ''
      })
      
    });
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
    if (!this.state.isLoading) {
      partial = (
        <div>
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
          </div>
          <div style={styles.cardContainer}>
            <Card style={styles.box}>
              <CardTitle title="Soundcloud Setlist"/>
              <List subheader="Now Playing">
                <ListItem
                  // onClick={this.props.goToStream.bind(this)}
                  primaryText={this.state.currentSong.title}
                  secondaryText={this.state.currentSong.genre}
                  leftAvatar={<Avatar src={this.state.currentSong.artwork_url || this.state.currentSong.user.avatar_url} />}
                  // secondaryText={this.state.favorites[2].stream_url}
                  // rightIcon={<PlayCircleOutline />}
                />
              </List>
              <br/>
              <audio autoPlay crossOrigin="anonymous" id="soundcloudPlayer" src={this.state.currentSong.stream_url + '?client_id=' + SC_Client.clientID } controls ></audio> <br/>
              <br/>
              <FloatingActionButton onClick={this.startHTMLBroadcast.bind(this)}>
                <Mic />
              </FloatingActionButton>
              <FloatingActionButton onClick={this.stopHTMLBroadcast.bind(this)} >
               <MicOff />
              </FloatingActionButton><br/><br/>
              <Tabs>
                <Tab label="Up Next">
                  <List subheader="">
                    {this.state.songQueue.map(this.renderSCEntry.bind(this))}
                  </List>
                </Tab>
                <Tab label="Favorites">
                  <List subheader="Select Songs for the Queue">
                    {this.state.favorites.map(this.renderSCEntry.bind(this))}
                  </List>
                </Tab>
                <Tab label="Search Soundcloud">
                  <TextField
                    onChange={this.searchInput.bind(this)}
                    hintText="Search Soundcloud"
                    floatingLabelText="Search Soundcloud"
                  /> 
                  <FlatButton
                    onClick={this.submitSearch.bind(this)}
                    label="Search"
                    primary={true} 
                  />
                  {this.state.searchResults.map(this.renderSCEntry.bind(this))}
                    <FlatButton
                      onClick={this.loadMoreSongs.bind(this)}
                      label="More Songs"
                      primary={true} 
                    />
                    
                </Tab>
              </Tabs>
            </Card>
          </div>
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


