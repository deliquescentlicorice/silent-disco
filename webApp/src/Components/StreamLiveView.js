import React from 'react';

// COMPONENTS
import BroadcastStats from './BroadcastStats';
import StreamLiveViewLinkbar from './StreamLiveViewLinkbar';

// MATERIAL DESIGN
import Card from '../../node_modules/material-ui/lib/card/card';
import CardActions from '../../node_modules/material-ui/lib/card/card-actions';
import CardMedia from '../../node_modules/material-ui/lib/card/card-media';
import CardHeader from '../../node_modules/material-ui/lib/card/card-header';
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
            <img src={this.props.state.streamImage} />
          </CardMedia>
          <CardTitle
            title={this.props.state.name}
           />
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
            listenerTotalCount={this.props.state.listenerTotalCount}
            listenerMaxCount={this.props.state.listenerMaxCount}
            heart={this.props.state.heartCount} />
          <br/>
          <CardHeader
            title={"You are listening to:"}
            subtitle={
              <StreamLiveViewLinkbar 
                broadcaster={ this.props.state.broadcaster || this.props.state.fullname || 'pseudonymous'}
                soundcloud={this.props.state.soundcloud} 
                website={this.props.state.website}
                websiteTitle={this.props.state.websiteTitle} />
            }
            avatar={this.props.state.broadcasterImage} />
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
    'flex': 1
  },

  mainBox: {
    'flex': 2,
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
