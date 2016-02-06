import React from 'react';

// MATERIAL DESIGN
import TrendingUp from '../../node_modules/material-ui/lib/svg-icons/action/trending-up';
import Favorite from '../../node_modules/material-ui/lib/svg-icons/action/favorite';
import Face from '../../node_modules/material-ui/lib/svg-icons/action/face';
import CardText from '../../node_modules/material-ui/lib/card/card-text';
import Colors from '../../node_modules/material-ui/lib/styles/colors';


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
        <div><span style={styles.count}>{this.props.listenerMaxCount.toLocaleString()}</span><span> Total Listeners <Face /></span></div><br/>
        <div><span style={styles.count}>{this.props.listenerLiveCount.toLocaleString()}</span><span> Current Listeners <Face /></span></div><br/>
        <div><span style={styles.count}>{this.props.heart.toLocaleString()}</span><span> Hearts <Favorite color={Colors.red500}/></span></div>
      </CardText>
    )
  } 
}

var styles = {
  count:{
    fontWeight: 'bold'
  }
}


export default BroadcastStats;

