import React from 'react';

// MATERIAL DESIGN
import ListItem from '../../node_modules/material-ui/lib/lists/list-item';
import Divider from '../../node_modules/material-ui/lib/divider';
import Avatar from '../../node_modules/material-ui/lib/avatar';
import MenuItem from '../../node_modules/material-ui/lib/menus/menu-item';
import IconButton from '../../node_modules/material-ui/lib/icon-button';
import MoreVertIcon from '../../node_modules/material-ui/lib/svg-icons/navigation/more-vert';
import IconMenu from '../../node_modules/material-ui/lib/menus/icon-menu';
import Favorite from '../../node_modules/material-ui/lib/svg-icons/action/favorite';
import Face from '../../node_modules/material-ui/lib/svg-icons/action/face';
import Colors from '../../node_modules/material-ui/lib/styles/colors';

class BroadcastSCEntry extends React.Component {
  constructor(props){
    super(props)
  }

  setSong(){
    this.props.addSongToQueue(this.props.track)
  }
  
  render() {
    return (
      <div>
        <ListItem
          onClick={this.setSong.bind(this)}
          primaryText={this.props.track.title}
          secondaryText={this.props.track.genre}
          leftAvatar={<Avatar src={this.props.track.artwork_url || this.props.track.user.avatar_url} />}
        />
        <Divider inset={true} />
      </div>
    )
  }
}

var styles = {
  
}

export default BroadcastSCEntry;

