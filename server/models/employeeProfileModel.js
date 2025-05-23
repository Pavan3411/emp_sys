const mongoose = require('mongoose');

const employeeProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
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
    default: 0
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

module.exports = mongoose.model('EmployeeProfile', employeeProfileSchema); 