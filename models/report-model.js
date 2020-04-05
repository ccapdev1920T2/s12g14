var mongoose = require('mongoose');

var ReportSchema = new mongoose.Schema({
  _id: Schema.Types.ObjectId,
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reported_ID: {
    type: String,
    required: true
  },
  type: {
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