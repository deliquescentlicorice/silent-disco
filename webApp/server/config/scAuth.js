var controller = require('../controllers/usersController.js');

exports.ensureAuth = function (req, res, next){
  // isAuthenticated is provided function that checks if the user is logged in to soundcloud
  if (req.isAuthenticated()) { return next(); }
  // if logged in continue loading page
  res.send();
  // otherwise redirect to signin
  // redirect wasn't working here so we instead send nothing to the client
  // the client side checks if the res is empty and if it is redirects to signin
};

exports.signup = function (scUser, callback){
  var user = {};
  // fill this object with properties from soundcloud object 'scUser'
  console.log(scUser);
  // saves user object to the database
  // controller.newUser(user);
  return callback(null, user);
};

exports.login = function (scUser, callback){
  return callback(null, profileObj);
};
