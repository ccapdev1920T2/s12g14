const Profile = require('../models/profile-model');

const registerController = { 
  getRegister: function(req, res){
    res.render('register', {
      title: 'Register',
      returnUrl: req.query['returnUrl'] || ''
    });
  },

  postRegister: function(req, res, next) {
    var username = req.body['username'];
    var email = req.body['email'];
    var password = req.body['password'];
    var confirm = req.body['confirm'];

    var firstName = req.body['firstname'];
    var lastName = req.body['lastname'];
    var bio = req.body['bio'];

    var display = req.file;
    
    if (username && email && password && confirm && password === confirm) {
      var userData = {
        username: username,
        email: email,
        pass_encrypted: password,
    
        firstname: firstName,
        lastname: lastName,
        bio: bio,
        picture_link: display ? ('/uploads/' + display.filename) : null,
        is_admin: false
      };

      console.log("creating user " + userData);
      // encrypted using bcrypt in the model itself
      Profile.create(userData, function(err, user) {
        if (err) {
          return next(err);
        } else if (!user) {
          return res.redirect('/register');
        } else {
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
          return res.redirect(req.body['returnUrl'] || '/profile');
        }
      });
    } else {
      console.log("not creating user");
      return redirect('/register');
    }
  },

  getCheckUsername: function(req, res){
    var username = req.query.username;
    console.log('Username tested: \n' + username);
    Profile.findOne({ username: { $regex: new RegExp("^" + username + "$", "i") } }, 'username', function(err, result) {
      console.log(result);
      res.send(result);
    });
  }
}

module.exports = registerController;
