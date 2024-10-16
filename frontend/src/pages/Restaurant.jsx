import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { PlusCircle, MinusCircle, Edit2, Trash2 } from 'lucide-react';

const Restaurant = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', price: '' });
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/restaurants/${id}`);
        setRestaurant(response.data);
      } catch (error) {
        console.error('Error fetching restaurant:', error);
        toast.error('Failed to load restaurant details. Please try again later.');
      }
    };

    setIsAdmin(localStorage.getItem('userRole') === '1');
    fetchRestaurant();
  }, [id]);

  const addToCart = async (item) => {
    try {
      await axios.post('http://localhost:5000/api/cart/add', {
        restaurantId: id,
        itemId: item._id,
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      toast.success('Item added to cart');
    } catch (error) {
      console.error('Error adding item to cart:', error);
      toast.error('Failed to add item to cart. Please try again.');
    }
  };

  const addMenuItem = async () => {
    try {
      const response = await axios.post(`http://localhost:5000/api/restaurants/${id}/menu`, newItem, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setRestaurant({ ...restaurant, menu: [...restaurant.menu, response.data] });
      setNewItem({ name: '', price: '' });
      toast.success('Menu item added successfully');
    } catch (error) {
      console.error('Error adding menu item:', error);
      toast.error('Failed to add menu item. Please try again.');
    }
  };

  const updateMenuItem = async (itemId) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/restaurants/${id}/menu/${itemId}`, editingItem, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setRestaurant({
        ...restaurant,
        menu: restaurant.menu.map(item => item._id === itemId ? response.data : item)
      });
      setEditingItem(null);
      toast.success('Menu item updated successfully');
    } catch (error) {
      console.error('Error updating menu item:', error);
      toast.error('Failed to update menu item. Please try again.');
    }
  };

  const deleteMenuItem = async (itemId) => {
    try {
      await axios.delete(`http://localhost:5000/api/restaurants/${id}/menu/${itemId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setRestaurant({
        ...restaurant,
        menu: restaurant.menu.filter(item => item._id !== itemId)
      });
      toast.success('Menu item deleted successfully');
    } catch (error) {
      console.error('Error deleting menu item:', error);
      toast.error('Failed to delete menu item. Please try again.');
    }
  };

  if (!restaurant) {
    return <div className="container mx-auto p-4">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-orange-600">{restaurant.name}</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4 text-orange-500">Menu</h2>
        {restaurant.menu.length === 0 ? (
          <p className="text-gray-600">No items available in the menu.</p>
        ) : (
          <ul className="space-y-4">
            {restaurant.menu.map((item) => (
              <li key={item._id} className="flex justify-between items-center border-b pb-2">
                {editingItem && editingItem._id === item._id ? (
                  <>
                    <input
                      type="text"
                      value={editingItem.name}
                      onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                      className="border rounded px-2 py-1 w-1/3"
                    />
                    <input
                      type="number"
                      value={editingItem.price}
                      onChange={(e) => setEditingItem({ ...editingItem, price: e.target.value })}
                      className="border rounded px-2 py-1 w-1/4"
                    />
                    <button
                      onClick={() => updateMenuItem(item._id)}
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                    >
                      Save
                    </button>
                  </>
                ) : (
                  <>
                    <span className="text-lg">{item.name}</span>
                    <span className="text-orange-500 font-semibold">${item.price.toFixed(2)}</span>
                    {isAdmin ? (
                      <div className="space-x-2">
                        <button
                          onClick={() => setEditingItem(item)}
                          className="text-blue-500 hover:text-blue-600"
                        >
                          <Edit2 size={20} />
                        </button>
                        <button
                          onClick={() => deleteMenuItem(item._id)}
                          className="text-red-500 hover:text-red-600"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => addToCart(item)}
                        className="bg-orange-500 text-white px-3 py-1 rounded hover:bg-orange-600"
                      >
                        <PlusCircle size={20} />
                      </button>
                    )}
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
        {isAdmin && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-2 text-orange-500">Add New Item</h3>
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Item name"
                value={newItem.name}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                className="border rounded px-2 py-1 flex-grow"
              />
              <input
                type="number"
                placeholder="Price"
                value={newItem.price}
                onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                className="border rounded px-2 py-1 w-1/4"
              />
              <button
                onClick={addMenuItem}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Add Item
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Restaurant;