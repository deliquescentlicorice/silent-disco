import React, {
  ActivityIndicatorIOS,
  Component,
  StyleSheet,
  Text,
  View
} from 'react-native';

class Loading extends Component {
  render() {
    return (
      <View style={styles.loading}>
        <ActivityIndicatorIOS 
          size='large'
        />
        <Text>
          Loading...
        </Text>
      </View>
    )
  }
}

const styles=StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export default Loading;