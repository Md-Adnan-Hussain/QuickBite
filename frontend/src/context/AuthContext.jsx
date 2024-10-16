import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('userRole');
    setIsLoggedIn(!!token);
    setUserRole(role);
  }, []);

  const login = (token, role) => {
    localStorage.setItem('token', token);
    localStorage.setItem('userRole', role);
    setIsLoggedIn(true);
    setUserRole(role);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    setIsLoggedIn(false);
    setUserRole(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);