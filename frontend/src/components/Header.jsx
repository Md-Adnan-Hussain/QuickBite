import React from 'react';
import { Link } from 'react-router-dom';
import { Utensils } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { isLoggedIn, userRole, logout } = useAuth();

  return (
    <header className="bg-orange-500 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold flex items-center">
          <Utensils className="mr-2" />
          Quick Bite
        </Link>
        <nav>
          <ul className="flex space-x-4">
            <li><Link to="/" className="hover:text-orange-200">Home</Link></li>
            {isLoggedIn && userRole !== '1' && (
              <>
                <li><Link to="/cart" className="hover:text-orange-200">Cart</Link></li>
                <li><Link to="/order-history" className="hover:text-orange-200">Order History</Link></li>
              </>
            )}
            {userRole === '1' && (
              <li><Link to="/add-restaurant" className="hover:text-orange-200">Add Restaurant</Link></li>
            )}
            {!isLoggedIn ? (
              <>
                <li><Link to="/login" className="hover:text-orange-200">Login</Link></li>
                <li><Link to="/register" className="hover:text-orange-200">Register</Link></li>
              </>
            ) : (
              <li><button onClick={logout} className="hover:text-orange-200">Logout</button></li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;