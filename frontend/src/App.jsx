import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Home from './pages/Home';
import Restaurant from './pages/Restaurant';
import Cart from './pages/Cart';
import OrderHistory from './pages/OrderHistory';
import Login from './pages/Login';
import Register from './pages/Register';
import AddRestaurant from './pages/AddRestaurant';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-orange-50">
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/restaurant/:id" element={<Restaurant />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/order-history" element={<OrderHistory />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/add-restaurant" element={<AddRestaurant />} />
          </Routes>
          <ToastContainer position="bottom-right" autoClose={3000} />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;