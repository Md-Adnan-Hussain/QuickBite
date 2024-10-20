import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { ClipboardList } from "lucide-react";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrderHistory();
  }, []);

  const fetchOrderHistory = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/orders", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching order history:", error);
      toast.error("Failed to load order history. Please try again later.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-orange-600 flex items-center">
        <ClipboardList className="mr-2" /> Order History
      </h1>
      {orders.length === 0 ? (
        <p className="text-gray-600">You haven't placed any orders yet.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-2 text-orange-500">
                Order #{order._id}
              </h2>
              <p className="text-gray-600 mb-4">
                Placed on: {new Date(order.createdAt).toLocaleString()}
              </p>
              <ul className="space-y-2">
                {order.items.map((item, index) => (
                  <li key={index} className="flex justify-between items-center">
                    <span>{item.name}</span>
                    <span className="text-orange-500 font-semibold">
                      ${item.price.toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 text-right">
                <span className="text-lg font-semibold">
                  Total: $
                  {order.items
                    .reduce((sum, item) => sum + item.price, 0)
                    .toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
