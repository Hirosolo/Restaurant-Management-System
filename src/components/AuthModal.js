import React from 'react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import styles from '../styles/AuthModal.module.css';

function AuthModal({ 
  setShowAuthModal, 
  setShowSignInForm, 
  setShowCreateAccountForm, 
  tempItemToAdd, 
  setTempItemToAdd,
  onAuthSuccess = () => {}
}) {
  const { continueAsGuest } = useAuth();
  const { addToCart } = useCart();

  /* Xử lý tiếp tục với tư cách khách */
  const handleContinueAsGuest = () => {
    console.log('AuthModal: Continuing as guest');
    continueAsGuest();
    
    // Thông báo về sự thành công của xác thực
    onAuthSuccess('guest');
    
    // Thêm món ăn vào giỏ hàng nếu có
    if (tempItemToAdd) {
      console.log('AuthModal: Adding item to cart as guest', tempItemToAdd);
      addToCart(tempItemToAdd);
      
      // Phát ra sự kiện để thông báo cho các component khác
      const event = new CustomEvent('cartUpdated', { 
        detail: { action: 'add', item: tempItemToAdd } 
      });
      window.dispatchEvent(event);
      
      setTempItemToAdd(null);
    }
    
    setShowAuthModal(false);
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Welcome to GREEDIBLE</h2>
          <p className={styles.modalSubtitle}>Sign in or create an account to enjoy our healthy, delicious meals</p>
          <button 
            className={styles.closeBtn}
            onClick={() => setShowAuthModal(false)}
          >
            &times;
          </button>
        </div>

        <div className={styles.optionsContainer}>
          <div className={styles.authOption} onClick={() => {
            setShowSignInForm(true);
            setShowAuthModal(false);
          }}>
            <div className={styles.optionIcon}>
              <i className="fas fa-sign-in-alt"></i>
            </div>
            <div className={styles.optionContent}>
              <h3>Sign In</h3>
              <p>Already have an account? Sign in to access your orders and favorites</p>
            </div>
          </div>

          <div className={styles.authOption} onClick={() => {
            setShowCreateAccountForm(true);
            setShowAuthModal(false);
          }}>
            <div className={styles.optionIcon}>
              <i className="fas fa-user-plus"></i>
            </div>
            <div className={styles.optionContent}>
              <h3>Create Account</h3>
              <p>New to GREEDIBLE? Create an account to start your healthy journey</p>
            </div>
          </div>
        </div>

        <div className={styles.guestOptionContainer}>
          <button 
            className={styles.guestButton}
            onClick={handleContinueAsGuest}
          >
            Continue as Guest
          </button>
          <p className={styles.guestNote}>You can create an account later</p>
        </div>
      </div>
    </div>
  );
}

export default AuthModal;