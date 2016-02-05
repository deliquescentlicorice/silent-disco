import React from 'react';
import { History } from 'react-router';
import reactMixin from 'react-mixin';
import $ from '../../public/js/jquery-1.11.1.min';
import RaisedButton from '../../node_modules/material-ui/lib/raised-button';
import NavBar from './NavBar';
import Auth from '../utils/Auth';

class Login extends React.Component {


  login() {
    let that=this;
    Auth.setUser()
    .then(function(){
      if(Auth.isAuth()){
        that.props.history.push({
          pathname: '/broadcast/setup'
        })
      }
    })
  }

  render() {
    return (
      <div>

      <NavBar title="Login" history={this.history}/>
      <RaisedButton primary={true} onClick={this.login.bind(this)} label="Login With SoundCloud"/>
      
      </div>
    )
  }
}

reactMixin.onClass(Login, History);

export default Login;