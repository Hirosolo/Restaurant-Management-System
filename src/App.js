import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './contexts/CartContext';
import { AuthProvider } from './contexts/AuthContext';
import Landingpage from './pages/Landingpage';
import MenuPage from './pages/MenuPage';
import Delivery from './pages/Delivery';
import Checkout from './pages/Checkout';
import Account from './pages/Account';

function App() {
  const [authStatus, setAuthStatus] = useState('guest');
  const [userAddress, setUserAddress] = useState(null);

  return (
    <Router>
      <AuthProvider 
        initialAuthStatus={authStatus}
        setPropAuthStatus={setAuthStatus}
        initialUserAddress={userAddress}
        setPropUserAddress={setUserAddress}
      >
        <CartProvider>
          <Routes>
            <Route path="/" element={<Landingpage />} />
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/delivery" element={<Delivery userAddress={userAddress} setUserAddress={setUserAddress} />} />
            <Route path="/checkout" element={<Checkout userAddress={userAddress} setUserAddress={setUserAddress} />} />
            <Route path="/account" element={<Account />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;