import React from 'react';

// MATERIAL DESIGN
import CircularProgress from '../../node_modules/material-ui/lib/circular-progress';

class Loading extends React.Component {
  render() {
    return (
      <div style={styles.loader}>
        <CircularProgress />
      </div>
    )
  }
}

var styles = {
  loader: {
    'position': 'fixed',
    'top': '50%',
    'left': '50%',
    'transform': 'translate(-50%, -50%)',
    'border': '1px solid grey',
    'borderRadius': '15px',
    'padding': '10px'
  }
}

export default Loading;
