module.exports = {

  isAuth () {
    return !!localStorage.getItem("me")
  },

  logout () {
    localStorage.removeItem("me")
    localStorage.removeItem("favorites")
  },

  checkAuth() {
    return localStorage.getItem("me")
  },

  setUser() {
    SC.initialize({
      client_id: '67e4bbe5a2b1b64416b0ed84366b34ca',
      redirect_uri: 'http://localhost:3000/auth/soundcloud'
    });

    var component = this;

    // initiate auth popup
    SC.connect()
    .then(function(err, result) {
      return SC.get('/me');
    })
    .then(function(me) {
      localStorage.setItem("me", JSON.stringify(me));
      component.setState({
        isLoggedIn: true
      });
      return SC.get('/me/favorites');
    })
    .then(function(favorites) {
      localStorage.setItem("favorites", JSON.stringify(favorites));
      this.setState({
        favorites: favorites
      });
    });
  }
}