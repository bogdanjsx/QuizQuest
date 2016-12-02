import React, { Component } from 'react';
import './ResultBubble.css';

class ResultBubble extends Component {
  render() {
    return (
      <div style={this.props.style} className={this.props.className}>
          <div className="PlayerName">
            {this.props.name}
          </div>
          <div className="PlayerScore">
            {this.props.score} P
          </div>
      </div>
    );
  }
}

export default ResultBubble;
