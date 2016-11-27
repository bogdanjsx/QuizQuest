import React, { Component } from 'react';

class Bubble extends Component {
  render() {
    return (
      <div className={this.props.className}>
          {this.props.text}
      </div>
    );
  }
}

export default Bubble;
