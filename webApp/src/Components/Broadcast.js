import React from 'react';

// ROUTER
import { History } from 'react-router';
import reactMixin from 'react-mixin';

// COMPONENTS
import BroadcastSetup from './BroadcastSetup';
import NoBroadcast from './NoBroadcast';
import NavBar from './NavBar';

// MATERIAL DESIGN
import Card from 'material-ui/lib/card/card';
import FlatButton from '../../node_modules/material-ui/lib/flat-button';

class Broadcast extends React.Component {  
  render() {
    var partial;
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
    if (navigator.getUserMedia && MediaStreamTrack && MediaStreamTrack.getSources) {
      partial = <BroadcastSetup history={this.history} />
    } else {
      partial = <NoBroadcast />
    }
    return (
      <Card style={styles.app}>
        <NavBar title="Broadcast" history={this.props.history} />
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

reactMixin.onClass(Broadcast, History);

export default Broadcast;
