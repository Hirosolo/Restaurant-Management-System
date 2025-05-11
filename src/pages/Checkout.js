import React, { useState, useRef, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import { AuthProvider } from '../AuthContext';
import './Checkout.css';

function Checkout() {
  const { cart, setCart, userAddress, setUserAddress, authStatus, hasChosenGuest, setHasChosenGuest, setAuthStatus } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef(null);
  const overlayRef = useRef(null);
  const [contactNumber, setContactNumber] = useState('');
  const [notes, setNotes] = useState(Array(cart.length).fill(''));
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSignInForm, setShowSignInForm] = useState(false);
  const [showCreateAccountForm, setShowCreateAccountForm] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [contactMobile, setContactMobile] = useState('');

  // Show auth modal on page load if not signed in and hasn't chosen guest
  useEffect(() => {
    if (authStatus !== 'signedIn' && !hasChosenGuest) {
      setShowAuthModal(true);
    }
  }, [authStatus, hasChosenGuest]);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleNoteChange = (index, value) => {
    const newNotes = [...notes];
    newNotes[index] = value;
    setNotes(newNotes);
  };

  const calculateSubtotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  };

  const deliveryCharge = 2.50;

  const loyaltyPoints = (calculateSubtotal() * 0.1).toFixed(2);

  const calculateTotal = () => {
    return (parseFloat(calculateSubtotal()) + deliveryCharge).toFixed(2);
  };

  const handlePayment = async () => {
    if (!contactNumber) {
      alert('Please enter your contact number.');
      return;
    }

    if (authStatus !== 'signedIn') {
      alert('Please sign in to place an order.');
      setShowAuthModal(true);
      return;
    }

    // Prepare the order data
    const orderData = {
      cart,
      contactNumber,
      deliveryAddress: userAddress,
      notes,
    };

    try {
      // Send the order to the backend
      const token = localStorage.getItem('token'); // Assuming the JWT token is stored in localStorage after sign-in
      const response = await fetch('http://localhost:5000/api/order/place', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to place order');
      }

      // Request permission for notifications
      if (Notification.permission !== 'granted') {
        await Notification.requestPermission();
      }

      // Show browser notification
      if (Notification.permission === 'granted') {
        new Notification('Order Confirmation', {
          body: `Your order (ID: ${result.orderId}) has been placed successfully!`,
          icon: '/assets/logo.png', // Optional: use your app's logo
        });
      } else {
        alert('Order placed successfully! Order ID: ' + result.orderId);
      }

      // Clear the cart and navigate
      setCart([]);
      setNotes([]);
      setContactNumber('');
      navigate('/menu');
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order: ' + error.message);
    }
  };

  const formatAddress = () => {
    if (!userAddress) return '';

    const addressParts = [];
    if (userAddress.street) addressParts.push(userAddress.street);
    if (userAddress.houseNumber) addressParts.push(userAddress.houseNumber);
    if (userAddress.buildingName) addressParts.push(userAddress.buildingName);
    if (userAddress.block) addressParts.push(`Block ${userAddress.block}`);
    if (userAddress.floor) addressParts.push(`Floor ${userAddress.floor}`);
    if (userAddress.roomNumber) addressParts.push(`Room ${userAddress.roomNumber}`);
    if (userAddress.ward) addressParts.push(userAddress.ward);
    if (userAddress.district) addressParts.push(userAddress.district);

    return addressParts.join(', ');
  };

  const handleSignIn = () => {
    setShowAuthModal(false);
    setShowSignInForm(true);
  };

  const handleCreateAccount = () => {
    setShowAuthModal(false);
    setShowCreateAccountForm(true);
  };

  const handleContinueAsGuest = () => {
    setShowAuthModal(false);
    setAuthStatus('guest');
    setHasChosenGuest(true);
    localStorage.setItem('authStatus', 'guest');
  };

  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/customer/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: userEmail, password: userPassword }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to sign in');
      }

      // Store the token
      localStorage.setItem('token', result.token);

      // Fetch user address
      const addressResponse = await fetch('http://localhost:5000/api/customer/address', {
        headers: {
          'Authorization': `Bearer ${result.token}`,
        },
      });

      const addressResult = await addressResponse.json();

      if (addressResponse.ok) {
        setUserAddress(addressResult);
      }

      setAuthStatus('signedIn');
      setHasChosenGuest(true);
      localStorage.setItem('authStatus', 'signedIn');
      setShowSignInForm(false);
      setUserEmail('');
      setUserPassword('');
    } catch (error) {
      console.error('Error signing in:', error);
      alert('Failed to sign in: ' + error.message);
    }
  };

  const handleCreateAccountSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/customer/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email: userEmail,
          password: userPassword,
          phone: contactMobile,
          ward: userAddress?.ward,
          district: userAddress?.district,
          street: userAddress?.street,
          house_number: userAddress?.houseNumber,
          building_name: userAddress?.buildingName,
          block: userAddress?.block,
          floor: userAddress?.floor,
          room_number: userAddress?.roomNumber,
          delivery_instructions: userAddress?.deliveryInstructions,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to create account');
      }

      // Store the token
      localStorage.setItem('token', result.token);

      setAuthStatus('signedIn');
      setHasChosenGuest(true);
      localStorage.setItem('authStatus', 'signedIn');
      setShowCreateAccountForm(false);
    } catch (error) {
      console.error('Error creating account:', error);
      alert('Failed to create account: ' + error.message);
    }
  };

  // Rest of the JSX remains unchanged
  return (
    <div className="checkout-page">
      <div className="navbar menu-navbar">
        <div className={`menu-icon ${menuOpen ? 'open' : ''}`} onClick={toggleMenu}>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
        </div>
        <div className="mobile-logo">
          <img src="/assets/logo.png" alt="Logo" className="logo" />
        </div>
        <div
          className={`overlay ${menuOpen ? 'active' : ''}`}
          ref={overlayRef}
          onClick={toggleMenu}
        ></div>
        <div
          className={`nav-links ${menuOpen ? 'active' : ''}`}
          ref={navRef}
        >
          <div className="close-btn" onClick={toggleMenu}>✕</div>
          <a href="#">Menu</a>
          <a href="#">Discount</a>
          <img src="/assets/logo.png" alt="Logo" className="logo" />
          <a href="#">Account</a>
          <a href="#">Support</a>
        </div>
      </div>

      <div className="user-nav">
        <div className="user-nav-container">
          <div className="user-nav-left">
            <span className="user-icon">👤</span>
            {authStatus === 'signedIn' ? (
              <span className="user-nav-item">User</span>
            ) : (
              <span className="user-nav-item" onClick={() => setShowAuthModal(true)}>Sign In</span>
            )}
            <span className="separator">|</span>
            <span className="user-nav-item">Guest Order</span>
            <span className="separator">|</span>
            <span className="user-nav-item">Track Your Order</span>
          </div>
        </div>
      </div>

      <div className="checkout-container">
        <h2>CHECK OUT</h2>
        <div className="checkout-section">
          <div className="checkout-field">
            <div className="checkout-field-label">Deliver to:</div>
            <div className="checkout-field-value">{formatAddress()}</div>
            <div className="checkout-field-edit">Edit</div>
          </div>
          <div className="checkout-divider"></div>
          <div className="checkout-field">
            <div className="checkout-field-label">Contact Number:</div>
            <input
              type="text"
              className="checkout-field-input"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              placeholder="Enter your phone number"
            />
            <div className="checkout-field-edit">Edit</div>
          </div>
          <div className="checkout-divider"></div>
          <div className="checkout-items">
            {cart.map((item, index) => (
              <div key={index} className="checkout-item">
                <div className="checkout-item-image">
                  <img src={item.image} alt={item.name} />
                </div>
                <div className="checkout-item-details">
                  <div className="checkout-item-name">{item.name}</div>
                  <div className="checkout-item-rating">
                    {Array(5).fill().map((_, i) => (
                      <span key={i} className={i < item.rating ? "star filled" : "star"}>★</span>
                    ))}
                  </div>
                  <div className="checkout-item-note">
                    <input
                      type="text"
                      placeholder="Note something for order"
                      value={notes[index]}
                      onChange={(e) => handleNoteChange(index, e.target.value)}
                    />
                  </div>
                </div>
                <div className="checkout-item-price">${(item.price * item.quantity).toFixed(2)}</div>
              </div>
            ))}
          </div>
          <div className="checkout-divider"></div>
          <div className="checkout-summary">
            <div className="checkout-summary-row">
              <span>Sub Total:</span>
              <span>${calculateSubtotal()}</span>
            </div>
            <div className="checkout-summary-row">
              <span>Delivery Charge:</span>
              <span>${deliveryCharge.toFixed(2)}</span>
            </div>
            <div className="checkout-summary-row loyalty-points">
              <span>Loyalty points:</span>
              <span>+ {loyaltyPoints}</span>
            </div>
            <div className="checkout-summary-row loyalty-exchange">
              <span>You want to exchange your loyalty points</span>
              <span className="info-icon">ⓘ</span>
            </div>
            <div className="checkout-summary-row discount">
              <span>Discount:</span>
              <span>-(Bấm quý để thành tiền) [chỉ mở chi cài box trên thị hiện cái này]</span>
            </div>
            <div className="checkout-divider"></div>
            <div className="checkout-summary-row total">
              <span>Total:</span>
              <span>${calculateTotal()}</span>
            </div>
            <button className="payment-button" onClick={handlePayment}>
              Proceed To Payment
            </button>
          </div>
        </div>
      </div>

      {showAuthModal && (
        <div className="auth-modal-overlay">
          <div className="auth-modal">
            <h3>Sign in to Greedible and start Green today</h3>
            <div className="auth-options">
              <button className="auth-option-btn sign-in-btn" onClick={handleSignIn}>
                SIGN IN
              </button>
              <div className="auth-separator"></div>
              <button className="auth-option-btn create-account-btn" onClick={handleCreateAccount}>
                CREATE AN ACCOUNT
                <span className="account-time">in less than 2 minutes</span>
                <span className="account-benefits">To enjoy member benefits</span>
              </button>
              <div className="auth-separator"></div>
              <button className="auth-option-btn guest-btn" onClick={handleContinueAsGuest}>
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
            <form onSubmit={handleSignInSubmit}>
              <div className="form-group">
                <label>Email</label>
                <input 
                  type="email" 
                  value={userEmail} 
                  onChange={(e) => setUserEmail(e.target.value)} 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input 
                  type="password" 
                  value={userPassword} 
                  onChange={(e) => setUserPassword(e.target.value)} 
                  required 
                />
              </div>
              <div className="form-options">
                <div className="remember-me">
                  <input type="checkbox" id="remember" />
                  <label htmlFor="remember">Remember me</label>
                </div>
                <a href="#" className="forgot-password">Forgot password?</a>
              </div>
              <button type="submit" className="form-submit-btn">SIGN IN</button>
            </form>
          </div>
        </div>
      )}

      {showCreateAccountForm && (
        <div className="auth-modal-overlay">
          <div className="auth-form-modal register-form">
            <h3>Create New Account</h3>
            <button className="close-modal-btn" onClick={() => setShowCreateAccountForm(false)}>✕</button>
            <form onSubmit={handleCreateAccountSubmit}>
              <div className="form-section">
                <div className="form-group">
                  <label>Email</label>
                  <input 
                    type="email" 
                    value={userEmail} 
                    onChange={(e) => setUserEmail(e.target.value)} 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <input 
                    type="password" 
                    value={userPassword} 
                    onChange={(e) => setUserPassword(e.target.value)} 
                    required 
                  />
                </div>
              </div>
              <button type="submit" className="form-submit-btn">Confirm</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Checkout;