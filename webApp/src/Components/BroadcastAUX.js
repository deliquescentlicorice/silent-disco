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
      <CardActions>
        <FloatingActionButton onClick={this.props.startBroadcast.bind(this)} disabled={this.props.disabled}>
          <Mic />
        </FloatingActionButton>
        <FloatingActionButton onClick={this.props.stopBroadcast.bind(this)} disabled={!this.props.disabled}>
         <MicOff />
        </FloatingActionButton>
        <DropDownMenu value={this.props.selectedSource} onChange={this.props.sourceInput.bind(this)}>
          <MenuItem value={null} key={null} primaryText={"Select a source..."} />
          {this.props.audioSources.map(source => <MenuItem value={source.id} key={source.id} primaryText={source.label} />)}
        </DropDownMenu>
      </CardActions>
    )
  } 
}


export default BroadcastAUX;

// <CardActions>
//   <FloatingActionButton onClick={this.startBroadcast.bind(this)} disabled={this.state.disabled}>
//     <Mic />
//   </FloatingActionButton>
//   <FloatingActionButton onClick={this.stopBroadcast.bind(this)} disabled={!this.state.disabled}>
//    <MicOff />
//   </FloatingActionButton>
//   {dropDown}
// </CardActions>