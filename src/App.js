import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './server/routes/Routes';

function App() {
  const [cart, setCart] = useState([]);
  const [userAddress, setUserAddress] = useState(null);
  const [authStatus, setAuthStatus] = useState(() => {
    return localStorage.getItem('authStatus') || 'guest';
  });

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

  return (
    <Router>
      <AppRoutes
        cart={cart}
        setCart={setCart}
        userAddress={userAddress}
        setUserAddress={setUserAddress}
        authStatus={authStatus}
        setAuthStatus={setAuthStatus}
      />
    </Router>
  );
}

export default App;