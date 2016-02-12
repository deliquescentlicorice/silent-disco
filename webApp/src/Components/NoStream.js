import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { History } from 'react-router';
import reactMixin from 'react-mixin';


// MATERIAL UI
import List from '../../node_modules/material-ui/lib/lists/list';
import Card from '../../node_modules/material-ui/lib/card/card';
import CardText from '../../node_modules/material-ui/lib/card/card-text';
import CardMedia from '../../node_modules/material-ui/lib/card/card-media';
import FlatButton from '../../node_modules/material-ui/lib/flat-button';


class NoStream extends React.Component {
  constructor(props) {
    super(props);
  }

  createBroadcast() {
    this.props.history.push({
      pathname: '/broadcast/setup'
    });
  }


  render() {
    return (
      <div>
        <h1 style={styles.titleFontBlack}>
          No Streams Are Currently Available
        </h1>
        <div style={styles.flexColumn}>
          <div style={styles.boxCenter}>
            <FlatButton onClick={this.createBroadcast.bind(this)} label="Start a Broadcast" primary={true} style={styles.buttonSection}/>
          </div>
        </div>
      </div>
    )
  }
}

var styles = {
  titleFontBlack: {
    fontWeight:'300',
    fontFamily: 'Roboto, sans-serif',
    color:'black',
    textAlign: 'center'
  },

  flexColumn: {
    display: 'flex',
    flexDirection:'column',
    justifyContent: 'center',
    flexWrap: 'wrap',
    alignItem: 'center'
  },

  boxCenter: {
    flex: 1,
    alignSelf: 'center'
  },
}

reactMixin.onClass(NoStream, History);

export default NoStream;
