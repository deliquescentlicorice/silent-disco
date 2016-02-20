import React from 'react';

// MATERIAL DESIGN
import Card from '../../node_modules/material-ui/lib/card/card';
import CardText from '../../node_modules/material-ui/lib/card/card-text';
import CardTitle from '../../node_modules/material-ui/lib/card/card-title';
import TextField from '../../node_modules/material-ui/lib/text-field';
import DropDownMenu from '../../node_modules/material-ui/lib/DropDownMenu';
import MenuItem from '../../node_modules/material-ui/lib/menus/menu-item';
import RaisedButton from '../../node_modules/material-ui/lib/raised-button';
import FontIcon from '../../node_modules/material-ui/lib/font-icon';

class BroadcastSetupView extends React.Component {
  constructor() {
    super()
    this.state = {
      isLive: "AUX"
    };
  }

  setSource(event, index, value) {
    this.setState({
      isLive: value
    });
  }

  startBroadcast() {
    var streamData = {
      name: this.refs.streamName.getValue(),
      desc: this.refs.desc.getValue(),
      isLive: this.state.isLive
    };
    this.props.startBroadcast(streamData);
  }

  render() {
    return (
      <div>
        <Card style={styles.cardContainer}>
          <CardTitle>
            Tell Us About Your Stream
          </CardTitle>
          <CardText>
            <TextField 
              ref="streamName"
              hintText="Stream Name"
              floatingLabelText="Stream Name"
            /><br/>
            <TextField 
              ref="desc"
              hintText="Description"
              floatingLabelText="Description"
            /><br/><br/>
            <p>Choose Your Audio Source</p>
            <DropDownMenu ref="isLive" onChange={this.setSource.bind(this)} value={this.state.isLive}>
              <MenuItem value={"AUX"} primaryText="AUX or Mic"/>
              <MenuItem value={"SC"} primaryText="SoundCloud"/>
            </DropDownMenu><br/><br/>
            <RaisedButton 
              primary={true} 
              onClick={this.startBroadcast.bind(this)} 
              label="Start Broadcasting"
              icon={<FontIcon className="fa fa-microphone"/>} />
          </CardText>
        </Card>
      </div>
    )
  }
}

var styles = {
  cardContainer:{
    'display': 'flex',
    'flexDirection':'row',
    'flexWrap': 'wrap',
    'alignItem': 'center',
    'justifyContent': 'center'
  },
  box: {
    'flexGrow':1,
  },
  title:{
    'fontFamily':'Roboto, sans-serif'
  }
}

export default BroadcastSetupView;
