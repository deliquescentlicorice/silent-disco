import React from 'react';

// ROUTER
import { History } from 'react-router';
import reactMixin from 'react-mixin';

// COMPONENTS
import NavBar from './NavBar.js'
import BroadcastProfileView from './BroadcastProfileView.js'
import Loading from './Loading.js'

// AJAX GET CALL
import $ from '../../public/js/jquery-1.11.1.min';

class BroadcastProfile extends React.Component {
  constructor() {
    super();

    this.state = {
      user:{
        streams:[],
        user:{}
      }

    };
  }

  componentWillMount(){
    this.fetchUserData()
  }

  fetchUserData() {
    this.setState({
      isLoading: true
    })
    $.ajax({
      url: '/api/user/'+ this.props.params.userId
    })
    .done((userData) => {
      this.setState({
        user: userData,
        isLoading: false
      });
    });
  }

  render() {
    var partial;
    if (this.state.isLoading) {
      partial = <Loading />
    } else {
      partial = <BroadcastProfileView
        user={this.state.user.user}
        streams={this.state.user.streams}
        history={this.history}
        isLoading={this.state.isLoading} />
    }
    return (
      <div style={styles.container}>
        <NavBar title="Profile" history={this.history}/>
        {partial}
      </div>
    )
  } 
}

var styles = {
  container:{
    'display': 'flex',
    'flexDirection' :'column',
  }
}

reactMixin.onClass(BroadcastProfile, History);

export default BroadcastProfile;
