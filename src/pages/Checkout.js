import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import Navbar from '../components/Navbar';
import UserNav from '../components/UserNav';
import './Checkout.css';

function Checkout() {
  console.log('Checkout component rendered');
  const { cart, setCart } = useCart();
  const { 
    userData, 
    userAddress, 
    setUserAddress, 
    userContact, 
    setUserContact 
  } = useAuth();
  console.log('userData in Checkout:', userData);
  console.log('Loyalty points in Checkout:', userData?.loyaltyPoints);
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [tempAddress, setTempAddress] = useState('');
  const [tempContact, setTempContact] = useState('');
  const [notes, setNotes] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('cash');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [notification, setNotification] = useState(null);
  const [useLoyaltyPoints, setUseLoyaltyPoints] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

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
    // Initialize tempContact based on user login status
    setTempContact(userData?.phone || userContact || '');
  }, [userAddress, userContact, userData]);

  // Load auth data from localStorage when component mounts
  useEffect(() => {
    try {
      const storedAuthStatus = localStorage.getItem('authStatus');
      const storedUserData = localStorage.getItem('userData');
      const storedUserAddress = localStorage.getItem('userAddress');
      const storedUserContact = localStorage.getItem('userContact');
      console.log('AuthContext: Loaded from localStorage', {
        authStatus: storedAuthStatus,
        hasUserData: !!storedUserData,
        hasUserAddress: !!storedUserAddress,
        hasUserContact: !!storedUserContact
      });
    } catch (err) {
      console.error('Error loading auth data from localStorage:', err);
    }
  }, []);

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

  // Handle contact edit (modified to handle blur validation)
  const handleContactEdit = () => {
    // Validate phone number before saving
    if (!tempContact || tempContact.trim() === '') {
      showNotification('Please enter a valid contact number.', 'error');
      return;
    }

    // Basic validation for 10 digits (assuming phone number format)
    const phoneRegex = /^\d{10}$/;
    
    console.log('Validating tempContact:', tempContact);
    console.log('Regex test result:', phoneRegex.test(tempContact));

    // For guest users or logged-in users changing the number, validate 10 digits
    if (!phoneRegex.test(tempContact)) {
      showNotification('Contact number must be exactly 10 digits.', 'error');
      return;
    }

    // If validation passes, update userContact
    setUserContact(tempContact);
    showNotification('Contact number updated successfully!', 'success');
  };

  // Calculate subtotal
  const calculateSubtotal = () => {
    if (!cart || cart.length === 0) return 0;
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // Calculate delivery charge
  const deliveryCharge = 2.50;

  // Calculate loyalty points earned for this order
  const loyaltyPointsEarned = calculateSubtotal() * 0.1;

  // Calculate total
  const calculateTotal = () => {
    let total = calculateSubtotal() + deliveryCharge;
    if (useLoyaltyPoints && userData?.loyaltyPoints > 0) {
      // Apply loyalty points, but not more than the total
      total = Math.max(0, total - userData.loyaltyPoints);
    }
    return total;
  };

  // Helper to format currency
  const formatCurrency = (amount) => {
    // Convert to integer to remove decimals, then to string
    const amountStr = Math.floor(amount).toString();
    // Use regex to add dot as thousand separator
    const formattedAmount = amountStr.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return `${formattedAmount} vnd`;
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
    if (!userAddress) {
      showNotification('Please provide delivery address', 'error');
      return;
    }
    console.log('Validating userContact before payment:', userContact);
    if (!userContact || userContact.trim() === '') {
      showNotification('Please provide a valid contact number', 'error');
      return;
    }

    // If payment method is cash, proceed with order
    if (selectedPaymentMethod === 'cash') {
      await processOrder();
      return;
    }

    // For online payments, show QR code modal
    setShowPaymentModal(true);
  };

  // Process order after payment confirmation
  const processOrder = async () => {
    try {
      setIsProcessingPayment(true);
      console.log('Attempting to process order...');
      
      // Prepare order data
      const orderData = {
        items: cart.map(item => ({
          id: item.id,
          quantity: item.quantity,
          price: item.price
        })),
        delivery_address: formatAddressForDB(userAddress),
        delivery_distance: 5, // This should be calculated based on actual distance
        delivery_charge: deliveryCharge,
        payment_method: selectedPaymentMethod,
        status: 'Pending',
        loyalty_points_used: useLoyaltyPoints ? userData?.loyaltyPoints : 0,
        loyalty_points_earned: Math.floor(calculateSubtotal() * 0.1) // 10% of subtotal
      };

      // Create order
      const response = await fetch('http://localhost:3001/api/orders/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(orderData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create order');
      }

      console.log('Order API call successful. Response data:', data);

      // If order is successful, refresh user data to update loyalty points
      if (data.success) {
        // Fetch updated user profile
        const profileResponse = await fetch('http://localhost:3001/api/users/profile', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          if (profileData.success) {
            // Update userData in localStorage and context
            localStorage.setItem('userData', JSON.stringify(profileData.user));
            // Update the userData in the auth context
            const event = new CustomEvent('userDataUpdated', { 
              detail: { userData: profileData.user } 
            });
            window.dispatchEvent(event);
          }
        }
      }

      // Show success message
      showNotification('Order placed successfully!', 'success');

      // Close payment modal and show confirmation modal
      setShowPaymentModal(false);
      setShowConfirmationModal(true);

    } catch (error) {
      console.error('Error processing order:', error);
      console.log('Caught error in processOrder:', error.message);
      showNotification(error.message || 'Error processing order', 'error');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // Function to show general notification (like success/info)
  const showNotification = (message, type) => {
    console.log(`Showing notification: ${message} (${type})`);
    setNotification({ message, type });
    // Auto-hide notification after 3 seconds
    setTimeout(() => {
      setNotification(null);
    }, 3500);
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
            </div>
            <div className="section-content">
              <input
                type="tel"
                className="edit-input"
                value={tempContact}
                onChange={(e) => setTempContact(e.target.value)}
                onBlur={handleContactEdit}
                onFocus={() => setNotification(null)}
                placeholder="Enter your contact number"
              />
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
                    {formatCurrency(((item.price || 0) * (item.quantity || 1)))}
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
                <span>{formatCurrency(calculateSubtotal())}</span>
              </div>
              <div className="summary-row">
                <span>Delivery Charge:</span>
                <span>{formatCurrency(deliveryCharge)}</span>
              </div>
              <div className="summary-row loyalty">
                <span>Loyalty points:</span>
                <span>+ {Math.floor(loyaltyPointsEarned)}</span>
              </div>
              <div className="summary-row discount">
                <span>Discount:</span>
                <span>{useLoyaltyPoints && userData?.loyaltyPoints > 0 ? formatCurrency(Math.min(calculateSubtotal() + deliveryCharge, userData.loyaltyPoints)) : '-'}</span>
              </div>
              
              <div className="summary-divider"></div>
              
              <div className="summary-row total">
                <span>Total:</span>
                <span>{formatCurrency(calculateTotal())}</span>
              </div>
              {userData?.loyaltyPoints > 0 && (
                <div className="summary-row loyalty-exchange">
                  <label>
                    <input 
                      type="checkbox"
                      checked={useLoyaltyPoints}
                      onChange={(e) => setUseLoyaltyPoints(e.target.checked)}
                    />
                    Use {Math.floor(userData.loyaltyPoints)} available loyalty points
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Payment Method Section */}
          <div className="checkout-section">
            <div className="section-header">
              <span className="section-label">Payment Method</span>
            </div>
            <div className="payment-methods">
              <div className="payment-method">
                <input
                  type="radio"
                  id="cash"
                  name="paymentMethod"
                  value="cash"
                  checked={selectedPaymentMethod === 'cash'}
                  onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                />
                <label htmlFor="cash">Cash on Delivery</label>
              </div>
              <div className="payment-method">
                <input
                  type="radio"
                  id="momo"
                  name="paymentMethod"
                  value="momo"
                  checked={selectedPaymentMethod === 'momo'}
                  onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                />
                <label htmlFor="momo">MoMo Wallet</label>
              </div>
              <div className="payment-method">
                <input
                  type="radio"
                  id="vietcombank"
                  name="paymentMethod"
                  value="vietcombank"
                  checked={selectedPaymentMethod === 'vietcombank'}
                  onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                />
                <label htmlFor="vietcombank">Vietcombank</label>
              </div>
            </div>
          </div>

          {/* Payment Button */}
          <button 
            className="payment-btn" 
            onClick={handlePayment}
            disabled={isSubmitting || isProcessingPayment}
          >
            {isSubmitting ? 'Processing...' : isProcessingPayment ? 'Redirecting to Payment...' : 'Place Order'}
          </button>
        </div>

        {/* Payment Modal */}
        {showPaymentModal && (
          <div className="payment-modal-overlay">
            <div className="payment-modal">
              <div className="payment-modal-header">
                <h3>Complete Your Payment</h3>
                <button 
                  className="close-modal-btn"
                  onClick={() => setShowPaymentModal(false)}
                >
                  ✕
                </button>
              </div>
              <div className="payment-modal-content">
                <div className="qr-code-container">
                  {selectedPaymentMethod === 'momo' ? (
                    <>
                      <img 
                        src="/assets/MomoQR.jpg" 
                        alt="MoMo QR Code" 
                        className="qr-code"
                      />
                      <p>Scan this QR code with your MoMo app to complete the payment</p>
                    </>
                  ) : (
                    <>
                      <img 
                        src="/assets/VCBQR.jpg" 
                        alt="Vietcombank QR Code" 
                        className="qr-code"
                      />
                      <p>Scan this QR code with your Vietcombank app to complete the payment</p>
                    </>
                  )}
                </div>
                <div className="payment-amount">
                  <p>Amount to pay:</p>
                  <h4>{formatCurrency(calculateTotal())}</h4>
                </div>
                <button 
                  className="confirm-payment-btn"
                  onClick={processOrder}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Processing...' : 'Confirm Payment'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Notification Display */}
        {notification && (
          <div className={`notification ${notification.type}`}>
            {notification.message}
          </div>
        )}
      </div>

      {/* Order Confirmation Modal */}
      {showConfirmationModal && (
        <div className="payment-modal-overlay">
          <div className="payment-modal">
            <div className="payment-modal-header">
              <h3>Order Placed!</h3>
            </div>
            <div className="payment-modal-content">
              <p>Your order has been placed successfully.</p>
              <button 
                className="payment-btn"
                onClick={() => {
                  setShowConfirmationModal(false);
                  setCart([]);
                  localStorage.removeItem('cart');
                  navigate('/menu');
                }}
              >
                Back to Menu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Checkout;