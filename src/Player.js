import React, { Component } from 'react';
import './Player.css';
//import SocketIO from "socket.io-client";
var states = ['connect', 'category', 'answer', 'vote', 'blank'];
var answers = ['ans1', 'ans2'];

class Player extends Component {
  constructor(props) {
    super(props);
    this.state = {page: 'vote',
                  categories: states,
                  answers: answers};

    this.socket = require('socket.io-client')(window.location.href);

    this.socket.on('welcome', function (data) {
      this.setState({page: 'connect'});
    }.bind(this));

    this.socket.on('uite-ti indexul', function(data) {
      this.setState({index : data.index});
    }.bind(this));

    this.socket.on('alege domeniu', function(data) {
      this.setState({categories: data.message, page:'category'})
    }.bind(this));

    this.socket.on('raspunde la intrebare', function(data) {
      this.setState({page : 'answer'})
    }.bind(this));

    this.socket.on('voteaza', function(data) {
      this.setState({page : 'vote'})
    }.bind(this));

    this.socket.on('message', function(data) {
      console.log(data);
      this.setState({page : 'connect', message : data.message})
      console.log(this.state);
    }.bind(this));
  }

  /*sending to server*/
  sendPlayerNameToServer(id, name) {
    this.socket.emit('start', {id: id, name: name});
    console.log(name);
  }

  sendCategoryChosenByPlayer(category) {
    this.socket.emit('am ales domeniul', {domain: category});
    console.log(category);
  }

  sendAnswerGivenByPlayer(answer) {
    this.socket.emit('raspuns dat', {raspuns: answer});
    console.log('ans ' + answer);
  }

  sendAnswerVotedByPlayer(answer) {
    console.log('voted ' + answer);
    this.socket.emit('votare gata', {raspuns: answer});
  }

  renderConnect() {
    return (
      <div className="ConnectPage">
        <p>Please input your name:</p>
        <div className="ConnectCell">
          <input id="nameInput"></input>
        </div>
        <div className="ConnectCell">
          <button onClick={()=>{this.sendPlayerNameToServer(this.state.index,
            document.getElementById('nameInput').value)}}>
            Submit
          </button>
        </div>
      </div>
    );
  }

  renderCategory() {
    return (
      <div className="CategoryPage">
        <p>Please choose a category:</p>
        {this.state.categories.map((cat) =>
          <div className="ConnectCell" key={cat}>
            <button onClick={()=>{this.sendCategoryChosenByPlayer(cat)}}>
              {cat.toUpperCase()}
            </button>
          </div>
          )
        }
      </div>
    );
  }

  renderAnswer() {
    return (
      <div className="AnswerPage">
        <p>Please input an answer:</p>
        <div className="ConnectCell">
          <input id="answerInput"></input>
        </div>
        <div className="ConnectCell">
          <button onClick={() => {
            this.sendAnswerGivenByPlayer(document.getElementById('answerInput').value)
            }}>
            Submit
          </button>
        </div>
      </div>
    );
  }

  renderVote() {
    return (
      <div className="VotePage">
        <p>Please vote for an answer:</p>
        {this.state.answers.map((ans) =>
          <div className="ConnectCell" key={ans}>
            <button onClick={()=>{this.sendAnswerVotedByPlayer(ans)}}>
              {ans.toUpperCase()}
            </button>
          </div>
          )
        }
      </div>
    );

  }

  renderBlank() {
    return (
      <div className="AnswerPage">
        Please wait and follow the game master's instructions.
      </div>
    );
  }


  render() {
    console.log(this.state.page);
    var currentPage;

    switch(this.state.page) {
      case 'connect':
        currentPage = this.renderConnect();
        break;
      case 'category':
        currentPage = this.renderCategory();
        break;
      case 'answer':
        currentPage = this.renderAnswer();
        break;
      case 'vote':
        currentPage = this.renderVote();
        break;
      default:
        currentPage = this.renderBlank();
    }

    return (
      <div className="Player">
        {currentPage}
      </div>
    );
  }
}

export default Player;
