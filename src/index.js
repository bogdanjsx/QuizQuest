import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Player from './Player';
import './index.css';

var clientType = 'GameMasters';

ReactDOM.render(
  clientType === 'GameMaster' ? <App /> : <Player />,
  document.getElementById('root')
);
