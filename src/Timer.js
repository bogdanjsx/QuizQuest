import React, { Component } from 'react';
import './Timer.css';

class Timer extends Component {
  render() {
    return (
      <div className="timer">
          {this.props.value}
      </div>
    );
  }
}

export default Timer;
