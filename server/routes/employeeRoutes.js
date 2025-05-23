const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const allowedRoles = require('../middlewares/allowedRoles');
const { getEmployeeById, updateEmployee } = require('../controllers/employeeController');

// Employee can only view their own profile
router.get('/:id', authMiddleware, allowedRoles('employee'), getEmployeeById);

// Employee can update their own profile
router.put('/:id', authMiddleware, allowedRoles('employee'), updateEmployee);

module.exports = router;