import React from 'react';

// COMPONENTS
import BroadcastStats from './BroadcastStats';

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
    var linkBlock = this.props.state.website ? (
      <div>
        <p><a href={this.props.state.soundcloud} target="_blank">SoundCloud</a></p>
        <p><a href={this.props.state.website} target="_blank">{this.props.state.websiteTitle || this.props.state.website}</a></p>
      </div>
    ) : (
      <p><a href={this.props.state.soundcloud} target="_blank">SoundCloud</a></p>
    )
    return (
      <div style={styles.cardContainer}>
        <Card style={styles.mainBox}>
          <CardHeader
            title="Broadcaster"
            subtitle={this.props.state.broadcaster}
            avatar={this.props.state.broadcasterImage}  />
          <div style={styles.image}>
            <CardMedia style={styles.streamImage}>
              <img src={this.props.state.streamImage} />
            </CardMedia>
          </div>
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
          <CardText>
            <h2>DETAILS</h2>
            <div>
              {linkBlock}
            </div>
          </CardText>   
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
    'alignContent': 'center'
  },

  image: {
    'display': 'flex',
    'justifyContent':'center'
  },

  streamImage:{
    'maxWidth': '350px',
    'border': 'solid 1px grey',
    'padding': '5px'
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
