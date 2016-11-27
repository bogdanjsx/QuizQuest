import React, { Component } from 'react';
import logo from '../assets/mipmap-xhdpi/ic_launcher.png';

import PlayerCounter from './PlayerCounter.js';
import Bubble from './CategoryBubble.js';
import Timer from './Timer.js'

import './App.css';
import './CategoryBubble.css';

var categories = ['a', 'bbbb', 'cartofi prajiti'],
    question = 'How many cats does it take to screw in a lightbulb?',
    answers = ['none', 'three black ones', 'all of them', 'cats???'];

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {page: 'category'};
  }

  renderStartPage() {
    return (
      <div className="StartPage">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Let's play QuizQuest!</h2>
        </div>
        <div className="App-intro">
          To get started, please connect to ip-here.
        </div>
        <PlayerCounter number={3} text="connected" />
        <PlayerCounter number={1} text="ready" />
      </div>
    );
  }

  renderCategoryPage() {
    return (
      <div className="CategoryPage">
        <div className="App-header">
          <Timer value={40} />
          <h2>player-name-here, please choose a category!</h2>
        </div>
        <div className="CategoryList">
          {categories.map((cat) => <Bubble className="categoryBubble" text={cat.toUpperCase()} key={cat}/>)}
        </div>
      </div>
    );
  }

  renderQuestionPage() {
    return (
      <div className="Question">
        The question is:
        {question}
        Input your answer on your device!
      </div>
    );
  }

  renderAnswerChoosingPage() {
    return (
      <div className="Question">
        Here are your answers:
        Choose the one you think is best!
        <div className="AnswerList">
          {answers.map((cat) => <Bubble category={cat} key={cat}/>)}
        </div>
      </div>
    );
  }

  renderResultsPage() {
    return (
      <div className="Question">
        The results are in!
        Here's how you did:
        <div className="Results">
          {answers.map((ans, ind) => <Bubble category={ans} key={ans}/>)}
        </div>
      </div>
    );
  }

  render() {
    var currentPage = this.renderStartPage();

    switch(this.state.page) {
      case 'start':
        currentPage = this.renderStartPage();
        break;
      case 'category':
        currentPage = this.renderCategoryPage();
        break;
      case 'question':
        currentPage = this.renderQuestionPage();
        break;
      case 'answers':
        currentPage = this.renderAnswerChoosingPage();
        break;
      case 'results':
        currentPage = this.renderResultsPage();
        break;
      default:
        currentPage = this.renderStartPage();
    }
    return (
      <div className="App">
        {currentPage}
      </div>
    );
  }
}

export default App;
