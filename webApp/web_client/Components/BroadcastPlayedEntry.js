import React from 'react';

// MATERIAL DESIGN
import ListItem from '../../node_modules/material-ui/lib/lists/list-item';
import Divider from '../../node_modules/material-ui/lib/divider';
import Avatar from '../../node_modules/material-ui/lib/avatar';

class BroadcastPlayedEntry extends React.Component {
  render() {
    return (
      <div>
        <ListItem
          primaryText={this.props.track.title}
          secondaryText={this.props.track.genre}
          leftAvatar={<Avatar src={this.props.track.artwork_url || this.props.track.user.avatar_url} />}
          disabled={true}
        />
        <Divider inset={true} />
      </div>
    )
  }
}

var styles = {
  
}

export default BroadcastPlayedEntry;