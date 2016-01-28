'use strict';

import React, {
  ActivityIndicatorIOS,
  Component,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View
} from 'react-native';
import OnAir from './OnAir';

class BroadcastSetup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: (new Date).getTime().toString() + Math.random().toFixed(2),
      broadcaster: 'anonymous',
      desc: 'Hi, I\'m anonymous and you\'re listening to QuantumRadio',
      isInitializing: false
    };
  }

  stationNameInput(event) {
    this.setState({
      name: event.nativeEvent.text
    });
  }

  stationBroadcasterInput(event) {
    this.setState({
      broadcaster: event.nativeEvent.text
    });
  }

  stationDescriptionInput(event) {
    this.setState({
      desc: event.nativeEvent.text
    });
  }

  startBroadcast() {
    var serverURL = "http://10.6.32.108:8000/testpost";
    
    this.setState({
      isInitializing: true
    });

    fetch(serverURL, {
      method: 'POST',
      body: JSON.stringify({
        name: this.state.name,
        broadcaster: this.state.broadcaster,
        desc: this.state.desc
      })
    })
    .then((response) => response.json())
    .then((responseData) => {
      this.setState({
        isInitializing: false
      })

      console.log(responseData);

      if (responseData.broadcastInfo) {
        this.props.navigator.push({
          title: this.state.name,
          component: OnAir,
          passProps: {broadcastInfo: responseData.broadcastInfo}
        })
      }
    })
  }

  render() {
    var waiting = this.state.isInitializing ?
      ( <ActivityIndicatorIOS
          hidden='true'
          size='large'
        /> ) :
      ( <View/> );

    return (
      <View style={styles.container}>
        <Text style={styles.header}>
          Tell us about your station
        </Text>
        <View>
          <Text style={styles.label}>
            Station Name:
          </Text>
          <TextInput
            style={styles.input}
            onChange={this.stationNameInput.bind(this)}
          />
        </View>
        <View>
          <Text style={styles.label}>
            Broadcast Name:
          </Text>
          <TextInput
            style={styles.input}
            onChange={this.stationBroadcasterInput.bind(this)}
          />
        </View>
        <View>
          <Text style={styles.label}>
            Description:
          </Text>
          <TextInput
            style={styles.input}
            onChange={this.stationDescriptionInput.bind(this)}
          />
        </View>
        <TouchableHighlight style={styles.button} onPress={this.startBroadcast.bind(this)}>
          <Text style={styles.buttonText}>Let's Go!</Text>
        </TouchableHighlight>
        {waiting}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 75,
    padding: 10
  },
  header: {
    fontSize: 18,
    alignSelf: 'center',
    marginBottom: 15
  },
  label: {
    fontSize: 15,
    marginTop: 15
  },
  input: {
    flex: 1, 
    height: 35,
    marginTop: 10,
    marginBottom: 10,
    fontSize: 18,
    borderWidth: 1,
    borderRadius: 4,
    padding: 5
  },
  button: {
    height: 36,
    backgroundColor: '#f39c12',
    borderRadius: 8,
    justifyContent: 'center',
    marginTop: 15
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    alignSelf: 'center'
  }
}) 

export default BroadcastSetup;
