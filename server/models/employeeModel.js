const mongoose = require('mongoose')

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, required: true },
  doj: { type: Date, required: true },
  salary: { type: String, required: true },
  experience: { type: String, required: true },
  age: { type: Number, required: true, min: 18 },
  department: { type: String, required: true },
  location: { type: String },
});


module.exports = mongoose.model('Employee', employeeSchema)
