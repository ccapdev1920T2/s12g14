const mongoose = require('mongoose');

const User = require('./models/user');

module.exports.initializeDefault = function() {
  var admin = {
    username: "admin",
    email: "admin@example.com",
    passEncrypted: "password",
    isAdmin: true
  };

  User.create(admin);
};

module.exports.initializeDummy = function() {
  
};
