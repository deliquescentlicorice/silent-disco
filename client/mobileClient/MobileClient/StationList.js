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

var FAKE_STATION_DATA = [
  {
    stationInfo: {
      name: 'Smooth Jazz 23/6',
      broadcaster: "Jazz Boatman",
      uri: "http://dir.xiph.org/listen/5197238/listen.m3u"
    }
  }, {
    stationInfo: {
      name: 'Feast on the Blood of the Fallen',
      broadcaster: "DJ Sunshine",
      uri: "http://www.mfiles.co.uk/mp3-downloads/frederic-chopin-piano-sonata-2-op35-3-funeral-march.mp3"
    }
  }, {
    stationInfo: {
      name: 'Sketchy Music',
      broadcaster: "DJ Gravity",
      uri: "http://10.6.32.127:3000/listen"
    }
  }
];

var REQUEST_URL = '';


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
    // this.fetchData();
    var stations = FAKE_STATION_DATA;
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(stations),
      isLoading: false
    })
  }

  fetchData() {
    fetch(REQUEST_URL)
      .then((response) => response.json())
      .then((responseData) => {
        console.log(responseData);
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(responseData.items),
          isLoading: false
        });
      })
      .done();
  }

  listenToStation(station) {
    this.props.navigator.push({
      title: station.stationInfo.name,
      component: Station,
      passProps: {station}
    });
  }

  renderStation(station) {
    console.log(station)
    return (
      <TouchableHighlight onPress={() => this.listenToStation(station)} underlayColor='#dddddd'>
        <View>
          <View style={styles.container}>
            <Text style={styles.name}>{station.stationInfo.name}</Text>
            <Text style={styles.broadcaster}>{station.stationInfo.broadcaster}</Text>
          </View>
          <View style={styles.separator}/>
        </View>
      </TouchableHighlight>
    );
  }

  renderLoadingView() {
    return (
      <View style={styles.loading}>
        <ActivityIndicatorIOS 
          size='large'
        />
        <Text>
          Loading stations...
        </Text>
      </View>
    )
  }

  render() {
    if (this.state.isLoading) {
      return this.renderLoadingView();
    }

    return (
      <ListView
        dataSource={this.state.dataSource}
        renderRow={this.renderStation.bind(this)}
        style={styles.listView}
      />
    );
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10
  },
  name: {
    fontSize: 20,
    marginBottom: 8
  },
  broadcaster: {
    color: '#656565'
  },
  separator: {
    height: 1,
    backgroundColor: '#a0a0a0'
  },
  listView: {
    backgroundColor: '#F5F5F5'
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export default StationList;
