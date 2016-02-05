import React from 'react';
import { History } from 'react-router';
import reactMixin from 'react-mixin';

// MATERIAL DESIGN
import Card from '../../node_modules/material-ui/lib/card/card';
import RaisedButton from '../../node_modules/material-ui/lib/raised-button';
import FontIcon from '../../node_modules/material-ui/lib/font-icon';
import CardText from '../../node_modules/material-ui/lib/card/card-text';

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
      <Card style={styles.cardContainer}>
        <CardText>

        </CardText>
        <RaisedButton 
          style={styles.mainBox}
          primary={true} 
          onClick={this.login.bind(this)} 
          label="Login With SoundCloud"
          icon={<FontIcon className="fa fa-soundcloud"/>}
        />
        <CardText>
          
        </CardText>
      </Card>
      
      </div>
    )
  }
}

var styles = {


  cardContainer:{
    'display': 'flex',
    'flexDirection':'row',
    'flexWrap': 'wrap',
    alignItem:'center',
    justifyContent:'center'
  },


  mainBox: {
    'flexGrow':1,
  },

}

reactMixin.onClass(Login, History);

export default Login;