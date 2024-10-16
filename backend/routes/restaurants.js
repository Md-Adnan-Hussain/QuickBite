const express = require('express');
const Restaurant = require('../models/Restaurant');
const { authenticateToken, isAdmin } = require('../middleware/auth');

const router = express.Router();

// Get all restaurants
router.get('/', async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a specific restaurant
router.get('/:id', async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add a new restaurant (admin only)
router.post('/', authenticateToken, isAdmin, async (req, res) => {try {
    const { name } = req.body;
    const newRestaurant = new Restaurant({ name });
    await newRestaurant.save();
    res.status(201).json(newRestaurant);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add a menu item to a restaurant (admin only)
router.post('/:id/menu', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { name, price } = req.body;
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    restaurant.menu.push({ name, price });
    await restaurant.save();
    res.status(201).json(restaurant.menu[restaurant.menu.length - 1]);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a menu item (admin only)
router.put('/:id/menu/:itemId', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { name, price } = req.body;
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    const menuItem = restaurant.menu.id(req.params.itemId);
    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    menuItem.name = name;
    menuItem.price = price;
    await restaurant.save();
    res.json(menuItem);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a menu item (admin only)
router.delete('/:id/menu/:itemId', authenticateToken, isAdmin, async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    restaurant.menu.id(req.params.itemId).remove();
    await restaurant.save();
    res.json({ message: 'Menu item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;