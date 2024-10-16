import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ShoppingCart, Trash2 } from 'lucide-react';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/cart', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setCartItems(response.data);
    } catch (error) {
      console.error('Error fetching cart items:', error);
      toast.error('Failed to load cart items. Please try again later.');
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      await axios.delete(`http://localhost:5000/api/cart/${itemId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setCartItems(cartItems.filter(item => item._id !== itemId));
      toast.success('Item removed from cart');
    } catch (error) {
      console.error('Error removing item from cart:', error);
      toast.error('Failed to remove item from cart. Please try again.');
    }
  };

  const placeOrder = async () => {
    try {
      await axios.post('http://localhost:5000/api/orders', {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setCartItems([]);
      toast.success('Order placed successfully!');
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('Failed to place order. Please try again.');
    }
  };

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-orange-600 flex items-center">
        <ShoppingCart className="mr-2" /> Your Cart
      </h1>
      {cartItems.length === 0 ? (
        <p className="text-gray-600">Your cart is empty.</p>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6">
          <ul className="space-y-4">
            {cartItems.map((item) => (
              <li key={item._id} className="flex justify-between items-center border-b pb-2">
                <span className="text-lg">{item.name}</span>
                <div className="flex items-center">
                  <span className="text-orange-500 font-semibold mr-4">${item.price.toFixed(2)}</span>
                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex justify-between items-center">
            <span className="text-xl font-semibold">Total: ${totalPrice.toFixed(2)}</span>
            <button
              onClick={placeOrder}
              className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition duration-300"
            >
              Place Order
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;