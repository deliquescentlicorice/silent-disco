import React from 'react';
import AppBar from '../../node_modules/material-ui/lib/app-bar';
import LeftNav from '../../node_modules/material-ui/lib/left-nav';
import MenuItem from '../../node_modules/material-ui/lib/menus/menu-item';
import List from '../../node_modules/material-ui/lib/lists/list';
import ListItem from '../../node_modules/material-ui/lib/lists/list-item';
import FlatButton from '../../node_modules/material-ui/lib/flat-button';
import { History } from 'react-router';
import reactMixin from 'react-mixin';
import RaisedButton from '../../node_modules/material-ui/lib/raised-button';
import Auth from '../utils/Auth';

// AJAX GET CALL
import $ from '../../public/js/jquery-1.11.1.min';

class NavBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    };
  }

  handleToggle() {
    this.setState({
      open: !this.state.open
    })
  }

  createBroadcast() {
    this.props.history.push({
      pathname: '/broadcast/setup'
    })
  }

  endSession() {
    $.ajax({
      url: '/logout'
    })
    .done((responseData) => {
      Auth.logout();
      this.props.history.push({
        pathname: '/'
      })
    });
    
  }

  goToProfile() {
    this.props.history.push({
      pathname: '/broadcast/profile'
    })
  }

  goToListen() {
    this.props.history.push({
      pathname: '/'
    })
  }

  render() {
    return (
      <div>
        
        <LeftNav onRequestChange={this.handleToggle.bind(this)} open={this.state.open} docked={false}>
          <div style={styles.leftNavTitle}>silent disco</div>
          <MenuItem onClick={this.goToListen.bind(this)} >Listen</MenuItem>
          <List subheader="">
            <ListItem
              primaryText="Broadcast"
              initiallyOpen={true}
              primaryTogglesNestedList={true}
              nestedItems={[
                <ListItem
                  key={1}
                  primaryText="Create Broadcast"
                  onClick={this.createBroadcast.bind(this)}
                />,
                <ListItem
                  key={2}
                  primaryText="Profile"
                  onClick={this.goToProfile.bind(this)}
                />,
              ]}
            />
          </List>
        </LeftNav>
        <AppBar title={this.props.title} 
          titleStyle={styles.title} 
          iconElementRight={<FlatButton  onClick={this.endSession.bind(this)}label="Logout"/>}
          onLeftIconButtonTouchTap={this.handleToggle.bind(this)}
        />

      </div>
    )
  }
  

}

var styles = {
  leftNavTitle:{
    cursor: 'pointer',
    'fontSize':'24px',
    'color':'rgba(255, 255, 255, 1)',
    'lineHeight':'64px',
    'fontWeight':300,
    'backgroundColor':'#00bcd4',
    'paddingLeft':'24px',
    'marginBottom':'8px'
  }
}

reactMixin.onClass(NavBar, History);

export default NavBar;

