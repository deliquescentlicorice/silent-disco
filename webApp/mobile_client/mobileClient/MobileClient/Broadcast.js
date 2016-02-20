'use strict';

import React, {
  Component,
  NavigatorIOS,
  StyleSheet
} from 'react-native';
import BroadcastSetup from './BroadcastSetup';

class Broadcast extends Component {
  render() {
    return (
      <NavigatorIOS
        style={styles.container}
        initialRoute={{
          title: 'Setup Broadcast',
          component: BroadcastSetup
        }}
      />
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

export default Broadcast;