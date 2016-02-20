import React from 'react';

// ROUTER
import { History } from 'react-router';
import reactMixin from 'react-mixin';

// COMPONENTS
import NavBar from './NavBar.js'
import BroadcastProfileView from './BroadcastProfileView.js'
import BroadcastProfileViewEdit from './BroadcastProfileViewEdit.js'
import Loading from './Loading.js'

// UTILITIES
import $ from '../../public/js/jquery-1.11.1.min';

// MATERIAL UI
import Card from 'material-ui/lib/card/card';

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
    // As of iOS 9.3 and OSX 10.11, Safari does not support fetch
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
      partial = <BroadcastProfileView
        edit={this.editProfile.bind(this)}
        user={this.state.user.user}
        streams={this.state.user.streams}
        history={this.history}
        isLoading={this.state.isLoading} />
    }
    return (
      <Card style={styles.container}>
        <NavBar title="Profile" history={this.history}/>
        {partial}
      </Card>
    )
  } 
}

var styles = {
  container:{
    'maxWidth': '1280px',
    'margin': '15px auto',
    'display': 'flex',
    'flexDirection' :'column'
  }
}

reactMixin.onClass(BroadcastProfile, History);

export default BroadcastProfile;
