import React from 'react';

// ROUTER
import { History } from 'react-router';
import reactMixin from 'react-mixin';

// COMPONENTS
import NavBar from './NavBar.js'
import BroadcastProfileView from './BroadcastProfileView.js'
import BroadcastProfileViewEdit from './BroadcastProfileViewEdit.js'
import Loading from './Loading.js'

// AJAX GET CALL
import $ from '../../public/js/jquery-1.11.1.min';

class BroadcastProfile extends React.Component {
  constructor() {
    super();

    this.state = {
      user: {
        user: {},
        streams: []
      },
      isLoading: true,
      isInEditMode: false
    };
  }

  componentDidMount(){
    this.fetchUserData();
  }

  editProfile() {
    this.setState({
      isInEditMode: true
    });
  }

  cancelEdit() {
    this.setState({
      isInEditMode: false
    });
  }

  saveEdit(editedUser) {
    this.setState({
      isInEditMode: false,
      isLoading: true
    });
    this.uploadChangedUserData(editedUser);
  }

  fetchUserData() {
    this.setState({
      isLoading: true
    });
    $.ajax({
      url: '/api/user/' + this.props.params.userId
    })
    .done((userData) => {
      this.setState({
        user: userData,
        isLoading: false
      });
    });
  }

  uploadChangedUserData(editedUser) {
    $.ajax({
        url: '/api/user/' + this.props.params.userId,
        method: 'PUT',
        contentType: "application/x-www-form-urlencoded",
        data: editedUser
      })
      .done((savedUserData) => {
        var userDataset = this.state.user;
        userDataset.user = savedUserData;
        this.setState({
          user: userDataset,
          isLoading: false
        })
      });
  }

  render() {
    var partial;
    if (this.state.isLoading) {
      partial = <Loading />
    } else if (this.state.isInEditMode) {
      partial = <BroadcastProfileViewEdit
        user={this.state.user.user}
        cancel={this.cancelEdit.bind(this)}
        save={this.saveEdit.bind(this)} />
    } else {
      console.log(this.state.user.user)
      partial = <BroadcastProfileView
        edit={this.editProfile.bind(this)}
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
