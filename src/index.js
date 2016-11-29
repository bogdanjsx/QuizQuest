import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Player from './Player';
import './index.css';

var clientType = 'GameMaster';

ReactDOM.render(
  clientType === 'GameMaster' ? <App /> : <Player />,
  document.getElementById('root')
);
