import React, { useState, useCallback, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Landingpage from './pages/Landingpage';
import MenuPage from './pages/MenuPage';
import Delivery from './pages/Delivery';
import Checkout from './pages/Checkout';
import Account from './pages/Account'; 
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';

function App() {
  // Khởi tạo giá trị từ localStorage một lần khi component mount
  const initialAuthStatus = localStorage.getItem('authStatus') || 'guest';
  const initialCart = JSON.parse(localStorage.getItem('cart')) || [];
  
  // Khởi tạo userAddress từ localStorage
  const initialUserAddress = (() => {
    try {
      const storedAddress = localStorage.getItem('userAddress');
      if (storedAddress && storedAddress !== 'null') {
        return JSON.parse(storedAddress);
      }
    } catch (err) {
      console.error('Error parsing userAddress from localStorage:', err);
    }
    return null;
  })();

  const [authStatus, setAuthStatus] = useState(initialAuthStatus);
  const [userAddress, setUserAddress] = useState(initialUserAddress);
  const [cart, setCart] = useState(initialCart);

  // Lắng nghe sự kiện cartUpdated
  useEffect(() => {
    const handleCartUpdate = () => {
      try {
        const storedCart = localStorage.getItem('cart');
        if (storedCart) {
          setCart(JSON.parse(storedCart));
        }
      } catch (err) {
        console.error('Error reading cart from storage event', err);
      }
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);

  // Lắng nghe thay đổi trong localStorage cho userAddress
  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const storedAddress = localStorage.getItem('userAddress');
        if (storedAddress && storedAddress !== 'null') {
          setUserAddress(JSON.parse(storedAddress));
        } else {
          setUserAddress(null);
        }
      } catch (err) {
        console.error('Error reading userAddress from storage:', err);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('authStatusChanged', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('authStatusChanged', handleStorageChange);
    };
  }, []);

  // Hàm wrapper để cập nhật cả state và localStorage
  const updateAuthStatus = (newStatus) => {
    console.log('App - updateAuthStatus called with:', newStatus);
    setAuthStatus(newStatus);
    if (newStatus === 'guest') {
      localStorage.removeItem('authStatus');
    } else {
      localStorage.setItem('authStatus', newStatus);
    }
    console.log('App - localStorage after update:', localStorage.getItem('authStatus'));
  };

  // Hàm wrapper cho setCart để cập nhật localStorage
  const updateCart = useCallback((newCart) => {
    if (typeof newCart === 'function') {
      setCart(prevCart => {
        const updatedCart = newCart(prevCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        
        // Phát ra sự kiện cartUpdated
        const event = new CustomEvent('cartUpdated');
        window.dispatchEvent(event);
        
        return updatedCart;
      });
    } else {
      setCart(newCart);
      localStorage.setItem('cart', JSON.stringify(newCart));
      
      // Phát ra sự kiện cartUpdated
      const event = new CustomEvent('cartUpdated');
      window.dispatchEvent(event);
    }
  }, []);

  // Hàm wrapper cho setUserAddress
  const updateUserAddress = useCallback((newAddress) => {
    console.log('App - updateUserAddress called with:', newAddress);
    setUserAddress(newAddress);
    if (newAddress) {
      localStorage.setItem('userAddress', JSON.stringify(newAddress));
    } else {
      localStorage.removeItem('userAddress');
    }
  }, []);

  // Component để kiểm tra điều kiện checkout
 // App.js - Update CheckoutWrapper
const CheckoutWrapper = () => {
  const currentAuthStatus = localStorage.getItem('authStatus') || authStatus;
  const currentUserAddress = localStorage.getItem('userAddress');
  
  console.log('CheckoutWrapper: authStatus =', currentAuthStatus);
  console.log('CheckoutWrapper: userAddress =', currentUserAddress);
  
  // Nếu chưa đăng nhập, chuyển về menu
  if (currentAuthStatus !== 'signedIn') {
    console.log('CheckoutWrapper: Not signed in, redirecting to menu');
    return <Navigate to="/menu" replace />;
  }
  
  // Nếu đã đăng nhập nhưng chưa có địa chỉ, chuyển về delivery
  if (!currentUserAddress || currentUserAddress === 'null') {
    console.log('CheckoutWrapper: No address, redirecting to delivery');
    return <Navigate to="/delivery" replace />;
  }
  
  // Nếu có đầy đủ thông tin, cho phép vào checkout (không cần truyền props)
  console.log('CheckoutWrapper: All conditions met, allowing checkout');
  return <Checkout />;
};

  return (
    <Router>
      <AuthProvider 
        initialAuthStatus={authStatus}
        setPropAuthStatus={updateAuthStatus}
        initialUserAddress={userAddress}
        setPropUserAddress={updateUserAddress}
      >
        <CartProvider initialCart={cart} setPropCart={updateCart}>
          <Routes>
            <Route path="/" element={<Landingpage />} />
            
            <Route path="/menu" element={
              <MenuPage 
                cart={cart} 
                setCart={updateCart}
                authStatus={authStatus}
                setAuthStatus={updateAuthStatus}
                userAddress={userAddress}
                setUserAddress={updateUserAddress}
              />
            } />
            
            <Route 
  path="/delivery" 
  element={
    cart.length > 0 ? 
    <Delivery 
      cart={cart}
      setCart={updateCart}
      userAddress={userAddress}
      setUserAddress={updateUserAddress}
    /> : 
    <Navigate to="/menu" replace />
  } 
/>
            
            <Route 
              path="/checkout" 
              element={<CheckoutWrapper />}
            />
            
            <Route 
              path="/account" 
              element={
                authStatus === 'signedIn' || localStorage.getItem('authStatus') === 'signedIn' ?
                <Account /> : 
                <Navigate to="/menu" replace />
              } 
            />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;