'use strict';

import React, {
  ActivityIndicatorIOS,
  Component,
  StyleSheet,
  Text,
  TouchableHighlight,
  View
} from 'react-native';

class OnAir extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>You should be sending your streaming data to {this.props.broadcastInfo.uri}</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default OnAir;