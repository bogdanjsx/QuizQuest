import React, { Component } from 'react';
import './PlayerCounter.css';

class PlayerCounter extends Component {
  render() {
    return (
      <div className="PlayerCounter">
        <div className="PlayerCounterNumber">
          {this.props.number}
        </div>
        <div className="PlayerCounterDescription">
          {this.props.number === 1 ? 'player' : 'players'} {this.props.text}
        </div>
      </div>
    );
  }
}

export default PlayerCounter;
