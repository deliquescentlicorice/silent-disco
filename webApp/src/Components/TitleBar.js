import React from 'react';
import AppBar from '../../node_modules/material-ui/lib/app-bar';
import FlatButton from '../../node_modules/material-ui/lib/flat-button';
import { History } from 'react-router';
import reactMixin from 'react-mixin';


class TitleBar extends React.Component {
  goToDJ() {
    this.props.history.push({
      pathname: '/broadcast/setup'
    })
  }
  render() {
    return (
      <AppBar title={this.props.title} titleStyle={styles.title} iconElementRight={<FlatButton onClick={this.goToDJ.bind(this)} label="DJ" />}/>
    )
  } 
}

var styles = {
  title : {

  }
}

reactMixin.onClass(TitleBar, History);

export default TitleBar;