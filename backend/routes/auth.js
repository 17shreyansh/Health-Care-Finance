const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const Admin = require('../models/Admin');
const Employee = require('../models/Employee');
const User = require('../models/User');
const upload = require('../middleware/upload');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Login
router.post('/login', [
  body('mobileNumber').matches(/^[0-9]{10}$/).withMessage('Please provide a valid 10-digit mobile number'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { mobileNumber, password } = req.body;
    let user = await Admin.findOne({ mobileNumber }) || await Employee.findOne({ mobileNumber }) || await User.findOne({ mobileNumber });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({
      user: {
        id: user._id,
        name: user.name || user.fullName,
        mobileNumber: user.mobileNumber,
        role: user.role,
        employeeId: user.employeeId
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Register User
router.post('/register', [
  body('fullName').notEmpty().withMessage('Full name is required'),
  body('fatherName').notEmpty().withMessage('Father name is required'),
  body('mobileNumber').isMobilePhone().withMessage('Valid mobile number is required'),
  body('employeeId').notEmpty().withMessage('Employee ID is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('profileImage').notEmpty().withMessage('Profile image is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { fullName, fatherName, mobileNumber, employeeId, password, profileImage } = req.body;

    // Verify employee exists
    const employee = await Employee.findOne({ employeeId });
    if (!employee) {
      return res.status(400).json({ message: 'Invalid employee ID' });
    }

    // Check if mobile number already exists
    const existingUser = await User.findOne({ mobileNumber });
    if (existingUser) {
      return res.status(400).json({ message: 'Mobile number already registered' });
    }

    const user = new User({
      fullName,
      fatherName,
      mobileNumber,
      employeeId,
      password,
      profileImage
    });

    await user.save();

    // Add to employee's referrals
    employee.referrals.push(user._id);
    await employee.save();

    res.status(201).json({
      message: 'Registration successful',
      user: {
        id: user._id,
        fullName: user.fullName,
        fatherName: user.fatherName,
        userId: user.userId,
        profileImage: user.profileImage,
        startDate: user.startDate,
        endDate: user.endDate
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: 'Validation error', errors });
    }
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Mobile number already exists' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Logout
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
});

// Get current user
router.get('/me', auth, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;