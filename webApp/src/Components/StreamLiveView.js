import React from 'react';

// COMPONENTS
import BroadcastStats from './BroadcastStats';
import StreamLiveViewLinkbar from './StreamLiveViewLinkbar';

// MATERIAL DESIGN
import Card from '../../node_modules/material-ui/lib/card/card';
import CardActions from '../../node_modules/material-ui/lib/card/card-actions';
import CardMedia from '../../node_modules/material-ui/lib/card/card-media';
import CardText from '../../node_modules/material-ui/lib/card/card-text';
import CardTitle from '../../node_modules/material-ui/lib/card/card-title';
import FloatingActionButton from '../../node_modules/material-ui/lib/floating-action-button';
import Play from '../../node_modules/material-ui/lib/svg-icons/av/play-arrow';
import Pause from '../../node_modules/material-ui/lib/svg-icons/av/pause';
import Favorite from '../../node_modules/material-ui/lib/svg-icons/action/favorite';

class StreamLiveView extends React.Component {
  render() {
    return (
      <div style={styles.cardContainer}>
        <Card style={styles.mainBox}>
          <CardMedia style={styles.streamImage}>
            <img src={this.props.state.image} />
          </CardMedia>
          <CardTitle
            title={this.props.state.name}
            subtitle={
              <StreamLiveViewLinkbar 
                broadcaster={this.props.state.broadcaster || 'pseudonymous'}
                soundcloud={this.props.state.soundcloud} 
                website={this.props.state.website}
                websiteTitle={this.props.state.websiteTitle} />
            } />
          <CardText>
            {this.props.state.desc}
          </CardText>
          <CardActions>
            <FloatingActionButton
              onClick={this.props.playSong}
              secondary={true}
              disabled={this.props.state.disabled}>
              <Play />
            </FloatingActionButton>
            <span></span>
            <FloatingActionButton
              onClick={this.props.stopSong}
              secondary={true}
              disabled={!this.props.state.disabled}>
              <Pause />
            </FloatingActionButton>
            <FloatingActionButton onClick={this.props.addHeart}>
              <Favorite />
            </FloatingActionButton>
          </CardActions>
        </Card>
        <Card style={styles.box}>
          <BroadcastStats
            listenerLiveCount={this.props.state.listenerLiveCount}
            listenerMaxCount={this.props.state.listenerMaxCount}
            heart={this.props.state.heartCount} />
        </Card>
      </div>
    )
  }
}

var styles = {
  cardContainer:{
    'display': 'flex',
    'flexDirection': 'row',
    'flexWrap': 'wrap'
  },

  box: {
    'flex': 3
  },

  mainBox: {
    'flexGrow': 1,
    'maxWidth': '600px',
    'alignContent': 'center',
  },

  streamImage:{
    'maxWidth': '300px'
  },

  card: {
    'flexGrow': 1,
    'alignContent': 'center',
    'maxWidth': 325
    // 'border': '10px solid yellow',
    // 'height': '100vh'
  }
}

export default StreamLiveView;
