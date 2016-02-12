import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { History } from 'react-router';
import reactMixin from 'react-mixin';


// MATERIAL UI
import List from '../../node_modules/material-ui/lib/lists/list';
import Card from '../../node_modules/material-ui/lib/card/card';
import CardText from '../../node_modules/material-ui/lib/card/card-text';
import CardMedia from '../../node_modules/material-ui/lib/card/card-media';



class NoStream extends React.Component {
  constructor(props) {
    super(props);
  }


  render() {
    return (
      <Card>
        <CardText>
          No Streams Are Currently Available
        </CardText>
      </Card>
    )
  }
}

var styles = {
  image:{
    'maxWidth': '300px'
  }
}
export default NoStream;
