const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  lastName: { type: String, required: false },
  firstName: { type: String, required: false },
  joinDate: { type: Date, required: true, default: Date.now },
  email: { type: String, required: true, unique: true },
  bio: { type: String, required: false },
  passEncrypted: { type: String, required: true },
  pictureLink: { type: String, required: false },
  isAdmin: { type: Boolean, required: true },
  banUntil: { type: Date, required: false }
});

userSchema.pre("save", function(next) {
  var user = this;
  bcrypt.hash(user.passEncrypted, 10, function(err, hash) {
    if (err) return next(err);
    user.passEncrypted = hash;
    next();
  });
});

const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
userSchema.statics.authenticate = function(usernameOrEmail, password, callback) {
  var query = {};
  if (emailRegex.test(usernameOrEmail)) query.email = usernameOrEmail;
  else                                  query.username = usernameOrEmail;
  
  User.findOne(query).exec(function(err, user) {
    if (err) {
      return callback(err);
    } else if (!user) {
      var err = new Error('User not found.');
      err.status = 401;
      return callback(err);
    }
    bcrypt.compare(password, user.passEncrypted, function(err, result) {
      if (result) return callback(null, user);
      else        return callback();
    });
  });
};

var User = mongoose.model('user', userSchema);
module.exports = User;
