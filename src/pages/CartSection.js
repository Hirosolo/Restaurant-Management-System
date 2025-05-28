import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import './CartSection.css';

function CartSection() {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const { authStatus } = useAuth();
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    if (authStatus === 'signedIn') {
      navigate('/checkout');
    } else {
      setShowAuthModal(true);
    }
  };

  const handleAuthOption = (option) => {
    setShowAuthModal(false);
    switch (option) {
      case 'signin':
        navigate('/signin');
        break;
      case 'signup':
        navigate('/signup');
        break;
      case 'guest':
        navigate('/delivery');
        break;
      default:
        break;
    }
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <div className="cart-section">
      <h2>Your Cart</h2>
      {cart.length === 0 ? (
        <div className="empty-cart">
          <p>Your cart is empty</p>
          <button onClick={() => navigate('/menu')}>Go to Menu</button>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {cart.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="item-details">
                  <h3>{item.name}</h3>
                  <p>${item.price.toFixed(2)}</p>
                </div>
                <div className="item-quantity">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                </div>
                <button 
                  className="remove-item" 
                  onClick={() => removeFromCart(item.id)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <div className="cart-summary">
            <div className="total">
              <span>Total:</span>
              <span>${calculateTotal().toFixed(2)}</span>
            </div>
            <button className="checkout-button" onClick={handleCheckout}>
              Checkout
            </button>
          </div>
        </>
      )}

      {/* Authentication Modal */}
      {showAuthModal && (
        <div className="auth-modal-overlay">
          <div className="auth-modal">
            <h3>Choose an Option</h3>
            <div className="auth-options">
              <button 
                className="auth-button signin"
                onClick={() => handleAuthOption('signin')}
              >
                Sign In
              </button>
              <button 
                className="auth-button signup"
                onClick={() => handleAuthOption('signup')}
              >
                Create Account
              </button>
              <button 
                className="auth-button guest"
                onClick={() => handleAuthOption('guest')}
              >
                Continue as Guest
              </button>
            </div>
            <button 
              className="close-modal"
              onClick={() => setShowAuthModal(false)}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CartSection; 