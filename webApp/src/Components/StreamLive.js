import React, { Component } from 'react';
import ReactDOM from 'react-dom';

// COMPONENTS
import NavBar from './NavBar.js';

// MEDIA PLAYER
import Sound from '../../node_modules/react-sound';

//  RESPONSIVE CSS
import MediaQuery from '../../node_modules/react-responsive';

// MATERIAL DESIGN
import Card from '../../node_modules/material-ui/lib/card/card';
import CardActions from '../../node_modules/material-ui/lib/card/card-actions';
import CardMedia from '../../node_modules/material-ui/lib/card/card-media';
import CardText from '../../node_modules/material-ui/lib/card/card-text';
import CardTitle from '../../node_modules/material-ui/lib/card/card-title';
import FloatingActionButton from '../../node_modules/material-ui/lib/floating-action-button';
import Play from '../../node_modules/material-ui/lib/svg-icons/av/play-arrow';
import Pause from '../../node_modules/material-ui/lib/svg-icons/av/pause';
import Favorite from '../../node_modules/material-ui/lib/svg-icons/action/favorite';
import AppBar from '../../node_modules/material-ui/lib/app-bar';
// import CardHeader from '../../node_modules/material-ui/lib/card/card-header';
// import CardText from '../../node_modules/material-ui/lib/card/card-text';
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
      description: "",
      image: "",
      listenerLiveCount: "",
      creator: ""
    }
  }

  componentWillMount() {
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
    var PUT_HEART = BASE_URL + '/api/stream/' + this.props.location.state.stream._id;

    // fetch(PUT_HEART, {
    //   method: 'PUT',
    //   body: JSON.stringify()
    // })
    // .then((response) => response.json())
    // .then((responseData) => {
    //   this.setState({
    //     heartCount: responseData.heartCountNum.length > 5 ? '> 9 999' : responseData.heartCountNum
    //   });
    // })
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
      url: BASE_URL + '/api/stream/' + this.props.location.state.stream._id
    })
    .done((streamData) => {
      console.log(streamData)
      $.ajax({
        url: BASE_URL + '/api/user/' + streamData.creator
      })
      .done((userData) => {
        console.log(userData)
        this.setState({
          name: streamData.name,
          broadcaster: streamData.broadcaster,
          desc: streamData.description,
          image: userData.scAvatarUri,
          listenerLiveCount: streamData.listenerLiveCount,
          creator: streamData.creator
        })
      })
    })
  }

  render() {
    return (
      <div style={styles.mainContainer}>
        <div>  
          <NavBar title={'Now Playing'} history={this.props.history}/>
        </div>
        <div style={styles.playerContainer}>
          
          
            <Card style={styles.card}>
              <CardMedia style={styles.image} >
                <img src={this.state.image} />
              </CardMedia>
              <CardTitle title={this.state.name} subtitle={this.state.broadcaster}  />
              <CardText>
                {this.state.desc}
              </CardText>
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
        
          
        </div>
        
        <Sound
          url={'/stream/' + this.props.location.state.stream._id}
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
    'flexDirection':'column',
    // 'border': '10px solid purple',
    // 'height': '100vh'
  },

  playerContainer: {
    'display': 'flex',
    'flexDirection':'row',
    'justifyContent':'center',
    // 'border': '10px solid goldenrod',
  },

  card: {
    'flexGrow':1,
    'alignContent': 'center',
    'maxWidth': 325
    // 'border': '10px solid yellow',
    // 'height': '100vh'
  },

  padding: {
    // 'flex':1,
    // 'border': '10px solid red',
  }
}

export default StreamLive;