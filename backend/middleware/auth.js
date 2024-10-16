const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(403).json({ message: 'Invalid token' });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user.role !== 1) {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

module.exports = { authenticateToken, isAdmin };