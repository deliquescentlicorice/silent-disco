import React from 'react';
import AppBar from '../../node_modules/material-ui/lib/app-bar';
import FlatButton from '../../node_modules/material-ui/lib/flat-button';
import { History } from 'react-router';
import reactMixin from 'react-mixin';

import BroadcastSetup from './BroadcastSetup';
import NavBar from './NavBar';


class Broadcast extends React.Component {
  
  render() {
    return (
      <div>
        <NavBar title="Broadcast" history={this.props.history}/>
        <BroadcastSetup history={this.history}/>
      </div>
    )
  } 
}

var styles = {

}

reactMixin.onClass(Broadcast, History);

export default Broadcast;