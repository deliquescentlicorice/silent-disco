import React from 'react';

// COMPONENTS
import BroadcastEntry from './BroadcastEntry.js'

// MATERIAL DESIGN CARD
import Card from 'material-ui/lib/card/card';
import CardActions from '../../node_modules/material-ui/lib/card/card-actions';
import CardHeader from '../../node_modules/material-ui/lib/card/card-header';
import CardMedia from '../../node_modules/material-ui/lib/card/card-media';
import CardText from '../../node_modules/material-ui/lib/card/card-text';
import CardTitle from '../../node_modules/material-ui/lib/card/card-title';
import FlatButton from '../../node_modules/material-ui/lib/flat-button';
import FloatingActionButton from '../../node_modules/material-ui/lib/floating-action-button';
import TrendingUp from '../../node_modules/material-ui/lib/svg-icons/action/trending-up';
import Favorite from '../../node_modules/material-ui/lib/svg-icons/action/favorite';
import Face from '../../node_modules/material-ui/lib/svg-icons/action/face';
import TextField from '../../node_modules/material-ui/lib/text-field';
import RaisedButton from '../../node_modules/material-ui/lib/raised-button';
import Colors from '../../node_modules/material-ui/lib/styles/colors';
import Paper from '../../node_modules/material-ui/lib/paper';
import List from '../../node_modules/material-ui/lib/lists/list';

class BroadcastProfileView extends React.Component {
  goToBroadcast() {
    var broadcastId = this.props.details._id;
    this.props.history.push({
      pathname: '/broadcast/'+broadcastId
    });
  }

  listenerCountTotal(){
    var sum = 0;
    for (var i = 0; i < this.props.streams.length; i++) {
      sum = sum + this.props.streams[i].listenerMaxCount;
    }
    return sum.toLocaleString();
  }

  heartCountTotal(){
    var sum = 0;
    for (var i = 0; i < this.props.streams.length; i++) {
      sum = sum + this.props.streams[i].heartCountNum;
    }
    return sum.toLocaleString();
  }

  renderStream(key){
    return <BroadcastEntry
      goToBroadcast={this.goToBroadcast}
      history={this.props.history}
      key={key}
      index={key}
      details={this.props.streams[key]} />
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
              <div style={styles.subcontainer}>
                <CardText style={styles.stats}>
                  <h2>DETAILS</h2>
                  <div style={styles.datum}>
                    <span style={styles.label}>Broadcast Name: </span><span>{this.props.user.scUsername || 'pseudonymous'}</span>
                  </div>
                  <div style={styles.datum}>
                    <span style={styles.label}>Full Name: </span><span>{this.props.user.full_name || 'anonymous'}</span>
                  </div>
                  <div style={styles.datum}>
                    <span style={styles.label}>Website Title: </span><span>{this.props.user.websiteTitle || '(none)'}</span>
                  </div>
                  <div style={styles.datum}>
                    <span style={styles.label}>Website URL: </span><span>{this.props.user.website || '(none)'}</span>
                  </div>
                </CardText>
                <CardText style={styles.stats}>
                  <h2>LIFETIME STATS <TrendingUp style={styles.icon} /></h2>
                  <div style={styles.datum}>
                    <span style={styles.label}>{this.listenerCountTotal()}</span><span> Listens <i className="fa fa-headphones"></i></span>
                  </div>
                  <div style={styles.datum}>
                    <span style={styles.label}>{this.heartCountTotal()}</span><span> Hearts <Favorite style={styles.icon} color={Colors.red500}/></span>
                  </div>
                </CardText>
              </div>
              <CardActions>
                <FlatButton label="edit" onClick={this.props.edit} />
              </CardActions>
            </Card>
            <Card>
              <List subheader="Previous Streams" style={styles.box}>
                {Object.keys(this.props.streams).map(this.renderStream.bind(this))}
              </List>
            </Card>
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

  subcontainer:{
    'display': 'flex',
    'flexDirection':'row',
  },

  tableEntries:{
    alignContent: 'flex-end'
  },

  datum:{
    marginBottom: '5px'
  },

  stats:{
    width: '50%'
  },

  icon:{
    marginBottom: '-6px'
  },

  box: {
    flex:1
  },

  label:{
    fontWeight: 'bold'
  }
}

export default BroadcastProfileView;