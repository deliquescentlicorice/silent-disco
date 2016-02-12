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


class BroadcastEntry extends React.Component {
  render() {
    console.log(this.props.details);
    return (
      <div>
        <ListItem
          disabled={true}
          primaryText={this.props.details.name + ' - ' + this.props.details.description.substr(0,60)}
          secondaryText={
            <p>
              <span style={styles.count}>{this.props.details.listenerMaxCount.toLocaleString()}</span><span> Listens <i style={styles.count}className="fa fa-headphones"></i></span> 
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
