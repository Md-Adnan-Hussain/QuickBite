import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const Home = () => {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/restaurants"
        );
        setRestaurants(response.data);
      } catch (error) {
        console.error("Error fetching restaurants:", error);
        toast.error("Failed to load restaurants. Please try again later.");
      }
    };

    fetchRestaurants();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-orange-600">Restaurants</h1>
      {restaurants.length === 0 ? (
        <p className="text-gray-600">No restaurants available at the moment.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map((restaurant) => (
            <Link
              key={restaurant._id}
              to={`/restaurant/${restaurant._id}`}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="p-4">
                <h2 className="text-xl font-semibold text-orange-600 mb-2">
                  {restaurant.name}
                </h2>
                <p className="text-gray-600">
                  {restaurant.menu.length} items on the menu
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
