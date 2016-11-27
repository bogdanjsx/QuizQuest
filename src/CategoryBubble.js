import React, { Component } from 'react';

class CategoryBubble extends Component {
  render() {
    return (
      <div className="CategoryBubble">
        <button>
          {this.props.category}
        </button>
      </div>
    );
  }
}

export default CategoryBubble;
