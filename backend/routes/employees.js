const express = require('express');
const Employee = require('../models/Employee');
const User = require('../models/User');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Get employee dashboard data
router.get('/dashboard', auth, authorize('employee'), async (req, res) => {
  try {
    const employee = await Employee.findById(req.user._id).populate('referrals');
    res.json({
      employee: {
        name: employee.name,
        employeeId: employee.employeeId,
        totalReferrals: employee.referrals.length
      },
      referrals: employee.referrals
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get referrals
router.get('/referrals', auth, authorize('employee'), async (req, res) => {
  try {
    const employee = await Employee.findById(req.user._id).populate('referrals');
    res.json(employee.referrals);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;