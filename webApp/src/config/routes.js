import auth from '../utils/Auth';

function redirectToLogin(nextState, replace) {
  if (!auth.isAuth()) {
    replace({
      pathname: '/login',
      state: { nextPathname: nextState.location.pathname }
    })
  }
}


export default {
  component: require('../App.jsx'),
  
  childRoutes: [
    { path: '/',
      getComponent: (location, cb) => {
        require.ensure([], (require) => {
          cb(null, require('../App.jsx'))
        })
      }
    },
    { path: '/stream/:streamId',
      getComponent: (location, cb) => {
        require.ensure([], (require) => {
          cb(null, require('../Components/StreamLive'))
        })
      }
    },

    { path: '/login',
      getComponent: (location, cb) => {
        require.ensure([], (require) => {
          cb(null, require('../Components/Login'))
        })
      }
    },


    { onEnter: redirectToLogin,
      childRoutes: [
        { path: '/broadcast/setup',
          getComponent: (location, cb) => {
            require.ensure([], (require) => {
              cb(null, require('../Components/Broadcast'))
            })
          }
        }
      ]
    },

    { onEnter: redirectToLogin,
      childRoutes: [
        { path: '/broadcast/:streamId',
          getComponent: (location, cb) => {
            require.ensure([], (require) => {
              cb(null, require('../Components/BroadcastLive'))
            })
          }
        }
      ]
    },

    { onEnter: redirectToLogin,
      childRoutes: [
        { path: '/user/:userId',
          getComponent: (location, cb) => {
            require.ensure([], (require) => {
              cb(null, require('../Components/BroadcastProfile'))
            })
          }
        }
      ]
    },

  ]
}