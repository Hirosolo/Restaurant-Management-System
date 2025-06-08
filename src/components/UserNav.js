import React, { useState } from 'react';
import './UserNav.css';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import CreateAccountForm from './CreateAccountForm';

const UserNav = () => {
  const navigate = useNavigate();
  const {
    authStatus,
    continueAsGuest,
    handleSignIn,
  } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSignInForm, setShowSignInForm] = useState(false);
  const [showCreateAccountForm, setShowCreateAccountForm] = useState(false);
  const [hasContinuedAsGuest, setHasContinuedAsGuest] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [showTrackOrderPopup, setShowTrackOrderPopup] = useState(false);
  const [trackOrderId, setTrackOrderId] = useState('');
  const [trackOrderResult, setTrackOrderResult] = useState(null);
  const [isLoadingTrackOrders, setIsLoadingTrackOrders] = useState(false);
  const [trackOrderError, setTrackOrderError] = useState('');

  const handleAccountClick = (e) => { e.preventDefault(); if (authStatus === 'signedIn') { navigate('/account'); } else { setShowAuthModal(true); } };
  const showNotification = (message, type = 'info') => {
    setNotification({ show: true, message, type });
    setTimeout(() => { setNotification({ show: false, message: '', type: '' }); }, 5000);
  };
  const handleTrackOrderClick = (e) => {
    e.preventDefault();
    if (authStatus === 'signedIn') {
      navigate('/account?tab=order-history');
      return;
    }
    setShowTrackOrderPopup(true);
    setTrackOrderId('');
    setTrackOrderResult(null);
    setTrackOrderError('');
  };
  const handleTrackOrderSubmit = async (e) => {
    e.preventDefault();
    if (!trackOrderId) { setTrackOrderError('Please enter your order ID'); return; }
    setIsLoadingTrackOrders(true);
    setTrackOrderError('');
    try {
      const response = await fetch(`http://localhost:3001/api/orders/${trackOrderId}`);
      if (!response.ok) throw new Error('Order not found');
      const data = await response.json();
      if (data.success && data.order) {
        setTrackOrderResult(data.order);
      } else {
        setTrackOrderError(data.message || 'Order not found');
      }
    } catch (error) {
      setTrackOrderError('Error fetching order. Please try again.');
    } finally {
      setIsLoadingTrackOrders(false);
    }
  };
  const calculateTotalAmountTrack = (items) => items.reduce((total, item) => total + item.price * item.quantity, 0);  const formatCurrency = (amount) => {
    const amountStr = Math.floor(amount).toString();
    const formattedAmount = amountStr.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return `${formattedAmount} vnd`;
  };

  return (
    <>
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
              const emailInput = e.target.querySelector('input[type=\"email\"]');
              if (!emailInput.value) {
                emailInput.setCustomValidity('This field is required');
                emailInput.reportValidity();
                return;
              }
              emailInput.setCustomValidity('');
              // Validate password
              const passwordInput = e.target.querySelector('input[type=\"password\"]');
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
            {!trackOrderResult ? (
              <form onSubmit={handleTrackOrderSubmit}>
                <div className="form-group">
                  <label>Order ID</label>
                  <input type="text" value={trackOrderId} onChange={(e) => setTrackOrderId(e.target.value)} placeholder="Enter your order ID" required />
                </div>
                {trackOrderError && <div className="error-message" style={{color: 'red', marginBottom: '10px'}}>{trackOrderError}</div>}
                <button type="submit" className="form-submit-btn" disabled={isLoadingTrackOrders}>{isLoadingTrackOrders ? 'Loading...' : 'Track Order'}</button>
              </form>
            ) : (
              <div className="track-order-results">
                <div className="track-order-header">
                  <h4>Order #{trackOrderResult.sale_id}</h4>
                  <button className="back-btn search-again-btn" onClick={() => { setTrackOrderResult(null); setTrackOrderId(''); setTrackOrderError(''); }}>Search Again</button>
                </div>
                {isLoadingTrackOrders ? (
                  <div className="loading">Loading order...</div>
                ) : (
                  <div className="orders-list">
                    <div className="order-card">
                      <div className="order-header">
                        <div className="order-info">
                          <span className="order-id">Order #{trackOrderResult.sale_id}</span>
                          <span className="order-date">{new Date(trackOrderResult.sale_time).toLocaleDateString()}</span>
                        </div>
                        <div className="order-status">
                          <span className={`status ${trackOrderResult.status.toLowerCase()}`}>{trackOrderResult.status}</span>
                        </div>
                      </div>
                      <div className="order-items">
                        {trackOrderResult.items.map((item, index) => (
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
                          <span>{formatCurrency(calculateTotalAmountTrack(trackOrderResult.items))}</span>
                        </div>
                        {/* No address shown in Track Your Order popup */}
                        {trackOrderResult.status === 'Pending' && (
                          <button
                            className="received-order-btn"
                            onClick={async () => {
                              try {
                                const response = await fetch(`http://localhost:3001/api/orders/guest/complete/${trackOrderResult.sale_id}`, {
                                  method: 'PUT',
                                  headers: { 'Content-Type': 'application/json' },
                                });
                                const data = await response.json();
                                if (response.ok && data.success) {
                                  setTrackOrderResult({ ...trackOrderResult, status: 'Completed' });
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
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default UserNav;
