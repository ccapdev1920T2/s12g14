const Profile = require('../models/profile-model');

const editProfileController = {
  getEdit: function(req, res){
    if (req.session && req.session.loggedIn) {
      Profile.findById(req.session.user.id).exec(function(err, user) {
        if (err) {
          return next(err);
        } else if (!user) {
          res.redirect('/404');
        } else {
          res.render('edit-profile', {
            layout: 'with-nav',
            registered: true,
            is_admin: req.session.isAdmin,
            user: req.session.user,
            self: true,
            profile: {
              firstname: user.firstname,
              lastname: user.lastname,
              bio: user.bio,
              picture_link: user.picture_link
            },
            class: 'bg-cstm-yellow-lightest',
            title: 'Edit Profile'
          });
        }
      });
    } else {
      res.redirect('/login')
    }
  },

  postEdit: function(req, res){
    if (req.session && req.session.loggedIn) {
      var firstname = req.body.firstname;
      var lastname = req.body.lastname;
      var bio = req.body.bio;
  
      var display = req.file;
  
      var delta = {
        firstname: firstname,
        lastname: lastname,
        bio: bio
      };
      if (display) delta.picture_link = '/uploads/' + display.filename;
  
      Profile.findByIdAndUpdate(req.session.user.id, delta, { new: true }, function(err, data) {
        if (err)  return next(err);
        else {
          req.session.user.firstname = data.firstname;
          req.session.user.lastname = data.lastname;
          req.session.user.display_name = data.display_name;
          req.session.user.picture_link = data.picture_link;
          return res.redirect('/profile');
        }
      });
    } else {
      return res.redirect('/login');
    }
  }
}

module.exports = editProfileController;
