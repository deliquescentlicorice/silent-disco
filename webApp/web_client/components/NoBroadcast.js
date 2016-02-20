import React from 'react';
import Card from '../../node_modules/material-ui/lib/card/card';
import CardText from '../../node_modules/material-ui/lib/card/card-text';

class NoBroadcast extends React.Component {
  render() {
    return (
      <Card>
        <CardText>
          Broadcasting requires a modern, standards-compliant desktop or laptop browser,
          such as <a href="https://www.google.com/chrome/browser/desktop/">Chrome</a> or <a href="https://www.mozilla.org/en-US/firefox/new/">Firefox</a>.
        </CardText>
      </Card>
    )
  }
}

export default NoBroadcast;