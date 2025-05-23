import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import Landingpage from '../pages/Landingpage';
import MenuPage from '../pages/MenuPage';
import Delivery from '../pages/Delivery';
import Checkout from '../pages/Checkout';
import Account from '../pages/Account';

const AppRoutes = () => {
  const { cart, userAddress, authStatus } = useContext(AuthContext);

  return (
    <Routes>
      <Route path="/" element={<Landingpage />} />
      <Route path="/menu" element={<MenuPage />} />
      <Route
        path="/delivery"
        element={
          cart.length > 0 ? <Delivery /> : <Navigate to="/menu" replace />
        }
      />
      <Route
        path="/checkout"
        element={
          userAddress ? (
            <Checkout />
          ) : (
            <Navigate to="/delivery" replace />
          )
        }
      />
      <Route
        path="/account"
        element={
          authStatus === 'signedIn' ? (
            <Account />
          ) : (
            <Navigate to="/menu" replace />
          )
        }
      />
    </Routes>
  );
};

export default AppRoutes;