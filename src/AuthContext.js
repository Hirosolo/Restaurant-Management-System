import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [userAddress, setUserAddress] = useState(null);
  const [authStatus, setAuthStatus] = useState(() => {
    return localStorage.getItem('authStatus') || 'guest';
  });
  const [hasChosenGuest, setHasChosenGuest] = useState(false);

  // Sync authStatus with localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      const newAuthStatus = localStorage.getItem('authStatus') || 'guest';
      setAuthStatus(newAuthStatus);
    };

    window.addEventListener('storage', handleStorageChange);
    handleStorageChange();

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Persist cart in localStorage for guests
  useEffect(() => {
    if (authStatus === 'guest') {
      localStorage.setItem('guestCart', JSON.stringify(cart));
    }
  }, [cart, authStatus]);

  // Load cart from localStorage on mount for guests
  useEffect(() => {
    if (authStatus === 'guest') {
      const savedCart = localStorage.getItem('guestCart');
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    }
  }, [authStatus]);

  // Persist userAddress in localStorage for signed-in users
  useEffect(() => {
    if (authStatus === 'signedIn' && userAddress) {
      localStorage.setItem('userAddress', JSON.stringify(userAddress));
    }
  }, [userAddress, authStatus]);

  // Load userAddress from localStorage on mount for signed-in users
  useEffect(() => {
    if (authStatus === 'signedIn') {
      const savedAddress = localStorage.getItem('userAddress');
      if (savedAddress) {
        setUserAddress(JSON.parse(savedAddress));
      }
    }
  }, [authStatus]);

  return (
    <AuthContext.Provider
      value={{
        cart,
        setCart,
        userAddress,
        setUserAddress,
        authStatus,
        setAuthStatus,
        hasChosenGuest,
        setHasChosenGuest,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};