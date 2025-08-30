const express = require('express');
const User = require('../models/User');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Get user profile
router.get('/profile/:userId', async (req, res) => {
  try {
    const user = await User.findOne({ userId: req.params.userId }).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get current user profile
router.get('/me', auth, authorize('user'), async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile
router.put('/profile', auth, authorize('user'), async (req, res) => {
  try {
    const { fullName, fatherName, mobileNumber, profileImage } = req.body;
    
    const updateData = {};
    if (fullName) updateData.fullName = fullName;
    if (fatherName) updateData.fatherName = fatherName;
    if (mobileNumber) updateData.mobileNumber = mobileNumber;
    if (profileImage) updateData.profileImage = profileImage;
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');
    
    res.json(user);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Mobile number already exists' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;