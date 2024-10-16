const express = require('express');
const Order = require('../models/Order');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get order history
router.get('/', authenticateToken, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Place a new order
router.post('/', authenticateToken, async (req, res) => {
  try {
    if (!req.user.cart || req.user.cart.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const totalAmount = req.user.cart.reduce((sum, item) => sum + item.price, 0);
    const newOrder = new Order({
      user: req.user._id,
      items: req.user.cart,
      totalAmount,
    });

    await newOrder.save();
    req.user.orderHistory.push(newOrder._id);
    req.user.cart = [];
    await req.user.save();

    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;