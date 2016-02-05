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

class Station extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      heartCount: 0,
      image: '',
      listenerLiveCount: 0,
      listenerMaxCount: 0,
      desc: ''
    }
  }

  playStation() {
    audio.play();
  }

  componentDidMount() {
    this.fetchData();
    // to get to playing music as soon as possible,
    // audio play will not wait for data to be fetched
    audio.initWithURL(endpointIP + '/stream/' + this.props.station._id);
    audio.play();
  }

  componentWillUnmount() {
    audio.pause();
  }

  fetchData() {
    var component = this;
    fetch(endpointIP + '/api/stream/' + this.props.station._id)
      .then((response) => response.json())
      .then((streamData) => {
        fetch(endpointIP + '/api/user/' + streamData.creator)
        .then((response) => response.json())
        .then((userData) => {
          component.setState({
            isLoading: false,
            heartCount: streamData.heartCountNum,
            image: userData.user.scAvatarUri,
            listenerLiveCount: streamData.listenerLiveCount,
            listenerMaxCount: streamData.listenerMaxCount,
            desc: streamData.description
          });
        })
      })
      .done();
  }

  upheart() {
    fetch(endpointIP + '/api/stream/' + this.props.station._id, {
      method: 'PUT',
      body: ''
    })
    .then((response) => response.json())
    .then((responseData) => {
      this.setState({
        heartCount: responseData.heartCountNum.length > 5 ? ">9,999" : responseData.heartCountNum
      });
    })
    .done();
  }

  render() {
    if (this.state.isLoading) {
      return <Loading />
    }
    return (
      <View style={styles.container} >
        <Image style={styles.lede} source={{uri: this.state.image}}/>
        <View>
          <View style={styles.heartThisDJ}>
            <Text style={styles.broadcaster}>{this.props.station.broadcaster}</Text>
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
