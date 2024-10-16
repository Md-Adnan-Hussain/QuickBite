const express = require('express');
const Restaurant = require('../models/Restaurant');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get cart items
router.get('/', authenticateToken, (req, res) => {
  res.json(req.user.cart || []);
});

// Add item to cart
router.post('/add', authenticateToken, async (req, res) => {
  try {
    const { restaurantId, itemId } = req.body;
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    const menuItem = restaurant.menu.id(itemId);
    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    if (!req.user.cart) {
      req.user.cart = [];
    }
    req.user.cart.push({
      restaurantId,
      itemId,
      name: menuItem.name,
      price: menuItem.price,
    });
    await req.user.save();
    res.status(201).json(req.user.cart);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove item from cart
router.delete('/:itemId', authenticateToken, async (req, res) => {
  try {
    req.user.cart = req.user.cart.filter(item => item._id.toString() !== req.params.itemId);
    await req.user.save();
    res.json(req.user.cart);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;