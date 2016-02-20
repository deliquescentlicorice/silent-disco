import React from 'react';

// ROUTER
import { History } from 'react-router';
import reactMixin from 'react-mixin';

// MATERIAL DESIGN
import AppBar from '../../node_modules/material-ui/lib/app-bar';
import FlatButton from '../../node_modules/material-ui/lib/flat-button';

class TitleBar extends React.Component {
  setUpBroadcast() {
    this.props.history.push({
      pathname: '/broadcast/setup'
    });
  }
  render() {
    return (
      <AppBar
        title={this.props.title}
        titleStyle={styles.title}
        iconElementRight={
          <FlatButton
            onClick={this.setUpBroadcast.bind(this)}
            label="Broadcast" />
        } />
    )
  } 
}

var styles = {
  title : {

  }
}

reactMixin.onClass(TitleBar, History);

export default TitleBar;
