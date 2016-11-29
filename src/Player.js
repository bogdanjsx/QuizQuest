import React, { Component } from 'react';
//import SocketIO from "socket.io-client";
var states = ['connect', 'category', 'answer', 'vote', 'blank'];

class Player extends Component {
  constructor(props) {
    super(props);
    this.state = {page: ''};
    
    this.socket = require('socket.io-client')(window.location.href);

    this.socket.on('welcome', function (data) {
      this.setState({page: 'connect'});
    }.bind(this));

    this.socket.on('uite-ti indexul', function(data) {
      this.setState({index : data.index});
    }.bind(this));

    this.socket.on('alege domeniu', function(data) {
      this.setState({domenii: data.message, page:'category'})
    }.bind(this));

    this.socket.on('raspunde la intrebare', function(data) {
      this.setState({page : 'answer'})
    }.bind(this));

    this.socket.on('voteaza', function(data) {
      this.setState({page : 'vote'})
    }.bind(this));

    this.socket.on('message', function(data) {
      console.log(data);
      this.setState({page : 'message', message : data.message})
      console.log(this.state);
    }.bind(this));
  }

  /*sending to server*/
  sendPlayerNameToServer(id, name) {
    socket.emit('start', {id: id, name: name});
  }

  sendDomaniChosenByPlayer(domain) {
    socket.emit('am ales domeniul', {domain: btn.innerHTML});
  }

  sendAnswerGivenByPlayer(answer) {
    socket.emit('raspuns dat', {raspuns: answer});
  }

  sendAnswerVotedByPlayer(answerVoted) {
    socket.emit('votare gata', {raspuns: answerVoted});
  }

  

  renderConnect() {

  }

  renderCategory() {

  }

  renderQuestion() {

  }

  renderVote() {

  }

  renderBlank() {

  }

  renderDebug() {
    return (
      <div>
        {this.state.message}
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
        currentPage = this.renderQuestion();
        break;
      case 'vote':
        currentPage = this.renderVote();
        break;
      case 'message':
        currentPage = this.renderDebug();
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
