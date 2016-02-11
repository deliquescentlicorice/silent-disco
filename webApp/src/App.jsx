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
import Loading from './Components/Loading.js';

// MATERIAL UI
import List from '../node_modules/material-ui/lib/lists/list';

//for development; we'll change this in production
var REQUEST_URL_ALL = 'http://' + document.location.host + '/api/streams';

var BASE_URL = 'http://' + document.location.host;

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      streams: []
    };
  }

  componentDidMount() {
    this.fetchData();
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
      this.setState({
        streams: streamList,
        isLoading: false
      });
    });
  }

  goToStream() {
    
    var PUT_LISTENER = BASE_URL + '/api/listener/' + this.props.stream._id;
     $.ajax({
      url: PUT_LISTENER,
      method: 'PUT',
      contentType: "application/x-www-form-urlencoded",
      data: ''
    })
    .done((responseData) => {
      enterStream(this.props.stream._id);
      this.props.history.push({
        pathname: '/listen/' + this.props.stream._id,
      });
    });
  }

  renderStream(key) {
    return <StreamEntry goToStream={this.goToStream} stream={this.state.streams[key]} history={this.history} key={key} index={key} />
  }

  render() {
    var partial = <Loading />
    if (!this.state.isLoading) {
      partial = (
        <List>
          {Object.keys(this.state.streams).map(this.renderStream.bind(this))}
        </List>
      )
    }
    return (
      <div>
        <NavBar title="Listen" history={this.history}/>
        {partial}
      </div>
    )
  }
}

reactMixin.onClass(App, History);

export default App;
