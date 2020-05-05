var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ReportSchema = new mongoose.Schema({
  _id: Schema.Types.ObjectId,
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reported_ID: {
    type: Schema.Types.ObjectId,
    required: true
  },
  reported_ref: {
    // Ref for reported ID, either Recipe/Comment
    type: String,
    enum: ['Recipe', 'Comment'],
    required: true
  },
  reason: {
    type: String,
    required: true
  },
  timestamp: {
    type : Date, 
    default: Date.now,
    required: true
  },
  process_timestamp: {
    type : Date,
    required: false
  }
})

module.exports = mongoose.model('Report', ReportSchema)
