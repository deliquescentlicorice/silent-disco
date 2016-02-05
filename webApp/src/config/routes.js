import auth from '../utils/Auth'

function redirectToLogin(nextState, replace) {
  if (!auth.isAuth()) {
    replace({
      pathname: '/login',
      state: { nextPathname: nextState.location.pathname }
    })
  }
}


export default {
  component: require('../Components/App'),
  childRoutes: [
    { path: '/stream/:streamId',
      getComponent: (location, cb) => {
        require.ensure([], (require) => {
          cb(null, require('../Components/StreamLive.js'))
        })
      }
    },

    { path: '/login',
      getComponent: (location, cb) => {
        require.ensure([], (require) => {
          cb(null, require('../Components/Login.js'))
        })
      }
    },


    { onEnter: redirectToLogin,
      { path: '/broadcast/setup',
        getComponent: (location, cb) => {
          require.ensure([], (require) => {
            cb(null, require('../Components/Broadcast.js'))
          })
        }
      }
    },

    { onEnter: redirectToLogin,
      { path: '/broadcast/:streamId',
        getComponent: (location, cb) => {
          require.ensure([], (require) => {
            cb(null, require('../Components/BroadcastLive.js'))
          })
        }
      }
    },

    { onEnter: redirectToLogin,
      { path: '/user/:userId',
        getComponent: (location, cb) => {
          require.ensure([], (require) => {
            cb(null, require('../Components/BroadcastProfile.js'))
          })
        }
      }
    },

  ]
}