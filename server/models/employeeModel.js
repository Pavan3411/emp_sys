// models/Employee.js
const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  doj: { type: Date, required: true },
  salary: { type: Number, required: true },
  experience: { type: Number, required: true },
  age: { type: Number, required: true, min: 18 },
  department: { type: String, required: true },
  location: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Employee', employeeSchema);
