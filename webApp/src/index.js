import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route } from 'react-router';
import { createHistory } from 'history';

import App from './App.jsx';
import SongPlayer from './Components/SongPlayer.js';


var routes = (
  <Router history={createHistory()}>
    <Route path="/" component={App}/>
    <Route path="/song/:songId" component={SongPlayer}/>
    
  </Router>
)



ReactDOM.render(routes, document.getElementById('root'));
