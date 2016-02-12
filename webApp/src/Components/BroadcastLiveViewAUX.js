import React from 'react';

// MATERIAL DESIGN
import CardActions from '../../node_modules/material-ui/lib/card/card-actions';
import DropDownMenu from '../../node_modules/material-ui/lib/DropDownMenu';
import FloatingActionButton from '../../node_modules/material-ui/lib/floating-action-button';
import MenuItem from '../../node_modules/material-ui/lib/menus/menu-item';
import Mic from '../../node_modules/material-ui/lib/svg-icons/av/mic';
import MicOff from '../../node_modules/material-ui/lib/svg-icons/av/mic-off';
import CardText from '../../node_modules/material-ui/lib/card/card-text';
import TextField from '../../node_modules/material-ui/lib/text-field';

class BroadcastAUX extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {
    return (
      <CardActions style={styles.controls}>
        <div>
          <FloatingActionButton style={styles.button} onClick={this.props.startBroadcast} disabled={this.props.disabled}>
            <Mic />
          </FloatingActionButton>
          <FloatingActionButton style={styles.button} onClick={this.props.stopBroadcast} disabled={!this.props.disabled}>
           <MicOff />
          </FloatingActionButton>
        </div>
        <DropDownMenu value={this.props.selectedSource} onChange={this.props.sourceInput}>
          <MenuItem value={null} key={null} primaryText={"Select a source..."} />
          {this.props.audioSources.map(source => <MenuItem value={source.id} key={source.id} primaryText={source.label} />)}
        </DropDownMenu>
      </CardActions>
    )
  } 
}

var styles = {
  controls: {
    'display': 'flex',
    'justifyContent': 'space-around',
    'alignItems': 'center'
  },

  button: {
    'margin': '8px'
  }
}

export default BroadcastAUX;
