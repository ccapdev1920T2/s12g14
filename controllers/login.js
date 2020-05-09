const Profile = require('../models/profile-model');

const loginController = {
  getLogin: function(req, res){
    res.render('login', {
      title: 'Login',
      returnUrl: req.query['returnUrl'] || ''
    });
  },

  postLogin: function(req, res, next){
    var username = req.body['username'];
    var password = req.body['password'];
    if (username && password) {
      Profile.authenticate(username, password, function(err, user) {
        if (err) {
          res.render('login', {loginError: err.message});
        }
        else {
          req.session.loggedIn = true;
          req.session.isAdmin = user.is_admin;
          req.session.user = {
            id: user._id,
            username: user.username,
            lastname: user.lastname,
            firstname: user.firstname,
            display_name: user.display_name,
            picture_link: user.picture_link
          };
          return res.redirect(req.body['returnUrl'] || '/');
        }
      });
    } else {
      res.render('login', {
        loginError: 'Please provide a username and/or password.'
      });
    }
  }
}

module.exports = loginController;
