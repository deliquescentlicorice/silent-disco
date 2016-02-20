import auth from '../utils/Auth';
import App from '../App.jsx';
import StreamLive from '../components/StreamLive.js';
import Broadcast from '../components/Broadcast.js';
import BroadcastLive from '../components/BroadcastLive.js';
import BroadcastProfile from '../components/BroadcastProfile.js';
import Login from '../components/Login.js';

function redirectToLogin(nextState, replace) {
  if (!auth.isAuth()) {
    replace({
      pathname: '/login',
      state: { nextPathname: nextState.location.pathname }
    })
  }
}


export default {
    <Route path="/" component={App}/>
    <Route path="/stream/:streamId" component={StreamLive}/>
    <Route path='broadcast/setup' onEnter={redirectToLogin}  component={Broadcast}/>
    <Route path='broadcast/:streamId' onEnter={redirectToLogin} component={BroadcastLive}/>
    <Route path='/user/:userId' onEnter={redirectToLogin}  component={BroadcastProfile}/> 
    <Route path='/login' component={Login}/> 
}