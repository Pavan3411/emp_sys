const User = require('../models/userModel');

// Get all employees (Admin only)
exports.getEmployees = async (req, res) => {
  try {
    const employees = await User.find({ role: 'employee' });
    res.json(employees);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get employee by ID 
exports.getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Searching for employee with ID:', id);
    
    const employee = await User.findById(id);
    
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.json({
      _id: employee._id,
      name: employee.name,
      email: employee.email,
      role: employee.role,
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

// Get logged-in employee's own profile (Employee only)
exports.getMyProfile = async (req, res) => {
  try {
    console.log('Getting profile for user ID:', req.user.id);
    console.log('Authenticated user data:', req.user);

    if (!req.user?.id) {
      return res.status(401).json({ 
        message: 'Invalid user ID in token',
        receivedUser: req.user 
      })
    }
    
    const employee = await User.findById(req.user.id);
    
    if (!employee) {
      return res.status(404).json({ message: 'Employee profile not found' });
    }

    res.json({
      _id: employee._id,
      name: employee.name,
      email: employee.email,
      role: employee.role,
      doj: employee.doj,
      salary: employee.salary,
      experience: employee.experience,
      age: employee.age,
      department: employee.department,
      location: employee.location
    });
  } catch (err) {
    console.error('Error in getMyProfile:', err);
    res.status(500).json({ error: err.message });
  }
};

// Create employee (Admin only)
exports.createEmployee = async (req, res) => {
  try {
    const employee = new User(req.body);
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
    const updateData = req.body;
    
    // Remove sensitive fields that shouldn't be updated
    delete updateData.password;
    delete updateData.role;
    
    // Convert numeric fields
    if (updateData.age) updateData.age = parseInt(updateData.age) || 0;
    if (updateData.salary) updateData.salary = parseInt(updateData.salary) || 0;
    if (updateData.experience) updateData.experience = parseInt(updateData.experience) || 0;
    
    const employee = await User.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    
    res.json({
      _id: employee._id,
      name: employee.name,
      email: employee.email,
      role: employee.role,
      doj: employee.doj,
      salary: employee.salary,
      experience: employee.experience,
      age: employee.age,
      department: employee.department,
      location: employee.location
    });
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