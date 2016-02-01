import React from 'react';
import LeftNav from '../../node_modules/material-ui/lib/left-nav';
import MenuItem from '../../node_modules/material-ui/lib/menus/menu-item';


class NavBar extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      open:false;
    }
  }
  handleToggle = () => this.setState({open: !this.state.open});
  handleClose = () => thhis.setState({open: false});
  
  render() {
    return (
      <LeftNav 
        docked={false} 
        width={200} 
        open={this.state.open} 
        onRequestChange={open => this.setState({open})}
      >
        <MenuItem>One</MenuItem>
        <MenuItem>Two</MenuItem>
      </LeftNav>
    )
  } 
}

var styles = {
  zIndex: 1101
}

export default NavBar;