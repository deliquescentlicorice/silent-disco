import React from 'react';

// COMPONENTS
import NavBar from './NavBar.js';
import Loading from './Loading.js'
import StreamLiveView from './StreamLiveView.js';

// MEDIA PLAYER
import Sound from '../../node_modules/react-sound';

import $ from '../../public/js/jquery-1.11.1.min';

var BASE_URL = 'http://' + document.location.host;

class StreamLive extends React.Component {

  constructor(props){
    super(props);

    this.state = {
      status : "STOPPED",
      disabled : false,
      desc: "",
      name: "",
      broadcaster: "",
      image: "",
      listenerLiveCount: "",
      listenerMaxCount: "",
      heartCount: 0,
      creator: "",
      isLoading: true,
      image: "",
      soundcloud: "",
      website: "",
      websiteTitle: "",
      streamId: this.props.params.streamId || window.location.pathname.substr(8)
    }
  }

  componentDidMount() {
    this.fetchStreamData();
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
    var PUT_HEART = BASE_URL + '/api/stream/' + this.state.streamId;

    // As of iOS 9.3 and OSX 10.11, Safari does not support fetch
    $.ajax({
        url: PUT_HEART,
        method: 'PUT',
        contentType: "application/x-www-form-urlencoded",
        data: ''
      })
      .done((responseData) => {
        this.setState({
          heartCount: responseData.heartCountNum.length > 5 ? '> 9 999' : responseData.heartCountNum
        });
      });
  }

  fetchStreamData() {
    $.ajax({
      url: BASE_URL + '/api/stream/' + this.state.streamId
    })
    .done((streamData) => {
      $.ajax({
        url: BASE_URL + '/api/user/' + streamData.creator
      })
      .done((userData) => {
        this.setState({
          name: streamData.name,
          broadcaster: streamData.broadcaster,
          desc: streamData.description,
          listenerLiveCount: streamData.listenerLiveCount,
          creator: streamData.creator,
          heartCount: streamData.heartCountNum,
          listenerMaxCount: streamData.listenerMaxCount,
          isLoading: false,
          image: userData.user.scAvatarUri,
          soundcloud: userData.user.scPermalink,
          website: userData.user.website,
          websiteTitle: userData.user.websiteTitle
        })
      })
    })
  }

  render() {
    var partial = <Loading />;
    var linkBar = this.state.website ? (
     <div>{this.state.broadcaster || 'pseudonymous'}<br /><a href={this.state.soundcloud}>SoundCloud</a> - <a href={this.state.website}>{this.state.websiteTitle}</a></div>
    ) : (
      <div>{this.state.broadcaster || 'pseudonymous'}<br /><a href={this.state.soundcloud}>SoundCloud</a></div>
    )

    if (!this.state.isLoading) {
      partial = <StreamLiveView
        state={this.state}
        playSong={this.playSong.bind(this)}
        stopSong={this.stopSong.bind(this)}
        addHeart={this.addHeart.bind(this)} />
    }
    return (
      <div>
        <div style={styles.container}>  
          <NavBar title={'Now Playing'} history={this.props.history}/>
          {partial}
        </div>
        
        <Sound
          url={'/stream/' + this.state.streamId}
          playStatus={this.state.status}
          onLoading={this.handleSongLoading}
          onPlaying={this.handleSongPlaying}
          onFinishedPlaying={this.handleSongFinishedPlaying} />
      </div>
    )
  }
}

var styles = {
  container: {
    'display': 'flex',
    'flexDirection' :'column',
  }
}

export default StreamLive;