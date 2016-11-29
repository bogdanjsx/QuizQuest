import React, { Component } from 'react';

var states = ['connected', 'category', 'answer', 'vote', 'blank'];

class Player extends Component {
  constructor(props) {
    super(props);
    this.state = {page: 'namePick'};
  }



  render() {
    var currentPage;

    switch(this.state.page) {
      case 'connected':
        currentPage = this.renderStartPage();
        break;
      case 'category':
        currentPage = this.renderCategoryPage();
        break;
      case 'answer':
        currentPage = this.renderQuestionPage();
        break;
      case 'vote':
        currentPage = this.renderAnswerChoosingPage();
        break;
      case 'blank':
        currentPage = this.renderResultsPage();
        break;
      default:
        currentPage = this.renderBlankPage();
    }

    return (
      <div className="Player">
        {currentPage}
      </div>
    );
  }
}

export default Player;
