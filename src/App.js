import React, { Component } from 'react';
import logo from '../assets/mipmap-xhdpi/ic_launcher.png';

import PlayerCounter from './PlayerCounter.js';
import Bubble from './CategoryBubble.js';
import Timer from './Timer.js'

import './App.css';
import './CategoryBubble.css';

var categories = ['a', 'bbbb', 'cartofi prajiti'],
    question = 'How many cats does it take to screw in a lightbulb?',
    states = ['start', 'category', 'question', 'answers', 'results'],
    answers = ['none', 'three black ones', 'all of them', 'cats???'];

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {page: 'start',
                  connectedPlayers: 0,
                  readyPlayers: 0,
                  timer: 60};

    this.socket = require('socket.io-client')(window.location.href);

    this.socket.on('welcome', function (data) {
      this.setState({page: 'connect'});
      this.socket.emit('i am client', {id: data.id});
    }.bind(this));

    this.socket.on('player numbers update', function (data) {
      this.setState({connectedPlayers: data.connectedPlayers,
                     readyPlayers: data.readyPlayers});
    }.bind(this));

    this.socket.on('timer update', function (data) {
      this.setState({timer: data.timer});
    }.bind(this));


    this.socket.on('uite-ti indexul', function(data) {
      this.setState({index : data.index});
    }.bind(this));

    this.socket.on('alege domeniu', function(data) {
      this.setState({categories: data.message, page:'category'})
    }.bind(this));

    this.socket.on('raspunde la intrebare', function(data) {
      this.setState({page : 'question', question: data.message});
    }.bind(this));

    this.socket.on('voteaza', function(data) {
      this.setState({page : 'answers', answers: data.answers})
    }.bind(this));

    this.socket.on('score', function(data) {
      this.setState({page: 'results', results: data.score})
    }.bind(this));

    this.socket.on('message', function(data) {
      console.log(data);
      this.setState({page : 'message', message : data.message})
      console.log(this.state);
    }.bind(this));
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
        <PlayerCounter number={this.state.connectedPlayers} text="connected" />
        <PlayerCounter number={this.state.readyPlayers} text="ready" />
      </div>
    );
  }

  renderCategoryPage() {
    return (
      <div className="CategoryPage">
        <div className="App-header">
          <Timer value={this.state.timer} />
          <h2>player-name-here, please choose a category!</h2>
        </div>
        <div className="CategoryList">
          {this.state.categories.map((cat) => <Bubble className="categoryBubble" text={cat.toUpperCase()} key={cat}/>)}
        </div>
      </div>
    );
  }

  renderQuestionPage() {
    return (
      <div className="Question">
        <div className="App-header">
          <Timer value={this.state.timer} />
            <h2>Here's the question, input your answer on your device!</h2>
        </div>
        <div className="App-intro">
          {this.state.question}
        </div>

      </div>
    );
  }

  renderAnswerChoosingPage() {
    return (
      <div className="Question">
        <div className="App-header">
          <Timer value={this.state.timer} />
            <h2>Here are your answers, choose the one you think is best!</h2>
        </div>
        <div className="AnswerList">
          {this.state.answers.map((ans) =>
            <Bubble className="categoryBubble" text={ans.toUpperCase()} key={ans}/>)}
        </div>
      </div>
    );
  }

  renderResultsPage() {
    return (
      <div className="Question">
        <div className="App-header">
          <Timer value={this.state.timer} />
            <h2>The results are in! Here's how you did:</h2>
        </div>
        <div className="Results">
          {this.state.results.map((result) =>
            <Bubble className="categoryBubble"
                    text={result.player_name + '\n' + result.player_score}
                    key={result.player_name}/>)}
        </div>
      </div>
    );
  }

  componentWillMount() {
    // setInterval(() => {this.setState({page: states[Math.floor(Math.random() * 5)]})}, 1000);
  }

  render() {
    var currentPage;
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
