const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Employee = require('../models/Employee');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      console.log('No token found in cookies or headers');
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    let user;

    if (decoded.role === 'admin') {
      user = await Admin.findById(decoded.id).select('-password');
    } else if (decoded.role === 'employee') {
      user = await Employee.findById(decoded.id).select('-password');
    } else {
      user = await User.findById(decoded.id);
    }

    if (!user) {
      console.log(`User not found for token with ID: ${decoded.id}, role: ${decoded.role}`);
      return res.status(401).json({ message: 'Invalid token - user not found.' });
    }

    // Add role to user object if not present
    if (!user.role) {
      user.role = decoded.role;
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error.message);
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired.' });
    }
    res.status(401).json({ message: 'Invalid token.' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied.' });
    }
    next();
  };
};

module.exports = { auth, authorize };