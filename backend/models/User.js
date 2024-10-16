const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: Number,
    default: 0, // 0 for customer, 1 for admin
  },
  cart: [{
    restaurantId: String,
    itemId: String,
    name: String,
    price: Number,
  }],
  orderHistory: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
  }],
});

module.exports = mongoose.model('User', userSchema);