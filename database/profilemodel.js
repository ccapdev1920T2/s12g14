var mongoose=require('mongoose');

var ProfileSchema = new mongoose.Schema({
  username: {
      type: String,
      required: true
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
    type: String,
    required: false
  }

})

module.exports = mongoose.model('Profile',ProfileSchema);