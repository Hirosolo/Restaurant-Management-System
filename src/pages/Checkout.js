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

  // Load address from localStorage when component mounts
  useEffect(() => {
    try {
      const storedAddress = localStorage.getItem('userAddress');
      console.log('Stored address from localStorage:', storedAddress);
      if (storedAddress && storedAddress !== 'null') {
        const parsedAddress = JSON.parse(storedAddress);
        console.log('Parsed address:', parsedAddress);
        setUserAddress(parsedAddress);
      }
    } catch (err) {
      console.error('Error loading address from localStorage:', err);
    }
  }, []);

  // Initialize temp values when component mounts or context values change
  useEffect(() => {
    console.log('Current userAddress:', userAddress);
    const formattedAddr = formatAddress(userAddress);
    console.log('Formatted address:', formattedAddr);
    setTempAddress(formattedAddr);
    setTempContact(userContact || '');
  }, [userAddress, userContact]);

  // Handle note change for a specific item
  const handleNoteChange = (index, value) => {
    const newNotes = [...notes];
    newNotes[index] = value;
    setNotes(newNotes);
  };

  // Handle address edit
  const handleAddressEdit = () => {
    if (isEditingAddress) {
      // When saving, keep the original address object structure
      if (typeof userAddress === 'object' && userAddress !== null) {
        // Keep the original object structure
        setUserAddress(userAddress);
      } else {
        // If somehow we lost the object structure, create a new one
        const addressParts = tempAddress.split(', ');
        const addressObj = {
          houseNumber: addressParts[0] || '',
          street: addressParts[1] || '',
          buildingName: addressParts[2] || '',
          block: addressParts[3]?.replace('Block ', '') || '',
          floor: addressParts[4]?.replace('Floor ', '') || '',
          roomNumber: addressParts[5]?.replace('Room ', '') || '',
          ward: addressParts[6] || '',
          district: addressParts[7] || ''
        };
        setUserAddress(addressObj);
      }
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
    console.log('Formatting address:', address);
    
    if (!address) {
      console.log('No address provided');
      return '';
    }

    // If address is a string, return it directly
    if (typeof address === 'string') {
      console.log('Address is a string, returning as is:', address);
      return address;
    }

    // If address is an object with formattedAddress, use that
    if (address.formattedAddress) {
      console.log('Using formattedAddress:', address.formattedAddress);
      return address.formattedAddress;
    }

    // If address is an object with address field, use that
    if (address.address) {
      console.log('Using address field:', address.address);
      return address.address;
    }

    // If address is an object with individual fields, construct the address
    const parts = [];
    if (address.houseNumber) parts.push(address.houseNumber);
    if (address.street) parts.push(address.street);
    if (address.buildingName) parts.push(`Building: ${address.buildingName}`);
    if (address.block) parts.push(`Block ${address.block}`);
    if (address.floor) parts.push(`Floor ${address.floor}`);
    if (address.roomNumber) parts.push(`Room ${address.roomNumber}`);
    if (address.ward) parts.push(address.ward);
    if (address.district) parts.push(address.district);

    const formatted = parts.join(', ');
    console.log('Constructed address:', formatted);
    return formatted;
  };

  // Format address for database
  const formatAddressForDB = (addressObj) => {
    if (!addressObj) return '';
    
    // If it's already a string, return it
    if (typeof addressObj === 'string') return addressObj;
    
    // If it's an object, format it into a single string
    const addressParts = [];
    
    // Required fields
    if (addressObj.houseNumber) addressParts.push(addressObj.houseNumber);
    if (addressObj.street) addressParts.push(addressObj.street);
    if (addressObj.ward) addressParts.push(addressObj.ward);
    if (addressObj.district) addressParts.push(addressObj.district);
    
    // Optional fields
    if (addressObj.buildingName) addressParts.push(`Building: ${addressObj.buildingName}`);
    if (addressObj.block) addressParts.push(`Block ${addressObj.block}`);
    if (addressObj.floor) addressParts.push(`Floor ${addressObj.floor}`);
    if (addressObj.roomNumber) addressParts.push(`Room ${addressObj.roomNumber}`);
    
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
        delivery_address: formatAddressForDB(userAddress),
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
                  {userAddress ? formatAddress(userAddress) : 'Please add your delivery address'}
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