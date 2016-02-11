import React from 'react';

// MATERIAL DESIGN
import CardText from '../../node_modules/material-ui/lib/card/card-text';
import TrendingUp from '../../node_modules/material-ui/lib/svg-icons/action/trending-up';
import Favorite from '../../node_modules/material-ui/lib/svg-icons/action/favorite';
import Face from '../../node_modules/material-ui/lib/svg-icons/action/face';
import Colors from '../../node_modules/material-ui/lib/styles/colors';

// UTILITIES
import $ from '../../public/js/jquery-1.11.1.min';


class BroadcastStats extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      
    };
  }

  render() {
    return (
      <CardText>
        <h2>STATS <TrendingUp /></h2>
        <div>
          <span style={styles.count}>{this.props.listenerTotalCount.toLocaleString()}</span><span> Total Listener Count <Face style={styles.icon} /></span>
        </div><br />
        <div>
          <span style={styles.count}>{this.props.listenerLiveCount.toLocaleString()}</span><span> Currently Listening <Face style={styles.icon} /></span>
        </div><br/>
        <div>
          <span style={styles.count}>{this.props.heart.toLocaleString()}</span><span> Hearts <Favorite style={styles.icon} color={Colors.red500}/></span>
          </div>
      </CardText>
    )
  } 
}

var styles = {
  icon:{
    'marginBottom': '-6px'
  },

  count:{
    'fontWeight': 'bold'
  }
}


export default BroadcastStats;
