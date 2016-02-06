import React from 'react';
import FlatButton from '../../node_modules/material-ui/lib/flat-button';
import { History } from 'react-router';
import reactMixin from 'react-mixin';

import BroadcastSetup from './BroadcastSetup';
import NoBroadcast from './NoBroadcast';
import NavBar from './NavBar';


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
      <div>
        <NavBar title="Broadcast" history={this.props.history} />
        {partial}
      </div>
    )
  } 
}

var styles = {

}

reactMixin.onClass(Broadcast, History);

export default Broadcast;