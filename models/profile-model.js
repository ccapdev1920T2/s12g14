const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Recipe = require('./recipe-model');
const Like = require('./report-model');
const Comment = require('./comment-model');
const Report = require('./report-model');

const err = require('../errors');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  lastname: {
    type: String,
    required: false
  },
  firstname: {
    type: String,
    required: false
  },
  join_date: {
    type: Date,
    default: Date.now,
    required: true
  },
  email: {
    type: String,
    required: false
  },
  bio: {
    type: String,
    required: false
  },
  pass_encrypted: {
    type: String,
    required: true
  },
  picture_link: {
    type: String,
    required: false
  },
  is_admin: {
    type: Boolean,
    required: true
  },
  ban_until: {
    type: Date,
    required: false
  }
});

UserSchema.virtual('display_name').get(function() {
  if (this.firstname && this.lastname) return this.firstname + ' ' + this.lastname;
  else if (this.firstname) return this.firstname;
  else if (this.lastname) return this.lastname;
  else return this.username;
});

// trying to add a document saves the data with an already encrypted password
UserSchema.pre("save", function(next) {
  var user = this;
  bcrypt.hash(user.pass_encrypted, 10, function(err, hash) {
    if (err) return next(err);
    user.pass_encrypted = hash;
    next();
  });
});

// UserSchema.pre('remove', function(next){
//   Comment.deleteMany({author: this._id}).exec();
//   Like.deleteMany({author: this._id}).exec();
//   Report.deleteMany({reported_ID: this._id, reported_ref: 'User'}).exec();
//   Report.deleteMany({author: this._id}).exec();
//   Recipe.deleteMany({author: this._id}).exec();
//   next();
// });

UserSchema.post("find", function(docs) {
  for (var doc in docs) {
    if (!doc.picture_link) doc.picture_link = "/img/default_dp.jpg";
  }
});

const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
UserSchema.statics.authenticate = function(usernameOrEmail, password, callback) {
  var query = {};
  if (emailRegex.test(usernameOrEmail)) query.email    = { $regex: new RegExp('^' + usernameOrEmail + '$', 'i') };
  else                                  query.username = { $regex: new RegExp('^' + usernameOrEmail + '$', 'i') };
  
  User.findOne(query).exec(function(error, user) {
    console.log(error);
    if (error) {
      return callback(error);
    } else if (!user) {
      var error = err.unauthorized("Invalid username/password.");
      error.status = 401;
      return callback(error);
    }
    bcrypt.compare(password, user.pass_encrypted, function(_, result) {
      if (result) {
        if (user.ban_until) {
          var now = Date.now();
          var ban = user.ban_until.getTime();
          if (ban > now) return callback(err.forbidden("You are banned until " + new Date(ban).toString(), ban));
        }
        return callback(null, user);
      } else {
        var error = err.unauthorized("Invalid username/password.");
        error.status = 401;
        return callback(error);
      }
    });
  });
};

var User = mongoose.model('User', UserSchema);
module.exports = User;
