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
  scUser = scUser.profile._json;
  //the easiest edit is to add a null callback to createUser
  controller.createUser(scUser, function(doc) {
  });
  return callback(null, scUser);
};

exports.login = function (scUser, callback){
  return callback(null, profileObj);
};
