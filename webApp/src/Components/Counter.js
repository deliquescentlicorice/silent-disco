import React, { Component } from 'react';
import ReactDOM from 'react-dom';
export default class Counter extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
       <div>
        counter value: {this.props.value}
       </div>
    );
  }
}
