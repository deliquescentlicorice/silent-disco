import React from 'react';
import AppBar from '../../node_modules/material-ui/lib/app-bar';


class TitleBar extends React.Component {
  render() {
    return (
      <AppBar title={this.props.title} />
    )
  } 
}


export default TitleBar;