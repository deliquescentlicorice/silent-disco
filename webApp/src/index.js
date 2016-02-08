import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route } from 'react-router';
import { createHistory } from 'history';
import injectTapEventPlugin from '../node_modules/react-tap-event-plugin';

import App from './App.jsx';
import StreamLive from './Components/StreamLive.js';
import Broadcast from './Components/Broadcast.js';
import BroadcastLive from './Components/BroadcastLive.js';
import BroadcastProfile from './Components/BroadcastProfile.js';
import Login from './Components/Login.js';

import auth from './utils/Auth';

// import routes from './config/routes'

//Needed for onTouchTap
//Can go away when react 1.0 release
//Check this repo:
//https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();


function redirectToLogin(nextState, replace) {
  if (!auth.isAuth()) {
    replace({ nextPathname: nextState.location.pathname }, '/login')
  }
}

var routes = (
  <Router history={createHistory()}>
    <Route path="/" component={App}/>
    <Route path="/listen/:streamId" component={StreamLive}/>
    <Route path='/broadcast/setup' onEnter={redirectToLogin} component={Broadcast}/>
    <Route path='/broadcast/:streamId' onEnter={redirectToLogin} component={BroadcastLive}/>
    <Route path='/user/:userId' onEnter={redirectToLogin}  component={BroadcastProfile}/> 
    <Route path='/login' component={Login}/> 
  </Router>
)




ReactDOM.render(routes, document.getElementById('root'));
// ReactDOM.render(<Router history={createHistory()} routes={routes}/>, document.getElementById('root'));
