import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { History } from 'react-router';
import reactMixin from 'react-mixin';

// HELPERS
import _ from 'lodash';
import $ from '../../public/js/jquery-1.11.1.min';

// COMPONENTS
import StreamEntry from './StreamEntry';
import NavBar from './NavBar';
import Loading from './Loading';
import NoStream from './NoStream';

// MATERIAL UI
import List from '../../node_modules/material-ui/lib/lists/list';
import Card from '../../node_modules/material-ui/lib/card/card';
import CardText from '../../node_modules/material-ui/lib/card/card-text';
import CardMedia from '../../node_modules/material-ui/lib/card/card-media';

//for development; we'll change this in production
var REQUEST_URL_ALL = 'http://' + document.location.host + '/api/streams';

var BASE_URL = 'http://' + document.location.host;

class Stream extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      streams: []
    };
  }

  componentDidMount() {
    this.fetchData();

    //add bclient on handler here
    console.log(window.bClient)
    window.bClient.on('stream', function(data, meta) {
      if (meta.type === 'event') {
        if (meta.action === 'streamEnd' || meta.action === 'streamStart') {
          console.log("Stream Event")
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
      }
    }.bind(this));

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
    this.props.history.push({
      pathname: '/listen/' + this.props.stream._id,
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
      <div>
        <NavBar title="Listen" history={this.history}/>
        {partial}
      </div>
    )
  }
}

reactMixin.onClass(Stream, History);

export default Stream;
