import React from 'react';

// MATERIAL DESIGN CARD
import Card from 'material-ui/lib/card/card';
import CardActions from '../../node_modules/material-ui/lib/card/card-actions';
import CardHeader from '../../node_modules/material-ui/lib/card/card-header';
import CardMedia from '../../node_modules/material-ui/lib/card/card-media';
import CardTitle from '../../node_modules/material-ui/lib/card/card-title';
import FlatButton from '../../node_modules/material-ui/lib/flat-button';
import FloatingActionButton from '../../node_modules/material-ui/lib/floating-action-button';
import TrendingUp from '../../node_modules/material-ui/lib/svg-icons/action/trending-up';
import Favorite from '../../node_modules/material-ui/lib/svg-icons/action/favorite';
import Face from '../../node_modules/material-ui/lib/svg-icons/action/face';
import CardText from '../../node_modules/material-ui/lib/card/card-text';
import TextField from '../../node_modules/material-ui/lib/text-field';
import RaisedButton from '../../node_modules/material-ui/lib/raised-button';
import Colors from '../../node_modules/material-ui/lib/styles/colors';

import Paper from '../../node_modules/material-ui/lib/paper';
import List from '../../node_modules/material-ui/lib/lists/list';

// ROUTER
import { History } from 'react-router';
import reactMixin from 'react-mixin';

// COMPONENTS
import NavBar from './NavBar.js'
import BroadcastEntry from './BroadcastEntry.js'

// AJAX GET CALL
import $ from '../../public/js/jquery-1.11.1.min';


class BroadcastProfile extends React.Component {
  constructor() {
    super();

    this.state = {
      artist: {
        artist: "Rob Adelmann",
        artistAlias:"Gravity (Pink Mammoth)",
        artistImage:"https://i1.sndcdn.com/avatars-000018148011-fxojwa-t200x200.jpg",
      }, 

      streams : [
        {
          disabled: false,
          heartCount: 4000,
          listnerLiveCount: 1000,
          name:"Live from Pink Mammoth - Burning Man 2013",
          description:"Description of the station",
          artist: "Rob Adelmann",
          artistAlias:"Gravity (Pink Mammoth)",
          artistImage:"https://i1.sndcdn.com/avatars-000018148011-fxojwa-t200x200.jpg",
          image:"https://i1.sndcdn.com/artworks-000061035457-wy5yn1-t200x200.jpg"
        },
        {
          disabled: false,
          heartCount: 10000,
          listnerLiveCount: 8000,
          name:"Live from Pink Mammoth - Burning Man 2015",
          description:"Super Awesome",
          artist: "Rob Adelmann",
          artistAlias:"Gravity (Pink Mammoth)",
          artistImage:"https://i1.sndcdn.com/avatars-000018148011-fxojwa-t200x200.jpg",
          image:"https://i1.sndcdn.com/artworks-000061035457-wy5yn1-t200x200.jpg"
        },
        {
          disabled: false,
          heartCount: 10000,
          listnerLiveCount: 8000,
          name:"Live from Pink Mammoth - Burning Man 2012",
          description:"Super Awesome",
          artist: "Rob Adelmann",
          artistAlias:"Gravity (Pink Mammoth)",
          artistImage:"https://i1.sndcdn.com/avatars-000018148011-fxojwa-t200x200.jpg",
          image:"https://i1.sndcdn.com/artworks-000061035457-wy5yn1-t200x200.jpg"
        },
        {
          disabled: false,
          heartCount: 10000,
          listnerLiveCount: 8000,
          name:"Live from Pink Mammoth - Burning Man 2016",
          description:"Super Awesome",
          artist: "Rob Adelmann",
          artistAlias:"Gravity (Pink Mammoth)",
          artistImage:"https://i1.sndcdn.com/avatars-000018148011-fxojwa-t200x200.jpg",
          image:"https://i1.sndcdn.com/artworks-000061035457-wy5yn1-t200x200.jpg"
        }
        ]
    };
  }

  componentDidMount(){
    this.fetchUserData()
    
  }

  fetchUserData() {
    $.ajax({
      url: '/api/user/'+ this.props.params.userId
    })
    .done((responseData) => {
      this.setState({
        user: responseData
      });
      console.log('State',this.state);
    });
  }

  goToBroadcast() {
    var broadcastId= this.props.index;
    console.log("Going To Stream " + broadcastId);

    this.props.history.push({
      pathname: '/broadcast/live',

      //so we get which song from the state; a single GET request
      //we could also send a new request to the server to get each individual song
        //i'll look at this for testing purposes
      state: { stream : this.props.state.streams[broadcastId] }
    });
  }

  renderStream(key){
    return <BroadcastEntry goToBroadcast={this.goToBroadcast} history={this.history} state={this.state} key={key} index={key} details={this.state.streams[key]} />
  }

  listnerCountTotal(){
    var sum = 0;
    for(var i=0;i<this.state.streams.length;i++){
      sum = sum + this.state.streams[i].listnerLiveCount;
    }
    return sum.toLocaleString()
  }

  heartCountTotal(){
    var sum = 0;
    for(var i=0;i<this.state.streams.length;i++){
      sum = sum + this.state.streams[i].heartCount;
    }
    return sum.toLocaleString()
  }

  render() {
    return (
      <div style={styles.container}>
        <NavBar title="Profile" history={this.history}/>
        <div style={styles.box}>
          <Card>
          <CardHeader
              title={this.state.user.scUsername}
              subtitle={this.state.user.full_name}
              avatar={this.state.user.scAvatarUri}
            />
            <div>
              <CardText>
                <h2>TOTAL STATS <TrendingUp /></h2>
                <div><span style={styles.count}>{this.listnerCountTotal()}</span><span> Listens <Face /></span></div>
                <div><span style={styles.count}>{this.heartCountTotal()}</span><span> Hearts <Favorite color={Colors.red500}/></span></div>
              </CardText>
            </div>
          </Card>
        </div>
        <div style={styles.box}>
          <List subheader="Previous Streams" style={styles.box}>
            {Object.keys(this.state.streams).map(this.renderStream.bind(this))}
          </List>
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
    flex:1
  },

  count:{
    fontWeight: 'bold'
  }
}

reactMixin.onClass(BroadcastProfile, History);

export default BroadcastProfile;
