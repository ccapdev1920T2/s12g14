const mongoose = require('mongoose');

const Profile = require('./models/profile-model');

module.exports.initializeDefault = function() {
  var admin = {
    username: "admin",
    email: "admin@example.com",
    pass_encrypted: "password",
    is_admin: true
  };

  Profile.create(admin);
};

module.exports.initializeDummy = function() {
  
};
