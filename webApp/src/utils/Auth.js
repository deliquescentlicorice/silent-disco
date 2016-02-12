import $ from '../../public/js/jquery-1.11.1.min';

module.exports = {

  isAuth() {
    return !!localStorage.getItem("me");
  },

  logout() {
    localStorage.removeItem("me");
    localStorage.removeItem("favorites");
    localStorage.removeItem("dbID");
    localStorage.removeItem("result");
  },

  checkAuth() {
    return localStorage.getItem("me");
  },

  onChange() {
  },

  setUser() {

    SC.initialize({
      client_id: SC_CLIENT_ID,
      redirect_uri: window.protocol + document.location.host + '/auth/soundcloud'
    });

    var component = this;

    // initiate auth popup
    return SC.connect()
    .then(function(err, result) {
      return SC.get('/me');
    })
    .then(function(me) {
      localStorage.setItem("me", JSON.stringify(me));
      var find = '/api/soundcloud/' + me.id;
      return $.get(find);
    })
    .then(function(dbID) {
      localStorage.setItem("dbID", JSON.stringify(dbID));
      return SC.get('/me/favorites');
    })
    .then(function(favorites) {
      localStorage.setItem("favorites", JSON.stringify(favorites));
    });
  }
}
