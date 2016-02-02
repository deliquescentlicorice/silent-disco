import React from 'react';
import AppBar from '../../node_modules/material-ui/lib/app-bar';
import FlatButton from '../../node_modules/material-ui/lib/flat-button';
import { History } from 'react-router';
import reactMixin from 'react-mixin';

import BroadcastSetup from './BroadcastSetup';


class Broadcast extends React.Component {
  
  render() {
    return (
      <div>
        <AppBar title="Broadcast"/>
        <BroadcastSetup history={this.history}/>
      </div>
    )
  } 
}

var styles = {

}

reactMixin.onClass(Broadcast, History);

export default Broadcast;