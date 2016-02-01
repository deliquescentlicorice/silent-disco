import React from 'react';

// MATERIAL DESIGN
import Card from 'material-ui/lib/card/card';
import CardActions from '../../node_modules/material-ui/lib/card/card-actions';
import CardHeader from '../../node_modules/material-ui/lib/card/card-header';
import CardMedia from '../../node_modules/material-ui/lib/card/card-media';
import CardTitle from '../../node_modules/material-ui/lib/card/card-title';
import FlatButton from '../../node_modules/material-ui/lib/flat-button';
import CardText from '../../node_modules/material-ui/lib/card/card-text';
import TextField from '../../node_modules/material-ui/lib/text-field';
import RaisedButton from '../../node_modules/material-ui/lib/raised-button';

// ROUTER
import { History } from 'react-router';
import reactMixin from 'react-mixin';

// COMPONENTS
import TitleBar from './TitleBar.js'


class BroadcastLive extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      
    };
  }


  render() {
    return (
      <div style={styles.container}>
        <TitleBar />
        <div style={styles.cardContainer}>
          <Card style={styles.box} >
            <CardText>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi.
              Donec vulputate interdum sollicitudin. Nunc lacinia auctor quam sed pellentesque.
              Aliquam dui mauris, mattis quis lacus id, pellentesque lobortis odio.
            </CardText>
          </Card>
          <br />
          <Card style={styles.box}>
            <CardHeader
              title="URL Avatar"
              subtitle="Subtitle"
              avatar="http://lorempixel.com/100/100/nature/"
            />
            <CardMedia>
              <img src="http://lorempixel.com/600/337/nature/" />
            </CardMedia>
            <CardTitle title="Card title" subtitle="Card subtitle" />
            <CardText>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi.
              Donec vulputate interdum sollicitudin. Nunc lacinia auctor quam sed pellentesque.
              Aliquam dui mauris, mattis quis lacus id, pellentesque lobortis odio.
            </CardText>
            <CardActions>
              <FlatButton label="Action1" />
              <FlatButton label="Action2" />
            </CardActions>
          </Card>
          <br />
          <Card style={styles.box}>
            <CardText>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi.
              Donec vulputate interdum sollicitudin. Nunc lacinia auctor quam sed pellentesque.
              Aliquam dui mauris, mattis quis lacus id, pellentesque lobortis odio.
            </CardText>
          </Card>
        </div>
      </div>
    )
  } 
}

var styles = {
  container:{
    'display': 'flex',
    'flexDirection' :'column',
    'flexWrap': 'wrap'
  },

  cardContainer:{
    'display': 'flex',
    'flexDirection':'row',
  },

  box: {
    flex:1
  }
}



export default BroadcastLive;