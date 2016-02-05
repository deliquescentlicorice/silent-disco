import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { History } from 'react-router';
import reactMixin from 'react-mixin';

// HELPERS
import _ from 'lodash';
import $ from '../public/js/jquery-1.11.1.min';

// COMPONENTS
import StreamEntry from './Components/StreamEntry.js';
import NavBar from './Components/NavBar.js';

// MATERIAL UI
import List from '../node_modules/material-ui/lib/lists/list';

//for development; we'll change this in production
var REQUEST_URL_ALL = 'http://' + document.location.host + '/api/streams';

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

    componentDidMount() {
      this.fetchData();
      // var stations = FAKE_STATION_DATA;
      // this.setState({
      //   dataSource: this.state.dataSource.cloneWithRows(stations),
      //   isLoading: false
      // })
    }

    fetchData() {
      // As of iOS 9.3 and OSX 10.11, Safari does not support fetch.
      // fetch(REQUEST_URL_ALL)
      // .then((response) => response.json())
      // .then((streamList) => {
      //   this.setState({
      //     streams: streamList
      //   });
      // });
      $.ajax({
        url: REQUEST_URL_ALL
      })
      .done((streamList) => {
        console.log(streamList)
        this.setState({
          streams: streamList
        });
      });
    }

    goToStream() {
      this.props.history.push({
        pathname: '/stream/' + this.props.stream._id,
      });
    }

    renderStream(key){
      return <StreamEntry goToStream={this.goToStream} stream={this.state.streams[key]} history={this.history} key={key} index={key} />
    }

  render() {
    return (
      <div>
        <NavBar title="Listen" history={this.history}/>
        <List>
          {Object.keys(this.state.streams).map(this.renderStream.bind(this))}
        </List>
      </div>
    )
  }
}

reactMixin.onClass(App, History);

export default App;
