'use strict';

import React, {
  Component,
  Image,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';

var audio = require('react-native').NativeModules.RNAudioPlayerURL;

class Station extends Component {

  playStation() {
    audio.play();
  }

  componentDidMount() {
    audio.initWithURL(this.props.station.stationInfo.uri);
  }

  render() {
    var stationInfo = this.props.station.stationInfo;
    return (
      <TouchableHighlight onPress={() => this.playStation()}>
        <View style={styles.container} >
          <Text style={styles.description}>You're listening to {stationInfo.name}</Text>
        </View>
      </TouchableHighlight>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 75,
    alignItems: 'center'
  },
  description: {
    padding: 10,
    fontSize: 12,
    color: '#656565'
  }
});

export default Station;
