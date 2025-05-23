const User = require('../models/userModel');
const Employee = require('../models/employeeModel');

// Get all employees (Admin only)
exports.getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find();
    res.status(200).json(employees);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get employee by ID 
exports.getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Searching for user with ID:', id);

    // Step 1: Find the User by ID
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Step 2: Find the Employee by matching email
    const employee = await Employee.findOne({ email: user.email });
    if (!employee) {
      return res.status(404).json({ message: 'Employee record not found for this user' });
    }

    // Step 3: Return combined response
    res.json({
      _id: employee._id,
      name: user.name,
      email: user.email,
      role: user.role,
      doj: employee.doj,
      salary: employee.salary,
      experience: employee.experience,
      age: employee.age,
      department: employee.department,
      location: employee.location
    });
  } catch (err) {
    console.error('Error in getEmployeeById:', err);
    res.status(500).json({ error: err.message });
  }
};

// Create employee (Admin only)
exports.createEmployee = async (req, res) => {
  try {
    const employee = new Employee(req.body);
    await employee.save();
    res.status(201).json({ message: 'Employee created successfully', employee });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update employee profile
exports.updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await Employee.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    
    res.status(200).json({ message: 'Employee updated successfully', employee });
  } catch (err) {
    console.error('Error in updateEmployee:', err);
    res.status(500).json({ error: err.message });
  }
};

// Delete employee (Admin only)
exports.deleteEmployee = async (req, res) => {
  try {
    const employee = await User.findByIdAndDelete(req.params.id);
    
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    
    res.json({ message: 'Employee deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
