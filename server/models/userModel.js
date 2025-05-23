const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'employee'],
    default: 'employee'
  },
  doj: {
    type: Date,
    default: Date.now
  },
  salary: {
    type: Number,
    default: 0
  },
  experience: {
    type: Number,
    default: 0
  },
  age: {
    type: Number,
    default: 0,
    set: v => parseInt(v) || 0
  },
  department: {
    type: String,
    default: 'Not Assigned'
  },
  location: {
    type: String,
    default: 'Not Assigned'
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
