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

var FAKE_STATION_DATA = [
  {
    id: 1,
    name: 'Smooth Jazz 23/6',
    broadcaster: "Yazz Boatman",
    streamImgUri: "",
    uri: "http://dir.xiph.org/listen/4642557/listen.m3u"
  }, {
    id: 2,
    name: 'Feast on the Blood of the Fallen',
    broadcaster: "Radio Sunshine",
    streamImgUri: "",
    uri: "http://dir.xiph.org/listen/2050679/listen.m3u"
  }, {
    id: 3,
    name: 'Sketchy Site',
    broadcaster: "DJ Gravity",
    streamImgUri: "",
    uri: "10.6.32.127:3000/listen"
  }, {
    id: 4,
    name: 'Christmas 365',
    broadcaster: "Sick Nick",
    streamImgUri: "",
    uri: "http://dir.xiph.org/listen/4913295/listen.m3u"
  }, {
    id: 5,
    name: 'Classical Orchestral Music',
    broadcaster: "P.D.Q. Bach",
    streamImgUri: "",
    uri: "http://dir.xiph.org/listen/5231626/listen.m3u"
  }
];

var REQUEST_URL_ALL = '';


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
    fetch(REQUEST_URL_ALL)
      .then((response) => response.json())
      .then((responseData) => {
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(responseData.items),
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
        dataSource={this.state.dataSource}
        renderRow={this.renderStation.bind(this)}
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
