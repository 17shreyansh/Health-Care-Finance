const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const Admin = require('../models/Admin');
const Employee = require('../models/Employee');
const User = require('../models/User');
const PaymentSettings = require('../models/PaymentSettings');
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

// Register (Role-based)
router.post('/register', [
  body('role').isIn(['admin', 'employee', 'user']).withMessage('Valid role is required'),
  body('mobileNumber').isMobilePhone().withMessage('Valid mobile number is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { role, mobileNumber, password } = req.body;

    // Check if mobile number already exists across all models
    const existingUser = await Admin.findOne({ mobileNumber }) || 
                        await Employee.findOne({ mobileNumber }) || 
                        await User.findOne({ mobileNumber });
    if (existingUser) {
      return res.status(400).json({ message: 'Mobile number already registered' });
    }

    let newUser;
    let responseData = {};

    if (role === 'admin') {
      const { name } = req.body;
      if (!name) {
        return res.status(400).json({ message: 'Name is required for admin registration' });
      }
      
      newUser = new Admin({ name, mobileNumber, password });
      await newUser.save();
      responseData = { id: newUser._id, name: newUser.name, role: newUser.role };
      
    } else if (role === 'employee') {
      const { name } = req.body;
      if (!name) {
        return res.status(400).json({ message: 'Name is required for employee registration' });
      }
      
      // Auto-generate employee ID
      const employeeCount = await Employee.countDocuments();
      const employeeId = `EMP${String(employeeCount + 1).padStart(3, '0')}`;
      
      newUser = new Employee({ name, mobileNumber, password, employeeId });
      await newUser.save();
      responseData = { id: newUser._id, name: newUser.name, employeeId: newUser.employeeId, role: newUser.role };
      
    } else if (role === 'user') {
      const { fullName, fatherName, employeeId, profileImage } = req.body;
      if (!fullName || !fatherName || !employeeId || !profileImage) {
        return res.status(400).json({ message: 'Full name, father name, employee ID, and profile image are required for user registration' });
      }
      
      // Verify employee exists
      const employee = await Employee.findOne({ employeeId });
      if (!employee) {
        return res.status(400).json({ message: 'Invalid employee ID' });
      }
      
      newUser = new User({ fullName, fatherName, mobileNumber, employeeId, password, profileImage });
      await newUser.save();
      
      // Add to employee's referrals
      employee.referrals.push(newUser._id);
      await employee.save();
      
      responseData = {
        id: newUser._id,
        fullName: newUser.fullName,
        fatherName: newUser.fatherName,
        userId: newUser.userId,
        profileImage: newUser.profileImage,
        startDate: newUser.startDate,
        endDate: newUser.endDate,
        role: newUser.role
      };
    }

    res.status(201).json({
      message: 'Registration successful',
      user: responseData
    });
  } catch (error) {
    console.error('Registration error:', error);
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: 'Validation error', errors });
    }
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Mobile number or Employee ID already exists' });
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

// Referral link validation
router.get('/referral/:employeeId', async (req, res) => {
  try {
    const { employeeId } = req.params;
    const employee = await Employee.findOne({ employeeId }).select('name employeeId');
    
    if (!employee) {
      return res.status(404).json({ message: 'Invalid referral link' });
    }
    
    res.json({ 
      valid: true, 
      employee: { name: employee.name, employeeId: employee.employeeId } 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get payment settings for QR code
router.get('/payment-settings', async (req, res) => {
  try {
    const settings = await PaymentSettings.findOne({ isActive: true });
    if (!settings) {
      return res.status(404).json({ message: 'Payment settings not configured' });
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;