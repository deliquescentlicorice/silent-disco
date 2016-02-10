import React from 'react';

// MATERIAL DESIGN
import AppBar from '../../node_modules/material-ui/lib/app-bar';
import LeftNav from '../../node_modules/material-ui/lib/left-nav';
import MenuItem from '../../node_modules/material-ui/lib/menus/menu-item';
import List from '../../node_modules/material-ui/lib/lists/list';
import ListItem from '../../node_modules/material-ui/lib/lists/list-item';
import FlatButton from '../../node_modules/material-ui/lib/flat-button';
import RaisedButton from '../../node_modules/material-ui/lib/raised-button';

class NavBarView extends React.Component {
  render() {
    return (
      <div>
        <LeftNav
          onRequestChange={this.props.toggle}
          open={this.props.open}
          docked={false}>
          <div style={styles.leftNavTitle}>silent disco</div>
          <MenuItem onClick={this.props.goListen}>Listen</MenuItem>
          {
            this.props.isAuth ? (
              <List subheader="">
                <ListItem
                  primaryText="Broadcast"
                  initiallyOpen={true}
                  primaryTogglesNestedList={true}
                  nestedItems={[
                    <ListItem
                      key={1}
                      primaryText="Create Broadcast"
                      onClick={this.props.goBroadcast} />,
                    <ListItem
                      key={2}
                      primaryText="Profile"
                      onClick={this.props.goProfile} />,
                    <ListItem
                      key={3}
                      primaryText="Logout"
                      onClick={this.props.goLogout} />,
                  ]} />
              </List>
            ) : (
              <List subheader="">
                <ListItem
                  primaryText="Broadcast"
                  initiallyOpen={true}
                  primaryTogglesNestedList={true}
                  nestedItems={[
                    <ListItem
                      key={1}
                      primaryText="Login"
                      onClick={this.props.goLogin} />,
                  ]} />
              </List>
          )}
        </LeftNav>
        <AppBar
          title={this.props.title} 
          titleStyle={styles.title} 
          onLeftIconButtonTouchTap={this.props.toggle} />
      </div>
    )
  }
}

var styles = {
  leftNavTitle:{
    'cursor': 'pointer',
    'fontSize': '24px',
    'color': 'rgba(255, 255, 255, 1)',
    'lineHeight': '64px',
    'fontWeight': 300,
    'backgroundColor': '#00bcd4',
    'paddingLeft': '24px',
    'marginBottom': '8px'
  }
}

export default NavBarView;
