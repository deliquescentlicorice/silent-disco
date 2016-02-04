import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route } from 'react-router';
import { createHistory } from 'history';
import injectTapEventPlugin from '../node_modules/react-tap-event-plugin';

import App from './App.jsx';
import StreamLive from './Components/StreamLive.js';
import Broadcast from './Components/Broadcast.js'
import BroadcastLive from './Components/BroadcastLive.js'
import BroadcastProfile from './Components/BroadcastProfile.js'

//Needed for onTouchTap
//Can go away when react 1.0 release
//Check this repo:
//https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();


var routes = (
  <Router history={createHistory()}>
    <Route path="/" component={App}/>
    <Route path="/stream/:streamId" component={StreamLive}/>
    <Route path='broadcast/setup' component={Broadcast}/>
    <Route path='broadcast/:streamId' component={BroadcastLive}/>
    <Route path='/profile/:userId' component={BroadcastProfile}/> 
  </Router>
)



ReactDOM.render(routes, document.getElementById('root'));
