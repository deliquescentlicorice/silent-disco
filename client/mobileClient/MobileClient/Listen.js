'use strict';

import React, {
  Component,
  NavigatorIOS,
  StyleSheet
} from 'react-native';
import StationList from './StationList';

class Listen extends Component {
  render() {
    return (
      <NavigatorIOS
        style={styles.container}
        initialRoute={{
          title: 'On Air',
          component: StationList
        }}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})

export default Listen;
