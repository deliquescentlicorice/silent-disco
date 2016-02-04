import React from 'react';
import { History } from 'react-router';
import reactMixin from 'react-mixin';
import $ from '../../public/js/jquery-1.11.1.min';
import RaisedButton from '../../node_modules/material-ui/lib/raised-button';
import NavBar from './NavBar';
import AuthUtil from '../utils/Auth';

class Auth extends React.Component {

  render() {
    return (
      <div>

      <NavBar title="Login" history={this.history}/>
      <RaisedButton primary={true} onClick={AuthUtil.setUser.bind(this)} label="Login With SoundCloud"/>
      
      </div>
    )
  }
}

reactMixin.onClass(Auth, History);

export default Auth;