import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { History } from 'react-router';
import reactMixin from 'react-mixin';

// HELPERS
import _ from 'lodash';

// COMPONENTS
import StreamEntry from './Components/StreamEntry.js';
import NavBar from './Components/NavBar.js';

// MATERIAL UI
import List from '../node_modules/material-ui/lib/lists/list';

//for development; we'll change this in production
// var REQUEST_URL_ALL = 'http://localhost:3000/api/streams';

class App extends React.Component {
  constructor() {
    super();

    this.state = {
      streams : [
        {
          name : "Weathered",
          artist : "Jack Garratt",
          url: "https://www.radelmann.io/broadcast/listen.html",
          // url: "http://10.6.32.127:3000/listen",
          // url: "http://www.mfiles.co.uk/mp3-downloads/frederic-chopin-piano-sonata-2-op35-3-funeral-march.mp3",

          image: "https://i1.sndcdn.com/artworks-000061035457-wy5yn1-t200x200.jpg"
        },
        {
          name : "One Thing",
          artist : "Peter & Kerry",
          url: "https://soundcloud.com/jatikai/peter-and-kerry-one-thing",
          image: "https://pbs.twimg.com/profile_images/2732911936/7d218ec5a6764b0c0b7008aea3c3bfad_400x400.png"
        }
        ],
        currentSong : null
      };
    }

    // componentDidMount() {
    //   this.fetchData();
    //   // var stations = FAKE_STATION_DATA;
    //   // this.setState({
    //   //   dataSource: this.state.dataSource.cloneWithRows(stations),
    //   //   isLoading: false
    //   // })
    // }

    // fetchData() {
    //   fetch(REQUEST_URL_ALL)
    //   .then((response) => response.json())
    //   .then((responseData) => {
    //     this.setState({
    //       streams: responseData
    //     });
    //   });
    // }

    goToStream() {
      var streamId= this.props.index;
      console.log("Going To Stream " + streamId);

      this.props.history.push({
        pathname: '/stream/' + streamId,

        //so we get which song from the state; a single GET request
        //we could also send a new request to the server to get each individual song
          //i'll look at this for testing purposes
        state: { stream : this.props.state.streams[streamId] }
      });
    }

    renderStream(key){
      return <StreamEntry goToStream={this.goToStream} state={this.state} history={this.history} key={key} index={key} details={this.state.streams[key]} />
    }


  render() {
    return (
      <div>

        <NavBar title="Silent Disco" history={this.history}/>

        <List>
        {Object.keys(this.state.streams).map(this.renderStream.bind(this))}
        </List>
        </div>
        )
    }
  }

  reactMixin.onClass(App, History);

  export default App;