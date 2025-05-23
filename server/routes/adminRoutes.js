const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const allowedRoles = require('../middlewares/allowedRoles');
const { getAdmins } = require('../controllers/adminController');
const {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
//   getEmployeeByEmail
} = require('../controllers/employeeController');

router.get('/dashboard', authMiddleware, allowedRoles('admin'), getAdmins);

// Admin Employee Management Routes
router.get('/employees', authMiddleware, allowedRoles('admin'), getEmployees);
router.get('/employees/:id', authMiddleware, allowedRoles('admin'), getEmployeeById);
router.post('/employees', authMiddleware, allowedRoles('admin'), createEmployee);
router.put('/employees/:id', authMiddleware, allowedRoles('admin'), updateEmployee);
router.delete('/employees/:id', authMiddleware, allowedRoles('admin'), deleteEmployee);
// router.get('/employees/email/:email', authMiddleware, allowedRoles('admin'), getEmployeeByEmail);

module.exports = router;
