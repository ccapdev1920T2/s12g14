var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
  _id: Schema.Types.ObjectId,
  username: {
    type: String,
    required: true,
    unique: true
  },
  lastname: {
    type: String,
    required: true
  },
  firstname: {
    type: String,
    required: true
  },
  join_date: {
    type: Date,
    default: Date.now,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  bio: {
    type: String,
    required: true
  },
  pass_encypted: {
    type: String,
    required: true
  },
  picture_link: {
    type: String,
    required: true
  },
  is_admin: {
    type: String,
    required: true
  },
  ban_until: {
    type: Date,
    required: false
  }

})

module.exports = mongoose.model('User', UserSchema);