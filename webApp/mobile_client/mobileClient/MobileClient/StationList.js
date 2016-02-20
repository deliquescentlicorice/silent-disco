'use strict';

import React, {
  ActivityIndicatorIOS,
  Component,
  ListView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View
} from 'react-native';
import Station from './Station';
import Loading from './Loading';
import endpointIP from  './endpointIP';

var REQUEST_URL_ALL = endpointIP + '/api/streams';

class StationList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2
      })
    }
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    fetch(REQUEST_URL_ALL)
      .then((response) => response.json())
      .then((responseData) => {
        console.log(responseData);
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(responseData),
          isLoading: false
        });
      })
      .done();
  }

  listenToStation(station) {
    this.props.navigator.push({
      title: station.name,
      component: Station,
      passProps: {station},
      barTintColor: 'teal',
      titleTextColor: 'white',
      tintColor: 'white'
    });
  }

  renderStation(station) {
    return (
      <TouchableHighlight onPress={() => this.listenToStation(station)} underlayColor='#dddddd'>
        <View>
          <View style={styles.container}>
            <Text style={styles.name}>{station.name}</Text>
            <Text style={styles.broadcaster}>{station.broadcaster}</Text>
          </View>
          <View style={styles.separator}/>
        </View>
      </TouchableHighlight>
    );
  }

  render() {
    if (this.state.isLoading) {
      return <Loading />
    }

    return (
      <ListView
        style={styles.listView}
        dataSource={this.state.dataSource}
        renderRow={this.renderStation.bind(this)}
      />
    );
  }
}

var styles = StyleSheet.create({
  listView: {
    paddingTop: 65
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10
  },
  thumbnail: {

  },
  rightContainer: {

  },
  name: {
    fontSize: 20,
    marginBottom: 8
  },
  broadcaster: {
    color: '#555555'
  },
  separator: {
    height: 1,
    backgroundColor: '#cccccc'
  }
});

export default StationList;
