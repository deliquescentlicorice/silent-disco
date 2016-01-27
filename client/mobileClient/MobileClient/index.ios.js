'use strict';

import React, {
  AppRegistry,
  Component,
  StyleSheet,
  TabBarIOS,
  Text
} from 'react-native';
import Listen from './Listen.js';

class MobileClient extends Component {  constructor(props) {
    super(props);
    this.state = {
      selectedTab: 'listen'
    };
  }

  setTab(tabId) {
    this.setState({
      selectedTab: tabId
    })
  }

  render() {
    return (
      <TabBarIOS>
        <TabBarIOS.Item
          selected={this.state.selectedTab === 'listen'}
          icon={require("./assets/Headphones-30.png")}
          title='Listen'
          onPress={() => {
            this.setTab('listen');
          }}>
          <Listen />
        </TabBarIOS.Item>
        <TabBarIOS.Item
          selected={this.state.selectedTab === 'broadcast'}
          icon={require("./assets/Microphone-30.png")}
          title='Broadcast'
          onPress={() => {
            this.setTab('broadcast');
          }}>
          <Text>Hello!</Text>
        </TabBarIOS.Item>
      </TabBarIOS>
    );
  }
}

AppRegistry.registerComponent('MobileClient', () => MobileClient);
