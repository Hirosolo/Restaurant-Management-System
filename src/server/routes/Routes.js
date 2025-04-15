import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Landingpage from './../../pages/Landingpage.js';
import MenuPage from './../../pages/MenuPage.js';
import Delivery from './../../pages/Delivery.js';
import Checkout from './../../pages/Checkout.js';
import Account from './../../pages/Account.js';

const AppRoutes = ({
  cart,
  setCart,
  userAddress,
  setUserAddress,
  authStatus,
  setAuthStatus,
}) => {
  return (
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
          cart.length > 0 ? (
            <Delivery
              cart={cart}
              setCart={setCart}
              userAddress={userAddress}
              setUserAddress={setUserAddress}
              authStatus={authStatus}
            />
          ) : (
            <Navigate to="/menu" replace />
          )
        }
      />
      <Route
        path="/checkout"
        element={
          userAddress ? (
            <Checkout
              cart={cart}
              setCart={setCart}
              userAddress={userAddress}
              authStatus={authStatus}
            />
          ) : (
            <Navigate to="/delivery" replace />
          )
        }
      />
      <Route
        path="/account"
        element={
          authStatus === 'signedIn' ? (
            <Account
              authStatus={authStatus}
              setAuthStatus={setAuthStatus}
              userAddress={userAddress}
              setUserAddress={setUserAddress}
            />
          ) : (
            <Navigate to="/menu" replace />
          )
        }
      />
    </Routes>
  );
};

export default AppRoutes;