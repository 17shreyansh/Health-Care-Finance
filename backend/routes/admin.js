const express = require('express');
const { body, validationResult } = require('express-validator');
const Admin = require('../models/Admin');
const Employee = require('../models/Employee');
const User = require('../models/User');
const PaymentSettings = require('../models/PaymentSettings');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Dashboard analytics
router.get('/dashboard', auth, authorize('admin'), async (req, res) => {
  try {
    const totalEmployees = await Employee.countDocuments();
    const totalUsers = await User.countDocuments();
    const activeEmployees = await Employee.countDocuments({ status: { $ne: 'inactive' } });
    
    // Recent registrations (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const recentUsers = await User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });
    
    // Top performing employees
    const topEmployees = await Employee.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: 'employeeId',
          as: 'referrals'
        }
      },
      {
        $project: {
          name: 1,
          employeeId: 1,
          referralCount: { $size: '$referrals' }
        }
      },
      { $sort: { referralCount: -1 } },
      { $limit: 5 }
    ]);
    
    // Monthly registration stats
    const monthlyStats = await User.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 12 }
    ]);
    
    res.json({
      overview: {
        totalEmployees,
        totalUsers,
        activeEmployees,
        recentUsers
      },
      topEmployees,
      monthlyStats
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// System health check
router.get('/health', auth, authorize('admin'), async (req, res) => {
  try {
    const dbStatus = 'connected'; // You can add actual DB health check
    const serverUptime = process.uptime();
    const memoryUsage = process.memoryUsage();
    
    res.json({
      status: 'healthy',
      database: dbStatus,
      uptime: Math.floor(serverUptime / 3600) + ' hours',
      memory: {
        used: Math.round(memoryUsage.heapUsed / 1024 / 1024) + ' MB',
        total: Math.round(memoryUsage.heapTotal / 1024 / 1024) + ' MB'
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ message: 'Health check failed' });
  }
});

// Get all employees with pagination and search
router.get('/employees', auth, authorize('admin'), async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    const skip = (page - 1) * limit;
    
    const searchQuery = search ? {
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { employeeId: { $regex: search, $options: 'i' } }
      ]
    } : {};
    
    const employees = await Employee.find(searchQuery)
      .populate('referrals')
      .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
      .skip(skip)
      .limit(parseInt(limit));
      
    const total = await Employee.countDocuments(searchQuery);
    
    res.json({
      employees,
      pagination: {
        current: parseInt(page),
        pageSize: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create employee
router.post('/employees', auth, authorize('admin'), [
  body('name').notEmpty(),
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  body('employeeId').notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const employee = new Employee(req.body);
    await employee.save();
    res.status(201).json(employee);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: 'Employee ID or email already exists' });
    } else {
      res.status(500).json({ message: 'Server error' });
    }
  }
});

// Get all users with pagination and search
router.get('/users', auth, authorize('admin'), async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    const skip = (page - 1) * limit;
    
    const searchQuery = search ? {
      $or: [
        { fullName: { $regex: search, $options: 'i' } },
        { mobileNumber: { $regex: search, $options: 'i' } },
        { userId: { $regex: search, $options: 'i' } },
        { employeeId: { $regex: search, $options: 'i' } }
      ]
    } : {};
    
    const users = await User.find(searchQuery)
      .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
      .skip(skip)
      .limit(parseInt(limit));
      
    const total = await User.countDocuments(searchQuery);
    
    res.json({
      users,
      pagination: {
        current: parseInt(page),
        pageSize: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete employee
router.delete('/employees/:id', auth, authorize('admin'), async (req, res) => {
  try {
    await Employee.findByIdAndDelete(req.params.id);
    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete user
router.delete('/users/:id', auth, authorize('admin'), async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user payment status
router.put('/users/:id/payment', auth, authorize('admin'), async (req, res) => {
  try {
    const { paymentStatus } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { paymentStatus },
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get payment settings
router.get('/payment-settings', auth, authorize('admin'), async (req, res) => {
  try {
    let settings = await PaymentSettings.findOne({ isActive: true });
    if (!settings) {
      settings = new PaymentSettings({
        qrCodeImage: '',
        amount: 500
      });
      await settings.save();
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update payment settings
router.put('/payment-settings', auth, authorize('admin'), async (req, res) => {
  try {
    const { qrCodeImage, amount } = req.body;
    let settings = await PaymentSettings.findOne({ isActive: true });
    
    if (!settings) {
      settings = new PaymentSettings({ qrCodeImage, amount });
    } else {
      settings.qrCodeImage = qrCodeImage || settings.qrCodeImage;
      settings.amount = amount || settings.amount;
    }
    
    await settings.save();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;