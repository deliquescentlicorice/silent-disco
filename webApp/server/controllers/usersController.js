var User = require('../models/usersModel');

module.exports = {
    createUser: function(req, res, next) {
        var userName = req.params.name;

        var newUser = new User({name: userName});
        newUser.save(function(err) {
            if (err) {
                throw err;
            }
            else {
                res.status(200).send('user saved to db');
            }
        })
    }
};