import React from 'react';

// MATERIAL DESIGN CARD
import Card from 'material-ui/lib/card/card';
import CardActions from '../../node_modules/material-ui/lib/card/card-actions';
import CardHeader from '../../node_modules/material-ui/lib/card/card-header';
import CardMedia from '../../node_modules/material-ui/lib/card/card-media';
import CardTitle from '../../node_modules/material-ui/lib/card/card-title';
import FlatButton from '../../node_modules/material-ui/lib/flat-button';
import FloatingActionButton from '../../node_modules/material-ui/lib/floating-action-button';
import TrendingUp from '../../node_modules/material-ui/lib/svg-icons/action/trending-up';
import Favorite from '../../node_modules/material-ui/lib/svg-icons/action/favorite';
import Face from '../../node_modules/material-ui/lib/svg-icons/action/face';
import CardText from '../../node_modules/material-ui/lib/card/card-text';
import TextField from '../../node_modules/material-ui/lib/text-field';
import RaisedButton from '../../node_modules/material-ui/lib/raised-button';
import Colors from '../../node_modules/material-ui/lib/styles/colors';
import Paper from '../../node_modules/material-ui/lib/paper';


/* 
  Editable:
  scUsername
  first_name
  last_name
  website
  website title
*/
class BroadcastProfileViewEdit extends React.Component {
  cancelEdit() {
    this.props.cancel()
  }

  saveEdit() {
    var lastName = this.refs.last_name.getValue()
    var firstName = this.refs.first_name.getValue()
    var editedUser = {
      scUsername: this.refs.scUsername.getValue(),
      first_name: firstName,
      last_name: lastName,
      full_name: firstName + ' ' + lastName,
      website: this.refs.website.getValue(),
      websiteTitle: this.refs.websiteTitle.getValue() 
    }
    this.props.save(editedUser);
  }

  renderField(field) {
    return (
      <div>
        <TextField
        style={styles.field}
        hintText={field[0]}
        floatingLabelText={field[0]}
        defaultValue={this.props.user[field[1]]}
        ref={field[1]}
        key={field[1]}
      /><br /><br />
      </div>
    )
  }

  render() {
    var fields = [["Broadcast Name", "scUsername"],
        ["First Name", "first_name"],
        ["Last Name", "last_name"],
        ["Website Address", "website"],
        ["Website Name", "websiteTitle"]];
    return (
      <Card>
        <CardTitle title="Edit Your Profile"/>
        <CardText>
          {fields.map(this.renderField.bind(this))}
        </CardText>
        <CardActions style={styles.actions}>
          <FlatButton label="Cancel" onClick={this.cancelEdit.bind(this)} />
          <FlatButton label="Save" onClick={this.saveEdit.bind(this)} />
        </CardActions>
      </Card>
    )
  }
}

var styles = {

  cardContainer:{
    'display': 'flex',
    'flexDirection':'row',
    'flexWrap': 'wrap',
    alignItem:'center',
    justifyContent:'center'
  },

  box: {
    'flexGrow':1,
  },

  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },

  field: {
    paddingBottom: '10px'
  },

  title:{
    'fontFamily':'Roboto, sans-serif'
  }
}

export default BroadcastProfileViewEdit;