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

// COMPONENTS
import BroadcastEntry from './BroadcastEntry.js'

class BroadcastProfileView extends React.Component {
  goToBroadcast() {
    console.log("broadcast",this)
    var broadcastId= this.props.details._id;
    console.log("Going To Stream " + broadcastId);

    this.props.history.push({
      pathname: '/broadcast/'+broadcastId
    });
  }

  listenerCountTotal(){
    var sum = 0;
    for (var i=0; i <this.props.streams.length; i++) {
      sum = sum + this.props.streams[i].listenerMaxCount;
    }
    return sum.toLocaleString()
  }

  heartCountTotal(){
    var sum = 0;
    for (var i=0; i <this.props.streams.length; i++) {
      sum = sum + this.props.streams[i].heartCountNum;
    }
    return sum.toLocaleString()
  }

  renderStream(key){
    return <BroadcastEntry
      goToBroadcast={this.goToBroadcast}
      history={this.props.history}
      key={key}
      index={key}
      details={this.props.streams[key]} />
    return <div></div>
  }

  render() {
    var partial;
    if (this.props.isLoading) {
      partial = <div></div>
    } else {
      partial = (
        <div>
          <div style={styles.box}>
            <Card>
            <CardHeader
                title={this.props.user.scUsername}
                subtitle={this.props.user.full_name}
                avatar={this.props.user.scAvatarUri}
              />
              <div>
                <CardText>
                  <h2>TOTAL STATS <TrendingUp /></h2>
                  <div>
                    <span style={styles.count}>{this.listenerCountTotal()}</span><span> Listens <Face /></span>
                  </div>
                  <div>
                    <span style={styles.count}>{this.heartCountTotal()}</span><span> Hearts <Favorite color={Colors.red500}/></span>
                  </div>
                </CardText>
              </div>
            </Card>
          </div>
          <div style={styles.box}>
            <List subheader="Previous Streams" style={styles.box}>
              {Object.keys(this.props.streams).map(this.renderStream.bind(this))}
            </List>
          </div>
        </div>
      )
    }
    return partial
  }
}

var styles = {
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

export default BroadcastProfileView;