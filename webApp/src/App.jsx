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
import NoStream from './Components/NoStream.js';

// MATERIAL UI
import List from '../node_modules/material-ui/lib/lists/list';
import Card from '../node_modules/material-ui/lib/card/card';
import CardText from '../node_modules/material-ui/lib/card/card-text';
import CardMedia from '../node_modules/material-ui/lib/card/card-media';

window.protocol = (window.location.protocol === "https:") ? 'https://' : 'http://';

//for development; we'll change this in production
var REQUEST_URL_ALL = window.protocol + document.location.host + '/api/streams';

var BASE_URL = window.protocol + document.location.host;

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
    console.log("called fetchData", this)
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
      if(this.state.streams.length===0){
        partial = (
          <NoStream
            fetchData={this.fetchData.bind(this)}
          />
        )
      } else{
        partial = (
          <List>
            {Object.keys(this.state.streams).map(this.renderStream.bind(this))}
          </List>
        )
      }
      
    }
    return (
      <Card style={styles.app}>
        <NavBar title="Listen" history={this.history}/>
        {partial}
      </Card>
    )
  }
}

var styles = {
  app: {
    'maxWidth': '1280px',
    'margin': '15px auto'
  }
}

reactMixin.onClass(App, History);

export default App;
