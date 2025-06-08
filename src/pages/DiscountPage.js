import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import CreateAccountForm from '../components/CreateAccountForm';
import '../styles/DiscountPage.css';

const DiscountPage = () => {
  const navigate = useNavigate();
  const [expandedImage, setExpandedImage] = useState(null);

  const handleImageClick = (index) => {
    if (expandedImage === index) {
      setExpandedImage(null);
    } else {
      setExpandedImage(index);
    }
  };

  // Handle body scroll when image is expanded
  useEffect(() => {
    if (expandedImage !== null) {
      document.body.classList.add('image-expanded');
    } else {
      document.body.classList.remove('image-expanded');
    }

    // Cleanup on unmount
    return () => {
      document.body.classList.remove('image-expanded');
    };
  }, [expandedImage]);

  // Handle escape key to close expanded image
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape' && expandedImage !== null) {
        setExpandedImage(null);
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [expandedImage]);

  // Handle click outside image to close
  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) {
      setExpandedImage(null);
    }
  };

  // User-nav/modal state and logic (copied from MenuPage.js)
  const {
    authStatus,
    setAuthStatus,
    continueAsGuest,
    handleSignIn,
    userData
  } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSignInForm, setShowSignInForm] = useState(false);
  const [showCreateAccountForm, setShowCreateAccountForm] = useState(false);
  const [hasContinuedAsGuest, setHasContinuedAsGuest] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [showTrackOrderPopup, setShowTrackOrderPopup] = useState(false);
  const [trackOrderPhone, setTrackOrderPhone] = useState('');
  const [trackOrderHistory, setTrackOrderHistory] = useState([]);
  const [isLoadingTrackOrders, setIsLoadingTrackOrders] = useState(false);
  const [trackOrderError, setTrackOrderError] = useState('');
  const [buildingNameValue, setBuildingNameValue] = useState('');
  // Dropdown options for address
  const wards = ['Ward 1', 'Ward 2', 'Ward 3', 'Ward 4', 'Ward 5'];
  const districts = ['District 1', 'District 2', 'District 3', 'District 4', 'District 5'];
  const streets = ['Street 1', 'Street 2', 'Street 3', 'Street 4', 'Street 5'];
  const [wardValue, setWardValue] = useState('');
  const [districtValue, setDistrictValue] = useState('');
  const [streetValue, setStreetValue] = useState('');

  const handleAccountClick = (e) => { e.preventDefault(); if (authStatus === 'signedIn') { navigate('/account'); } else { setShowAuthModal(true); } };
  const showNotification = (message, type = 'info') => {
    setNotification({ show: true, message, type });
    setTimeout(() => { setNotification({ show: false, message: '', type: '' }); }, 5000);
  };
  const handleTrackOrderClick = (e) => {
    e.preventDefault();
    setShowTrackOrderPopup(true);
    setTrackOrderPhone('');
    setTrackOrderHistory([]);
    setTrackOrderError('');
  };
  const handleTrackOrderSubmit = async (e) => {
    e.preventDefault();
    if (!trackOrderPhone) { setTrackOrderError('Please enter your phone number'); return; }
    if (!/^[0-9]{10}$/.test(trackOrderPhone)) { setTrackOrderError('Phone number must be exactly 10 digits'); return; }
    setIsLoadingTrackOrders(true);
    setTrackOrderError('');
    try {
      const response = await fetch(`http://localhost:3001/api/orders/guest/orders/${trackOrderPhone}`);
      if (!response.ok) throw new Error('Failed to fetch order history');
      const data = await response.json();
      if (data.success) {
        setTrackOrderHistory(data.orders);
        if (data.orders.length === 0) setTrackOrderError('No orders found for this phone number');
      } else {
        setTrackOrderError(data.message || 'Failed to fetch order history');
      }
    } catch (error) {
      setTrackOrderError('Error fetching order history. Please try again.');
    } finally {
      setIsLoadingTrackOrders(false);
    }
  };
  const calculateTotalAmountTrack = (items) => items.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div className="discount-page">
      {notification.show && (
        <div className={`notification ${notification.type}`}
             style={{ position: 'fixed', top: 20, right: 20, zIndex: 3000, padding: '16px 24px', borderRadius: 6, background: notification.type === 'success' ? '#d4edda' : notification.type === 'error' ? '#f8d7da' : '#cce5ff', color: notification.type === 'success' ? '#155724' : notification.type === 'error' ? '#721c24' : '#004085', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
          {notification.message}
        </div>
      )}
      <div className="user-nav">
        <div className="user-nav-container">
          <div className="user-nav-left">
            <span className="user-icon">👤</span>
            {authStatus === 'signedIn' ? (
              <span className="user-nav-item" onClick={handleAccountClick}>My Account</span>
            ) : (
              <span className="user-nav-item" onClick={() => { setShowAuthModal(true); setShowSignInForm(false); }}>Sign In</span>
            )}

      {/* Ensure the auth modal and sign-in modal rendering is present */}
      {showAuthModal && (
        <div className="auth-modal-overlay">
          <div className="auth-modal">
            <h3>Sign in to Greedible and start Green today</h3>
            <div className="auth-options">
              <button className="auth-option-btn sign-in-btn" onClick={() => { setShowSignInForm(true); setShowAuthModal(false); }}>
                SIGN IN
              </button>
              <div className="auth-separator"></div>
              <button className="auth-option-btn create-account-btn" onClick={() => { setShowCreateAccountForm(true); setShowAuthModal(false); }}>
                CREATE AN ACCOUNT
                <span className="account-time">in less than 2 minutes</span>
                <span className="account-benefits">To enjoy member benefits</span>
              </button>
              <div className="auth-separator"></div>
              <button className="auth-option-btn guest-btn" onClick={() => {
                continueAsGuest();
                setHasContinuedAsGuest(true);
                setShowAuthModal(false);
              }}>
                CONTINUE AS GUEST
              </button>
            </div>
          </div>
        </div>
      )}

      {showSignInForm && (
        <div className="auth-modal-overlay">
          <div className="auth-form-modal">
            <h3>Sign In</h3>
            <button className="close-modal-btn" onClick={() => setShowSignInForm(false)}>✕</button>
            <form onSubmit={async (e) => {
              e.preventDefault();
              // Validate email
              const emailInput = e.target.querySelector('input[type="email"]');
              if (!emailInput.value) {
                emailInput.setCustomValidity('This field is required');
                emailInput.reportValidity();
                return;
              }
              emailInput.setCustomValidity('');
              // Validate password
              const passwordInput = e.target.querySelector('input[type="password"]');
              if (!passwordInput.value) {
                passwordInput.setCustomValidity('This field is required');
                passwordInput.reportValidity();
                return;
              }
              passwordInput.setCustomValidity('');
              try {
                showNotification('Signing in...', 'info');
                await handleSignIn(userEmail, userPassword);
                showNotification('Successfully signed in! Welcome back!', 'success');
                setShowSignInForm(false);
                setShowAuthModal(false);
                setUserEmail('');
                setUserPassword('');
              } catch (error) {
                showNotification(error.message || 'Invalid email or password. Please try again.', 'error');
              }
            }}>
              <div className="form-group">
                <label>Email</label>
                <input type="email" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input type="password" value={userPassword} onChange={(e) => setUserPassword(e.target.value)} required />
              </div>
              <button type="submit" className="form-submit-btn">SIGN IN</button>
            </form>
          </div>
        </div>
      )}

      {showCreateAccountForm && (
        <CreateAccountForm
          setShowCreateAccountForm={setShowCreateAccountForm}
          onClose={() => setShowCreateAccountForm(false)}
          onSuccess={() => {
            setShowCreateAccountForm(false);
            setShowSignInForm(true);
          }}
          showNotification={showNotification}
        />
      )}
            <span className="separator">|</span>
            <span className="user-nav-item" onClick={handleTrackOrderClick}>Track Your Order</span>
          </div>
        </div>
      </div>
      {showTrackOrderPopup && (
        <div className="auth-modal-overlay">
          <div className="auth-form-modal track-order-modal">
            <h3>Track Your Order</h3>
            <button className="close-modal-btn" onClick={() => setShowTrackOrderPopup(false)}>✕</button>
            {trackOrderHistory.length === 0 ? (
              <form onSubmit={handleTrackOrderSubmit}>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input type="tel" value={trackOrderPhone} onChange={(e) => setTrackOrderPhone(e.target.value)} placeholder="Enter your phone number" required pattern="[0-9]{10}" title="Phone number must be exactly 10 digits" />
                </div>
                {trackOrderError && <div className="error-message" style={{color: 'red', marginBottom: '10px'}}>{trackOrderError}</div>}
                <button type="submit" className="form-submit-btn" disabled={isLoadingTrackOrders}>{isLoadingTrackOrders ? 'Loading...' : 'Track Orders'}</button>
              </form>
            ) : (
              <div className="track-order-results">
                <div className="track-order-header">
                  <h4>Order History for {trackOrderPhone}</h4>
                  <button className="back-btn" onClick={() => { setTrackOrderHistory([]); setTrackOrderPhone(''); setTrackOrderError(''); }}>Search Again</button>
                </div>
                {isLoadingTrackOrders ? (
                  <div className="loading">Loading orders...</div>
                ) : trackOrderHistory.length > 0 ? (
                  <div className="orders-list">
                    {trackOrderHistory.map((order) => (
                      <div key={order.sale_id} className="order-card">
                        <div className="order-header">
                          <div className="order-info">
                            <span className="order-id">Order #{order.sale_id}</span>
                            <span className="order-date">{new Date(order.sale_time).toLocaleDateString()}</span>
                          </div>
                          <div className="order-status">
                            <span className={`status ${order.status.toLowerCase()}`}>{order.status}</span>
                          </div>
                        </div>
                        <div className="order-items">
                          {order.items.map((item, index) => (
                            <div key={index} className="order-item">
                              <img src={item.image_url} alt={item.recipe_name} onError={(e) => { e.target.onerror = null; e.target.src = '/placeholder-food.jpg'; }} />
                              <div className="item-details">
                                <span className="item-name">{item.recipe_name}</span>
                                <span className="item-quantity">x{item.quantity}</span>
                              </div>
                              <div className="order-item-details">
                                <p>{item.price * item.quantity}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="order-footer">
                          <div className="order-total">
                            <span>Total:</span>
                            <span>{calculateTotalAmountTrack(order.items)}</span>
                          </div>
                          <div className="order-address">
                            <span>Delivered to:</span>
                            <span>{order.delivery_address}</span>
                          </div>
                          {order.status === 'Pending' && (
                            <button
                              className="received-order-btn"
                              onClick={async () => {
                                try {
                                  const response = await fetch(`http://localhost:3001/api/orders/guest/complete/${order.sale_id}`, {
                                    method: 'PUT',
                                    headers: { 'Content-Type': 'application/json' },
                                  });
                                  const data = await response.json();
                                  if (response.ok && data.success) {
                                    // Update order status in UI
                                    setTrackOrderHistory(prev => prev.map(o =>
                                      o.sale_id === order.sale_id ? { ...o, status: 'Completed' } : o
                                    ));
                                    alert('Order marked as completed!');
                                  } else {
                                    alert(data.message || 'Failed to mark order as completed');
                                  }
                                } catch (error) {
                                  alert('Failed to mark order as completed. Please try again.');
                                }
                              }}
                            >
                              Received the order
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-orders"><p>No orders found for this phone number.</p></div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
      <div className="navbar menu-navbar">
      <div className="nav-links" >
      <a href="/">Home</a>
      <a href="/menu">Menu</a>
      <img src="/assets/logo.png" alt="Logo" className="logo" />
      <a href="/discount">Discount</a>
      <a href="/support">Support</a>
        </div>
      </div>
      
      <div className="discount-container">
        <div className="discount-images">
          <div className="image-item" onClick={() => handleImageClick(0)}>
            <img src="/assets/morning-energy.jpg" alt="Morning Energy" />
          </div>
          <div className="image-item" onClick={() => handleImageClick(1)}>
            <img src="/assets/special-food-menu.jpg" alt="Special Food Menu" />
          </div>
          <div className="image-item" onClick={() => handleImageClick(2)}>
            <img src="/assets/loyalty-card.jpg" alt="Loyalty Card" />
          </div>
        </div>
        {expandedImage !== null && (
          <div className="image-expanded-overlay" onClick={handleBackdropClick}>
            <img
              src={
                expandedImage === 0 ? "/assets/morning-energy.jpg" :
                expandedImage === 1 ? "/assets/special-food-menu.jpg" :
                "/assets/loyalty-card.jpg"
              }
              alt="Expanded Discount"
              className="expanded-img"
              onClick={e => e.stopPropagation()}
            />
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default DiscountPage; 