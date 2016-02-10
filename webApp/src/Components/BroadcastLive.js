import React from 'react';

// ROUTER
import { History } from 'react-router';
import reactMixin from 'react-mixin';

// COMPONENTS
import NavBar from './NavBar.js';
import BroadcastLiveView from './BroadcastLiveView.js';
import Loading from './Loading.js';

// VISUALIZER
import visualizer from './visualizer.js';

// CLIENTID
import SC_Client from '../../server/config/apiKeys';

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
      }, 
      endedSongQueue:[]
    };
  }

  gotMediaDevices(devices) {
    var audioSources = [];
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

  startHTMLBroadcast() {
    this.bc.startFromHTML("soundcloudPlayer");
  }

  stopHTMLBroadcast() {
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
    });
    this.bc.stop();
  }

  handleMediaEnd() {
    let newQueue = this.state.songQueue;
    let endedQueue = this.state.endedSongQueue;
    if (newQueue.length === 1) {
      let playedSong = newQueue.shift();
      endedQueue.push(playedSong);
      this.setState({
        songQueue: newQueue,
        currentSong: {
          title:"",
          genre:"",
          artwork_url:"",
          user: {
            avatar_url:""
          }
        },
        endedSongQueue: endedQueue
      });
    } else if (newQueue.length>1) {
      let playedSong = newQueue.shift();
      endedQueue.push(playedSong);
      this.setState({
        songQueue: newQueue,
        currentSong: newQueue[0],
        endedSongQueue: endedQueue
      });
    } 
  }

  sourceInput(event, index, value) {
    this.setState({
      selectedSource: value
    });
  }

  goToProfile() {
    this.props.history.push({
      pathname: '/user/'+ this.state.creator
    });
  }

  addSongToQueue(selectedSong) {
    let newQueue = this.state.songQueue;
    newQueue.push(selectedSong);
    if (newQueue.length === 1) {
      this.setState({
        songQueue: newQueue,
        currentSong: newQueue[0]
      });
    } else {
      this.setState({
        songQueue: newQueue
      });
    }
  }

  submitSearch(event) {
    //get the value of search
    let search = this.state.search;

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
      });
    });
  }

  loadMoreSongs() {
    let query = this.state.nextSearch;
    $.get(query).then((tracks) => {
      // page through results, 100 at a time
      this.setState({
        search: "",
        searchResults:tracks.collection,
        nextSearch:tracks.next_href || ''
      });
    });
  }

  removeSongFromQueue(song) {
    let newQueue = this.state.songQueue;
    newQueue.splice(song,1);
    this.setState({
      songQueue: newQueue
    });
  }

  render() {
    var partial = <Loading />
    if (!this.state.isLoading) {
      partial = <BroadcastLiveView
        addSongToQueue={this.addSongToQueue.bind(this)}
        removeSongFromQueue={this.removeSongFromQueue.bind(this)}
        sourceInput={this.sourceInput.bind(this)}
        goProfile={this.goToProfile.bind(this)}
        startBroadcast={this.startBroadcast.bind(this)}
        stopBroadcast={this.stopBroadcast.bind(this)}
        handleMediaEnd={this.handleMediaEnd.bind(this)}
        startHTMLBroadcast={this.startHTMLBroadcast.bind(this)}
        stopHTMLBroadcast={this.stopHTMLBroadcast.bind(this)}
        submitSearch={this.submitSearch.bind(this)}
        loadMoreSongs={this.loadMoreSongs.bind(this)}
        state={this.state} />
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
  }
}

reactMixin.onClass(BroadcastLive, History);

export default BroadcastLive;
