const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Recipe = require('./recipe-model');
const Like = require('./report-model');
const Comment = require('./comment-model');
const Report = require('./report-model');

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
  if (emailRegex.test(usernameOrEmail)) query.email = usernameOrEmail;
  else                                  query.username = usernameOrEmail;
  
  User.findOne(query).exec(function(err, user) {
    if (err) {
      return callback(err);
    } else if (!user) {
      var err = new Error('Username/password invalid.');
      err.status = 401;
      return callback(err);
    }
    bcrypt.compare(password, user.pass_encrypted, function(err, result) {
      if (result) return callback(null, user);
      else {
        var err = new Error('Username/password invalid.');
        err.status = 401;
        return callback(err);
      }
    });
  });
};

var User = mongoose.model('User', UserSchema);
module.exports = User;
