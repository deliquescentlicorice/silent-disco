import React from 'react';

// ROUTER
import { History } from 'react-router';
import reactMixin from 'react-mixin';

// COMPONENT
import NavBarView from './NavBarView.js'

// UTILITIES
import Auth from '../utils/Auth';
import $ from '../../public/js/jquery-1.11.1.min';

class NavBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
  }

  handleToggle() {
    this.setState({
      open: !this.state.open
    });
  }

  createBroadcast() {
    this.props.history.push({
      pathname: '/broadcast/setup'
    });
  }

  endSessionAndRedirect() {
    // As of iOS 9.3 and OSX 10.11, Safari does not support fetch
    $.ajax({
      url: '/logout'
    })
    .done((responseData) => {
      Auth.logout();
      this.props.history.push({
        pathname: '/'
      });
    });
  }

  goToProfile() {
    let profileID = JSON.parse(localStorage.getItem("dbID"))._id;
    this.props.history.push({
      pathname: '/user/'+profileID
    });
  }

  goToListen() {
    this.props.history.push({
      pathname: '/'
    });
  }

  goToLogin() {
    this.props.history.push({
      pathname: '/login'
    });
  }

  render() {
    return <NavBarView 
      toggle={this.handleToggle.bind(this)}
      goListen={this.goToListen.bind(this)}
      goBroadcast={this.createBroadcast.bind(this)}
      goProfile={this.goToProfile.bind(this)}
      goLogout={this.endSession.bind(this)}
      goLogin={this.goToLogin.bind(this)}
      title={this.props.title}
      open={this.state.open}
      isAuth={Auth.isAuth()} />
  }
}

reactMixin.onClass(NavBar, History);

export default NavBar;
