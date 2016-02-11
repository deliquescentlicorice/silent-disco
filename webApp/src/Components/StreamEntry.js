import React from 'react';

// MATERIAL DESIGN
import ListItem from '../../node_modules/material-ui/lib/lists/list-item';
import Avatar from '../../node_modules/material-ui/lib/avatar';
import PlayCircleOutline from 'material-ui/lib/svg-icons/av/play-circle-outline';

class StreamEntry extends React.Component {
  render() {
    console.log(this.props.stream)
    return (
      <ListItem
        onClick={this.props.goToStream.bind(this)}
        primaryText={this.props.stream.name}
        secondaryText={this.props.stream.broadcaster}
        leftAvatar={<Avatar src={this.props.stream.broadcasterImage} />}
        rightIcon={<PlayCircleOutline />} />
    )
  }
}

export default StreamEntry;