import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route } from 'react-router';
import { createHistory } from 'history';
import injectTapEventPlugin from '../node_modules/react-tap-event-plugin';

import App from './App.jsx';
import SongPlayer from './Components/SongPlayer.js';
import Broadcast from './Components/Broadcast.js'
import BroadcastLive from './Components/BroadcastLive.js'

//Needed for onTouchTap
//Can go away when react 1.0 release
//Check this repo:
//https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();


var routes = (
  <Router history={createHistory()}>
    <Route path="/" component={App}/>
    <Route path="/song/:songId" component={SongPlayer}/>
    <Route path='broadcast/setup' component={Broadcast}/>
    <Route path='broadcast/live' component={BroadcastLive}/>
    
  </Router>
)



ReactDOM.render(routes, document.getElementById('root'));
