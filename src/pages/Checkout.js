import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import Navbar from '../components/Navbar';
import UserNav from '../components/UserNav';
import './Checkout.css';

function Checkout() {
  const { cart, setCart } = useCart();
  const { 
    userData, 
    userAddress, 
    setUserAddress, 
    userContact, 
    setUserContact 
  } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [tempAddress, setTempAddress] = useState('');
  const [isEditingContact, setIsEditingContact] = useState(false);
  const [tempContact, setTempContact] = useState('');
  const [notes, setNotes] = useState([]);

  // Update notes array when cart changes
  useEffect(() => {
    if (cart && cart.length > 0) {
      setNotes(Array(cart.length).fill(''));
    }
  }, [cart.length]);

  // Handle note change for a specific item
  const handleNoteChange = (index, value) => {
    const newNotes = [...notes];
    newNotes[index] = value;
    setNotes(newNotes);
  };

  // Handle address edit
  const handleAddressEdit = () => {
    if (isEditingAddress) {
      setUserAddress(tempAddress);
      setIsEditingAddress(false);
    } else {
      setTempAddress(formatAddress(userAddress));
      setIsEditingAddress(true);
    }
  };

  // Handle contact edit
  const handleContactEdit = () => {
    if (isEditingContact) {
      setUserContact(tempContact);
      setIsEditingContact(false);
    } else {
      setTempContact(userContact || '');
      setIsEditingContact(true);
    }
  };

  // Calculate subtotal
  const calculateSubtotal = () => {
    if (!cart || cart.length === 0) return 0;
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // Calculate delivery charge
  const deliveryCharge = 2.50;

  // Calculate loyalty points
  const loyaltyPoints = calculateSubtotal() * 0.1;

  // Calculate total
  const calculateTotal = () => {
    return calculateSubtotal() + deliveryCharge;
  };

  // Format address for display
  const formatAddress = (address) => {
    if (!address) return '';
    
    // If address is already a string, return it
    if (typeof address === 'string') return address;
    
    // If it's an object, format it
    const addressParts = [];
    if (address.houseNumber) addressParts.push(address.houseNumber);
    if (address.street) addressParts.push(address.street);
    if (address.ward) addressParts.push(address.ward);
    if (address.district) addressParts.push(address.district);
    
    return addressParts.join(', ');
  };

  // Handle payment
  const handlePayment = async () => {
    if (!userAddress || !userContact) {
      alert('Please provide delivery address and contact number');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderData = {
        items: cart.map(item => ({
          id: item.id,
          quantity: item.quantity,
          price: item.price,
          note: item.note || ''
        })),
        delivery_address: formatAddress(userAddress),
        contact_number: userContact,
        delivery_charge: deliveryCharge,
        subtotal: calculateSubtotal(),
        total: calculateTotal(),
        customer_id: userData?.customer_id || null
      };

      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json'
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch('http://localhost:3001/api/orders/create', {
        method: 'POST',
        headers,
        body: JSON.stringify(orderData),
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create order');
      }

      const data = await response.json();

      if (data.success) {
        alert('Order placed successfully!');
        setCart([]);
        navigate('/menu');
      } else {
        throw new Error(data.message || 'Failed to create order');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      alert(error.message || 'Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show empty cart message if cart is empty
  if (!cart || cart.length === 0) {
    return (
      <div className="checkout-page">
        <Navbar />
        <UserNav />
        <div className="checkout-container">
          <div className="empty-cart">
            <h2>Your cart is empty</h2>
            <button className="back-to-menu-btn" onClick={() => navigate('/menu')}>
              Back to Menu
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <Navbar />
      <UserNav />
      
      <div className="checkout-container">
        <div className="checkout-header">
          <h1>CHECK OUT</h1>
        </div>

        <div className="checkout-content">
          {/* Delivery Address Section */}
          <div className="checkout-section">
            <div className="section-header">
              <span className="section-label">Deliver to:</span>
              <button className="edit-btn" onClick={handleAddressEdit}>
                {isEditingAddress ? 'Save' : 'Edit'}
              </button>
            </div>
            <div className="section-content">
              {isEditingAddress ? (
                <input
                  type="text"
                  className="edit-input"
                  value={tempAddress}
                  onChange={(e) => setTempAddress(e.target.value)}
                  placeholder="Enter your delivery address"
                />
              ) : (
                <div className="address-display">
                  {formatAddress(userAddress) || 'Please add your delivery address'}
                </div>
              )}
            </div>
          </div>

          {/* Contact Number Section */}
          <div className="checkout-section">
            <div className="section-header">
              <span className="section-label">Contact Number:</span>
              <button className="edit-btn" onClick={handleContactEdit}>
                {isEditingContact ? 'Save' : 'Edit'}
              </button>
            </div>
            <div className="section-content">
              {isEditingContact ? (
                <input
                  type="tel"
                  className="edit-input"
                  value={tempContact}
                  onChange={(e) => setTempContact(e.target.value)}
                  placeholder="Enter your contact number"
                />
              ) : (
                <div className="contact-display">
                  {userContact || 'Please add your contact number'}
                </div>
              )}
            </div>
          </div>

          {/* Order Items Section */}
          <div className="checkout-section">
            <div className="order-items">
              {cart.map((item, index) => (
                <div key={item.id || index} className="order-item">
                  <div className="item-image">
                    <img 
                      src={item.image || item.image_url} 
                      alt={item.name} 
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/placeholder-food.jpg';
                      }}
                    />
                  </div>
                  <div className="item-details">
                    <div className="item-name">{item.name}</div>
                    <div className="item-note">
                      <input
                        type="text"
                        placeholder="Note something for order"
                        value={notes[index] || ''}
                        onChange={(e) => handleNoteChange(index, e.target.value)}
                        className="note-input"
                      />
                    </div>
                  </div>
                  <div className="item-price">
                    ${((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary Section */}
          <div className="checkout-section">
            <div className="order-summary">
              <div className="summary-row">
                <span>Sub Total:</span>
                <span>${calculateSubtotal().toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Delivery Charge:</span>
                <span>${deliveryCharge.toFixed(2)}</span>
              </div>
              <div className="summary-row loyalty">
                <span>Loyalty points:</span>
                <span>+ {loyaltyPoints.toFixed(2)}</span>
              </div>
              <div className="summary-row exchange">
                <span>You want to exchange your loyalty points</span>
                <span className="info-icon">ⓘ</span>
              </div>
              <div className="summary-row discount">
                <span>Discount:</span>
                <span>-</span>
              </div>
              
              <div className="summary-divider"></div>
              
              <div className="summary-row total">
                <span>Total:</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Payment Button */}
          <button 
            className="payment-btn" 
            onClick={handlePayment}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Processing...' : 'Place Order'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Checkout;