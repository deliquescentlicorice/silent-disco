import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { History } from 'react-router';
import reactMixin from 'react-mixin';

// HELPERS
import _ from 'lodash';

// COMPONENTS
import ListedSong from './Components/ListedSong.js';
import TitleBar from './Components/TitleBar.js';

// MATERIAL UI
import List from '../node_modules/material-ui/lib/lists/list';

class App extends React.Component {
  constructor() {
    super();

    this.state = {
      songs : [
        {
          name : "Weathered",
          artist : "Jack Garratt",
          url: "http://10.6.32.127:3000/listen",
          // url: "http://www.mfiles.co.uk/mp3-downloads/frederic-chopin-piano-sonata-2-op35-3-funeral-march.mp3",
          image: "https://i1.sndcdn.com/artworks-000121805716-1715so-t500x500.jpg"
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

  goToSong() {
    var songId= this.props.index;
    console.log("Going To Song " + songId);

    this.props.history.push({
      pathname: '/song/' + songId,
      state: { song : this.props.state.songs[songId] }
    });
  }

  renderSong(key){
    return <ListedSong goToSong={this.goToSong} state = {this.state} history={this.history} key={key} index={key} details={this.state.songs[key]} />
  }

  render() {
    return (
      <div>
        <TitleBar title="Silent Disco" showMenuIconButton={false} />
        <List>
          {Object.keys(this.state.songs).map(this.renderSong.bind(this))}
        </List>
      </div>
    )
  }
}

reactMixin.onClass(App, History);

export default App;