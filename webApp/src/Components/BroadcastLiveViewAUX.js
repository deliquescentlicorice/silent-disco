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

  showInstructionsIfOffTheAir() {
    // this value is used to disable/enable broadcast buttons further down
    // the page. rather than passing in another prop, we'll use this.
    return this.props.disabled ? (
      <canvas style={styles.visualizer} id="visualizer"></canvas>
    ) : (
      <div style={styles.instructions}><div>Select a Source and Click the Microphone to Begin Broadcasting</div></div>
    )
  }

  offTheAirIndicator() {
    return this.props.disabled ? (
      <span></span>
    ) : (
      <div style={styles.offTheAir}>OFF THE AIR</div>
    )
  }

  render() {
    return (
      <div>
        <div style={styles.visualizerContainer}>
          {this.showInstructionsIfOffTheAir()}
        </div>
        <CardActions style={styles.controls}>
          <div>
            <FloatingActionButton style={styles.button} onClick={this.props.startBroadcast} disabled={this.props.disabled}>
              <Mic />
            </FloatingActionButton>
            <FloatingActionButton style={styles.button} onClick={this.props.stopBroadcast} disabled={!this.props.disabled}>
             <MicOff />
            </FloatingActionButton>
          </div>
          <div style={styles.broadcastStatus}>
            {this.offTheAirIndicator()}
          </div>
          <DropDownMenu value={this.props.selectedSource} onChange={this.props.sourceInput}>
            <MenuItem value={null} key={null} primaryText={"Select a source..."} />
            {this.props.audioSources.map(source => <MenuItem value={source.id} key={source.id} primaryText={source.label} />)}
          </DropDownMenu>
        </CardActions>
      </div>
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
  },

  instructions: {
    'display': 'flex',
    'justifyContent': 'center',
  },

  visualizer: {
    'width': '100%',
    'height': '100%'
  },

  visualizerContainer: {
    'display': 'flex',
    'height': '300px',
    'margin': '10px',
    'border': 'solid 1px #EAEAEA',
    'justifyContent': 'center',
    'alignItems': 'center'
  },

  broadcastStatus: {
    'display': 'flex',
    'width': '100px',
    'height': '60px',
    'alignItems': 'center'
  },

  offTheAir: {
    'color': 'red'
  }
}

export default BroadcastAUX;
