import React, { Component } from 'react';
import './Player.css';
//import SocketIO from "socket.io-client";
var states = ['connect', 'category', 'answer', 'vote', 'blank'];

class Player extends Component {
  constructor(props) {
    super(props);
    document.getElementById('music_audio').volume = 0;
    this.state = {page: 'connect',
                  categories: states,
                  answers: [],
                  time: 60};

    this.socket = require('socket.io-client')(window.location.href);

    this.socket.on('welcome', function (data) {
      this.setState({page: 'connect', id: data.id});
      this.socket.emit('i am client', {id: data.id});
    }.bind(this));

    this.socket.on('alege domeniu', function(data) {
      this.setState({time: data.time, categories: data.message, page:'category'})
    }.bind(this));

    this.socket.on('raspunde la intrebare', function(data) {
      this.setState({time: data.time, page : 'answer', question: data.message})
    }.bind(this));

    this.socket.on('voteaza', function(data) {
      this.setState({time: data.time, page : 'vote', answers: data.answers})
    }.bind(this));

    this.socket.on('message', function(data) {
      this.setState({page : 'connect', message : data.message})
    }.bind(this));

    this.socket.on('update clock', function(data) {
      this.setState({time : data.time})
    }.bind(this));
  }

  isBlank(str) {
    return (!str || /^\s*$/.test(str) || str.length === 0);
  }

  /*sending to server*/
  sendPlayerNameToServer(id, name) {
    console.log("Name " + name + " isBlank=" + this.isBlank(name));
    if (this.isBlank(name)) {
      document.getElementById('nameInput').value = "";
      document.getElementById('nameInput').placeholder = "Invalid Name";
    } else {
      this.socket.emit('start', {id: id, name: name});
      this.setState({page:'blank'});
    }
  }

  sendCategoryChosenByPlayer(category) {
    this.socket.emit('am ales domeniul', {category: category});
    this.setState({page:'blank'});
  }

  sendAnswerGivenByPlayer(answer) {
    this.socket.emit('raspuns dat', {raspuns: answer});
    this.setState({page:'blank'});
  }

  sendAnswerVotedByPlayer(answer) {
    this.socket.emit('votare gata', {raspuns: answer});
    this.setState({page:'blank'});
  }

  getRandomElem(list) {
    var idx = Math.floor(Math.random() * list.length);
    return list[idx];
  }

  renderConnect() {
    return (
      <div className="ConnectPage">
        <p>Please input your name:</p>
        <div className="ConnectCell">
          <textarea id="nameInput"></textarea>
        </div>
        <div className="ConnectCell">
          <button onClick={()=>{
            this.sendPlayerNameToServer(this.state.id, document.getElementById('nameInput').value)}}>
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
        <p>{this.state.question}</p>
        <p>Please input an answer:</p>
        <div className="ConnectCell">
          <textarea id="answerInput"></textarea>
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
    //console.log(this.state);
    var currentPage;

    switch(this.state.page) {
      case 'connect':
        currentPage = this.renderConnect();
        break;
      case 'category':
        currentPage = this.renderCategory();
        if (this.state.time === 0) {
          this.sendCategoryChosenByPlayer(this.getRandomElem(this.state.categories));
          this.setState({time:30});
        }
        break;
      case 'answer':
        currentPage = this.renderAnswer();
        if (this.state.time === 0) {
          this.sendAnswerGivenByPlayer(null);
          this.setState({time:30});
        }
        break;
      case 'vote':
        currentPage = this.renderVote();
        if (this.state.time === 0) {
          this.sendAnswerVotedByPlayer(this.getRandomElem(this.state.answers));
          this.setState({time:30});
        }
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
