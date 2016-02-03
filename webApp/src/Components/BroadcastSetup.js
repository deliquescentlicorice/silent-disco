import React from 'react';
import TextField from '../../node_modules/material-ui/lib/text-field';
import RaisedButton from '../../node_modules/material-ui/lib/raised-button';
import DropDownMenu from '../../node_modules/material-ui/lib/DropDownMenu';
import MenuItem from '../../node_modules/material-ui/lib/menus/menu-item';
import { History } from 'react-router';
import reactMixin from 'react-mixin';

class BroadcastSetup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: (new Date).getTime().toString() + Math.random().toFixed(2),
      broadcaster: 'anonymous',
      desc: 'Hi, I\'m anonymous and you\'re listening to QuantumRadio',
      isInitializing: false,
      isLoggedIn: false,
      isLive: true,
      favorites: []
    };
  }

  componentDidMount() {
    if (!this.state.isLoggedIn) {
      SC.initialize({
        client_id: '67e4bbe5a2b1b64416b0ed84366b34ca',
        redirect_uri: 'http://localhost:3000/auth/soundcloud'
      });

      var component = this;

      // initiate auth popup
      SC.connect()
      .then(function(err, result) {
        return SC.get('/me');
      })
      .then(function(me) {
        localStorage.setItem("me", JSON.stringify(me));
        component.setState({
          isLoggedIn: true
        });
        return SC.get('/me/favorites');
      })
      .then(function(favorites) {
        localStorage.setItem("favorites", JSON.stringify(favorites));
        this.setState({
          favorites: favorites
        });
      });
    }
  }

  stationNameInput(event, index, value) {
    this.setState({
      name: value
    });
  }

  stationDescriptionInput(event, index, value) {
    this.setState({
      desc: value
    });
  }

  stationLiveInput(event, index, value) {
    this.setState({
      isLive: value
    })
  }

  startBroadcast() {
    if (this.state.isLive) {
      this.props.history.push({
        pathname: '/broadcast/live'
      });
    } else {
      this.props.history.push({
        pathname: '/broadcast/soundcloud'
      });
    }
    // var serverURL = "http://10.6.32.108:8000/testpost";
    
    // this.setState({
    //   isInitializing: true
    // });

    // fetch(serverURL, {
    //   method: 'POST',
    //   body: JSON.stringify({
    //     name: this.state.name,
    //     broadcaster: this.state.broadcaster,
    //     desc: this.state.desc
    //   })
    // })
    // .then((response) => response.json())
    // .then((responseData) => {
    //   this.setState({
    //     isInitializing: false
    //   })

    //   console.log(responseData);

    //   if (responseData.broadcastInfo) {
    //     this.props.navigator.push({
    //       title: this.state.name,
    //       component: OnAir,
    //       passProps: {broadcastInfo: responseData.broadcastInfo}
    //     })
    //   }
    // })
  }

  render() {
    var partial;
    if (this.state.isLoggedIn) {
      partial = (
        <div style={styles.container}>
          <p style={styles.title}>Tell us about your station</p>
          <TextField onChange={this.stationNameInput.bind(this)}
            hintText="Stream Name"
            floatingLabelText="Stream Name"
          /><br/>
          <TextField onChange={this.stationDescriptionInput.bind(this)}
            hintText="Description"
            floatingLabelText="Description"
          /><br/><br/>
          <DropDownMenu value={this.state.isLive} onChange={this.stationLiveInput.bind(this)}>
            <MenuItem value={true} primaryText="Live"/>
            <MenuItem value={false} primaryText="SoundCloud"/>
          </DropDownMenu><br/><br/>
          <RaisedButton primary={true} onClick={this.startBroadcast.bind(this)} label="Start Broadcasting"/>
        </div>
      )
    } else {
      partial = (
        <div>
          <p style={styles.title}>Broadcasting requires a SoundCloud account. Please sign in!</p>
        </div>
      )
    }

    return partial;
  } 
}

var styles = {
  container: {
    'flexDirection': 'column',
    'justifyContent': 'center',
    'alignContent': 'center'
  },
  title:{
    'fontFamily':'Roboto, sans-serif'
  }
}

reactMixin.onClass(BroadcastSetup, History);


export default BroadcastSetup;
