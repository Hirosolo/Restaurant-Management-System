import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Checkout.css';

function Checkout({ cart, setCart, userAddress }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef(null);
  const overlayRef = useRef(null);
  const [contactNumber, setContactNumber] = useState('');
  const [notes, setNotes] = useState(Array(cart.length).fill(''));
  const navigate = useNavigate();

  // Toggle menu
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Handle note change for a specific item
  const handleNoteChange = (index, value) => {
    const newNotes = [...notes];
    newNotes[index] = value;
    setNotes(newNotes);
  };

  // Calculate subtotal
  const calculateSubtotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  };

  // Calculate delivery charge (fixed for now)
  const deliveryCharge = 2.50;

  // Calculate loyalty points
  const loyaltyPoints = (calculateSubtotal() * 0.1).toFixed(2);

  // Calculate total
  const calculateTotal = () => {
    return (parseFloat(calculateSubtotal()) + deliveryCharge).toFixed(2);
  };

  // Handle payment button click
  const handlePayment = () => {
    // Here you would typically process the payment
    // For now, we'll just show an alert and clear the cart
    alert('Order placed successfully!');
    setCart([]);
    navigate('/menu'); // Navigate back to menu
  };

  // Format address for display
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

  return (
    <div className="checkout-page">
      {/* Header with class menu-navbar */}
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

      {/* User navigation bar */}
      <div className="user-nav">
        <div className="user-nav-container">
          <div className="user-nav-left">
            <span className="user-icon">👤</span>
            <span className="user-nav-item">Sign in</span>
            <span className="separator">|</span>
            <span className="user-nav-item">Guest Order</span>
            <span className="separator">|</span>
            <span className="user-nav-item">Track Your Order</span>
          </div>
        </div>
      </div>

      {/* Checkout Container */}
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
          
          {/* Order Items */}
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
          
          {/* Summary */}
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
    </div>
  );
}

export default Checkout;