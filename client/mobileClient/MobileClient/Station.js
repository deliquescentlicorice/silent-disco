'use strict';

import React, {
  Component,
  Image,
  NativeModules,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import Loading from './Loading';
import endpointIP from  './endpointIP';

var audio = NativeModules.RNAudioPlayerURL;

var FAKE_STATION_DATUM = {
  heartCount: 1000,
  image: '',
  listenerCount: 20,
  desc: 'Sick beets. Not a typo. Here is some additional text to experiement with how text flows.'
}

var REQUEST_URL_ONE = "";

class Station extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      heartCount: 0,
      image: '',
      listenerCount: 0,
      desc: ''
    }
  }

  playStation() {
    audio.play();
  }

  componentDidMount() {
    // this.fetchData();
    var stationDetail = FAKE_STATION_DATUM;
    this.setState({
      isLoading: false,
      heartCount: stationDetail.heartCount,
      image: "https://i.imgur.com/03t6Yun.jpg",
      listenerCount: stationDetail.listenerCount,
      desc: stationDetail.desc
    });
    audio.initWithURL(endpointIP + '/stream/' + this.props.station._id);
    audio.play();
  }

  componentWillUnmount() {
    audio.pause();
  }

  fetchData() {
    fetch(REQUEST_URL_ONE)
      .then((response) => response.json())
      .then((responseData) => {
        this.setState({
          isLoading: false,
          heartCount: responseData.heartCount,
          image: responseData.image,
          listenerCount: responseData.listenerCount,
          desc: responseData.desc
        });
      })
      .done();
  }

  upheart() {
    var POST_HEART = endpointIP + '/api/stream/' + this.props.station._id;
    fetch(POST_HEART, {
      method: 'PUT',
      body: JSON.stringify({
        id: this.props.station._id
      })
    })
    // .then((response) => response.json())
    // .then((responseData) => {
    //   this.setState({
    //     heartCount: responseData.heartCount.length > 5 ? ">9,999" : responseData.heartCount
    //   });
    // })
    .done();
  }

  render() {
    if (this.state.isLoading) {
      return <Loading />
    }
    // removed <Text style={styles.broadcaster}>{this.props.station.broadcaster}</Text>
    return (
      <View style={styles.container} >
        <Image style={styles.lede} source={{uri: this.state.image}}/>
        <View>
          <View style={styles.heartThisDJ}>
            
            <View style={styles.rightContainer}>
              <Text style={styles.heartNum}>
                {this.state.heartCount}
              </Text>
              <TouchableHighlight onPress={this.upheart.bind(this)}>
                <Image style={styles.hearts} source={require("./assets/Like-Filled-40.png")}/>
              </TouchableHighlight>
            </View>
          </View>
        </View>
        <View style={styles.description}>
          <Text style={styles.descriptionText}>{this.state.desc}</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 3,
    marginTop: 75,
    alignItems: 'center'
  },
  rightContainer: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  lede: {
    width: 300,
    height: 300,
    borderWidth: 1,
    marginBottom: 10
  },
  heartThisDJ: {
    width: 250,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  broadcaster: {
    flex: 5,
    color: '#555555',
    fontSize: 20
  },
  hearts: {
    height: 20,
    width: 20
  },
  heartNum: {
    color: '#555555',
    fontSize: 20
  },
  description: {
    marginTop: 10,
    padding: 10,
  },
  descriptionText: {
    textAlign: 'left'
  }
});

export default Station;
