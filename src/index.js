import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Player from './Player';
import './index.css';

var socket = require('socket.io-client')(window.location.href);

socket.on('your role', function(data) {
	ReactDOM.render(
  		data.isMaster ? <App /> : <Player />,
  		document.getElementById('root')
	);
});



