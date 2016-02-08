import React from 'react';
import ListItem from '../../node_modules/material-ui/lib/lists/list-item';
import Divider from '../../node_modules/material-ui/lib/divider';
import Avatar from '../../node_modules/material-ui/lib/avatar';
import IconButton from '../../node_modules/material-ui/lib/icon-button';
import MoreVertIcon from '../../node_modules/material-ui/lib/svg-icons/navigation/more-vert';
import IconMenu from '../../node_modules/material-ui/lib/menus/icon-menu';
import MenuItem from '../../node_modules/material-ui/lib/menus/menu-item';
import Favorite from '../../node_modules/material-ui/lib/svg-icons/action/favorite';
import Face from '../../node_modules/material-ui/lib/svg-icons/action/face';
import Colors from '../../node_modules/material-ui/lib/styles/colors';

const iconButtonElement = (
  <IconButton
    touch={true}
    tooltip="more"
    tooltipPosition="bottom-left"
  >
    <MoreVertIcon color={Colors.grey400} />
  </IconButton>
);

const rightIconMenu = (
  <IconMenu iconButtonElement={iconButtonElement}>
    <MenuItem>Delete</MenuItem>
  </IconMenu>
);

class BroadcastSCEntry extends React.Component {
  constructor(props){
    super(props)
  }



  setSong(){
    this.props.changeSCSong(this.props.index)
  }
  
  render() {
    return (
      <div>
        <ListItem
          onClick={ this.setSong.bind(this) }
          primaryText={this.props.title}
          secondaryText={this.props.genre}
          leftAvatar={<Avatar src={this.props.artwork} />}
          rightIconButton={rightIconMenu}
          // secondaryText={this.state.favorites[2].stream_url}
          // rightIcon={<PlayCircleOutline />}
        />
        <Divider inset={true} />
      </div>
    )
  }
}

var styles = {
  
}

export default BroadcastSCEntry;