import React from 'react';

// MATERIAL DESIGN
import ListItem from '../../node_modules/material-ui/lib/lists/list-item';
import Divider from '../../node_modules/material-ui/lib/divider';
import Avatar from '../../node_modules/material-ui/lib/avatar';
import MenuItem from '../../node_modules/material-ui/lib/menus/menu-item';
import IconButton from '../../node_modules/material-ui/lib/icon-button';
import IconMenu from '../../node_modules/material-ui/lib/menus/icon-menu';
import MoreVertIcon from '../../node_modules/material-ui/lib/svg-icons/navigation/more-vert';
import Favorite from '../../node_modules/material-ui/lib/svg-icons/action/favorite';
import Face from '../../node_modules/material-ui/lib/svg-icons/action/face';
import Colors from '../../node_modules/material-ui/lib/styles/colors';

const iconButtonElement = (
  <IconButton
    touch={true}
    tooltip="more"
    tooltipPosition="bottom-left">
    <MoreVertIcon color={Colors.grey400} />
  </IconButton>
);

const rightIconMenu = (
  <IconMenu iconButtonElement={iconButtonElement}>
    <MenuItem>Delete</MenuItem>
  </IconMenu>
);

class BroadcastEntry extends React.Component {
  render() {
    return (
      <div>
        <ListItem
          rightIconButton={rightIconMenu}
          primaryText={this.props.details.name + ' - ' + this.props.details.desc.substr(0,60)}
          secondaryText={
            <p>
              <span style={styles.count}>{this.props.details.listenerMaxCount.toLocaleString()}</span><span> Listens <Face /></span> 
              <span style={styles.count}> | </span>
              <span style={styles.count}>{this.props.details.heartCountNum.toLocaleString()}</span><span>  Hearts <Favorite color={Colors.red500}/></span>
            </p>
          }
          secondaryTextLines={2}
        />
        <Divider inset={true} />
      </div>
    )
  }
}

var styles = {
  count:{
    // fontWeight: 'bold',
    color: 'black'
  }
}

export default BroadcastEntry;
