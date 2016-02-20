import React from 'react';

// MATERIAL DESIGN
import ListItem from '../../node_modules/material-ui/lib/lists/list-item';
import Divider from '../../node_modules/material-ui/lib/divider';
import Avatar from '../../node_modules/material-ui/lib/avatar';
import Close from '../../node_modules/material-ui/lib/svg-icons/navigation/close';

class BroadcastQueueEntry extends React.Component {
  constructor(props){
    super(props)
  }

  removeSong(){
    this.props.removeSongFromQueue(this.props.index)
  }
  
  render() {
    return (
      <div>
        <ListItem
          primaryText={this.props.track.title}
          secondaryText={this.props.track.genre}
          leftAvatar={<Avatar src={this.props.track.artwork_url || this.props.track.user.avatar_url} />}
          rightIconButton={<Close onClick={this.removeSong.bind(this)}/>}
          disabled={true}
        />
        <Divider inset={true} />
      </div>
    )
  }
}

var styles = {
  
}

export default BroadcastQueueEntry;