import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { PlusCircle } from 'lucide-react';

const AddRestaurant = () => {
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/restaurants', { name }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      toast.success('Restaurant added successfully');
      navigate('/');
    } catch (error) {
      console.error('Error adding restaurant:', error);
      toast.error('Failed to add restaurant. Please try again.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold mb-6 text-orange-600 flex items-center justify-center">
          <PlusCircle className="mr-2" /> Add Restaurant
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Restaurant Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring focus:ring-orange-500 focus:ring-opacity-50"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50"
          >
            Add Restaurant
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddRestaurant;