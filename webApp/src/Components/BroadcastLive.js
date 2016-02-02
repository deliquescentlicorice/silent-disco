import React from 'react';

// MATERIAL DESIGN
import Card from 'material-ui/lib/card/card';
import CardActions from '../../node_modules/material-ui/lib/card/card-actions';
import CardHeader from '../../node_modules/material-ui/lib/card/card-header';
import CardMedia from '../../node_modules/material-ui/lib/card/card-media';
import CardTitle from '../../node_modules/material-ui/lib/card/card-title';
import FlatButton from '../../node_modules/material-ui/lib/flat-button';
import FloatingActionButton from '../../node_modules/material-ui/lib/floating-action-button';
import Favorite from '../../node_modules/material-ui/lib/svg-icons/action/favorite';
import Face from '../../node_modules/material-ui/lib/svg-icons/action/face';
import TrendingUp from '../../node_modules/material-ui/lib/svg-icons/action/trending-up';
import Mic from '../../node_modules/material-ui/lib/svg-icons/av/mic';
import MicOff from '../../node_modules/material-ui/lib/svg-icons/av/mic-off';
import CardText from '../../node_modules/material-ui/lib/card/card-text';
import TextField from '../../node_modules/material-ui/lib/text-field';
import RaisedButton from '../../node_modules/material-ui/lib/raised-button';
import Colors from '../../node_modules/material-ui/lib/styles/colors';

import Paper from '../../node_modules/material-ui/lib/paper';

// ROUTER
import { History } from 'react-router';
import reactMixin from 'react-mixin';

// COMPONENTS
import TitleBar from './TitleBar.js';


class BroadcastLive extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      disabled: false,
      heartCount: 4000,
      listnerLiveCount: 1000,
      name:"Station Name That Is Super Duper Long Does This Wrap Properly?",
      description:"Description of the station",
      artist: "Rob Adelmann",
      artistAlias:"Gravity (Pink Mammoth)",
      artistImage:"https://i1.sndcdn.com/avatars-000018148011-fxojwa-t200x200.jpg",
      image:"https://i1.sndcdn.com/artworks-000061035457-wy5yn1-t200x200.jpg"
    };
  }

  startBroadcast() {
    this.setState({
      disabled:true
    })
  }

  stopBroadcast() {
    this.setState({
      disabled:false
    })
  }

  goToProfile() {
    this.props.history.push({
      pathname: '/broadcast/profile'
    })
  }

  render() {
    return (
      <div style={styles.container}>
        <TitleBar history={this.history}/>
        <div style={styles.cardContainer}>
          
          <Card style={styles.mainBox}>
            <a href="#">
            <CardHeader
              onClick={this.goToProfile.bind(this)}
              title={this.state.artistAlias}
              subtitle={this.state.artist}
              avatar={this.state.artistImage}
            /></a>
            <CardMedia style={styles.streamImage}>
              <img src={this.state.image}/>
            </CardMedia>
        
            <CardActions>
              <FloatingActionButton onClick={this.startBroadcast.bind(this)} disabled={this.state.disabled}>
                <Mic />
              </FloatingActionButton>
              <FloatingActionButton onClick={this.stopBroadcast.bind(this)} disabled={!this.state.disabled}>
               <MicOff />
              </FloatingActionButton>
            </CardActions>

            <CardTitle title={this.state.name}/>
            <CardText>
              {this.state.description}
            </CardText>
          </Card>
          <Card style={styles.box}>
            <CardText>
                <h2>STATS <TrendingUp /></h2>
                <div><span style={styles.count}>{this.state.listnerLiveCount.toLocaleString()}</span><span> Listens <Face /></span></div>
                <div><span style={styles.count}>{this.state.heartCount.toLocaleString()}</span><span> Hearts <Favorite color={Colors.red500}/></span></div>
            </CardText>
          </Card>

        </div>
      </div>
    )
  } 
}

var styles = {
  container:{
    'display': 'flex',
    'flexDirection' :'column',
  },

  cardContainer:{
    'display': 'flex',
    'flexDirection':'row',
    'flexWrap': 'wrap'
  },

  box: {
    'flex':1
  },

  mainBox: {
    'flexGrow':1,
    'max-width': '600px'
  },

  streamImage:{
    'max-width': '300px'
  },

  count:{
    fontWeight: 'bold'
  }
}

reactMixin.onClass(BroadcastLive, History);

export default BroadcastLive;
