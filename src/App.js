import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Landingpage from './pages/Landingpage';
import MenuPage from './pages/MenuPage';
import Delivery from './pages/Delivery';
import Checkout from './pages/Checkout';
import Account from './pages/Account'; 

function App() {
  const [cart, setCart] = useState([]);
  const [userAddress, setUserAddress] = useState(null);
  const [authStatus, setAuthStatus] = useState(() => {
    return localStorage.getItem('authStatus') || 'guest';
  });

  // Đồng bộ authStatus với localStorage
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
      <Routes>
        <Route path="/" element={<Landingpage />} />
        <Route 
          path="/menu" 
          element={
            <MenuPage 
              cart={cart} 
              setCart={setCart} 
              authStatus={authStatus} 
              setAuthStatus={setAuthStatus} 
              userAddress={userAddress}
              setUserAddress={setUserAddress}
            />
          } 
        />
        <Route 
          path="/delivery" 
          element={
            cart.length > 0 ? 
            <Delivery 
              cart={cart} 
              setCart={setCart} 
              userAddress={userAddress} 
              setUserAddress={setUserAddress}
              authStatus={authStatus}
            /> : 
            <Navigate to="/menu" replace />
          } 
        />
        <Route 
          path="/checkout" 
          element={
            userAddress ? 
            <Checkout 
              cart={cart} 
              setCart={setCart} 
              userAddress={userAddress}
              authStatus={authStatus}
            /> : 
            <Navigate to="/delivery" replace />
          } 
        />
        <Route 
          path="/account" 
          element={
            authStatus === 'signedIn' ?
            <Account 
              authStatus={authStatus}
              setAuthStatus={setAuthStatus}
              userAddress={userAddress}
              setUserAddress={setUserAddress}
            /> : 
            <Navigate to="/menu" replace />
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;