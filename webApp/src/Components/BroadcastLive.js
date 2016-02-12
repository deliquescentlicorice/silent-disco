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

// MATERIAL UI
import Card from 'material-ui/lib/card/card';

class BroadcastLive extends React.Component {
  constructor(props) {
    var user = JSON.parse(localStorage.getItem("me"));
    super(props);
    this.state = {
      disabled: false,
      hasBroadcasted: false,
      heartCount: 0,
      listenerLiveCount: 0,
      listenerMaxCount: 0,
      listenerTotalCount: 0,
      name: "Screw It, We're Doing It Live",
      description: "Description of the station",
      artist: user.full_name || "pseudonymous",
      artistAlias: user.username || "QuantumRadio Broadcaster",
      artistImage: user.avatar_url,
      streamImage: "",
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

  componentDidMount(){
    //add bclient on handler here
    window.bClient.on('stream', function(data, meta) {
      if (meta.type === 'event') {
        if (meta.action === 'enterStream' || meta.action === 'leaveStream' || meta.action === 'upHeart') {
          if (meta.streamId === this.props.params.streamId) {

            $.ajax({
              url: '/api/stream/' + this.props.params.streamId
            })
            .done((stream) => {
              this.setState({
                heartCount: stream.heartCountNum,
                listenerLiveCount: stream.listenerLiveCount,
                listenerMaxCount: stream.listenerMaxCount,
                listenerTotalCount: stream.listenerTotalCount
              });
            });
          }
        }
      }
    }.bind(this));
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
        listenerTotalCount: stream.listenerTotalCount,
        isLoading: false,
        creator: stream.creator,
        broadcaster: stream.broadcaster,
        streamImage: stream.streamImage,
        playing: stream.playing,
        favorites: fav
      });
    });
  }

  startHTMLBroadcast() {
    if (this.state.currentSong.title) {
      this.setState({
        disabled: true
      }, () => {
        this.bc.startFromHTML("soundcloudPlayer");
      });
    }
  }

  startBroadcast() {
    if (this.state.selectedSource) {
      this.setState({
        disabled: true
      }, () => {
        this.bc.start(this.state.selectedSource);
      });
    }
  }

  stopBroadcast() {
    this.setState({
      disabled: false,
      hasBroadcasted: true
    }, () => {
      this.bc.stop();
    });
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
      pathname: '/user/' + this.state.creator
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

  submitSearch(query) {
    SC.initialize({
      client_id: SC_Client.clientID
    });

    var page_size = 10;

    SC.get('/tracks', {
      limit: page_size, linked_partitioning: 1, q: query
    }).then((tracks) => {
      // page through results, 100 at a time
      this.setState({
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
        startHTMLBroadcast={this.startHTMLBroadcast.bind(this)}
        handleMediaEnd={this.handleMediaEnd.bind(this)}
        submitSearch={this.submitSearch.bind(this)}
        loadMoreSongs={this.loadMoreSongs.bind(this)}
        isLive={this.props.location.state.isLive}
        state={this.state} />
    }
    return (
      <Card style={styles.container}>
        <NavBar title="Broadcast" history={this.history}/>
        {partial}
      </Card>
    )
  } 
}

var styles = {
  container:{
    'maxWidth': '1280px',
    'margin': '15px auto',
    'display': 'flex',
    'flexDirection' :'column'
  }
}

reactMixin.onClass(BroadcastLive, History);

export default BroadcastLive;
