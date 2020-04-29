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
    // Ref for reported ID, either User/Comment
    type: String,
    enum: ['User', 'Comment'],
    required: true
  },
  category: {
    type: String,
    enum: ['sexual','gore','others'],
    required: true
  },
  reason: {
    type: String,
    required: true
  },
  process_timestamp: {
    type : Date, 
    required: true
  }
  
  
})

module.exports = mongoose.model('Report', ReportSchema)