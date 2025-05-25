import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import AddressForm from './AddressForm';
import styles from '../styles/CreateAccountForm.module.css';

function CreateAccountForm({ 
  setShowCreateAccountForm, 
  tempItemToAdd, 
  setTempItemToAdd,
  onAuthSuccess = () => {}
}) {
  const { handleCreateAccount } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    contactMobile: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const updateUserInfo = (field, value) => {
    setUserInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e, address) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      console.log('CreateAccountForm: Attempting to create account', { email: userInfo.email });
      
      // Tạo tài khoản và không chuyển hướng
      await handleCreateAccount(address, userInfo, false);
      
      console.log('CreateAccountForm: Account creation successful');
      
      // Thông báo về sự thành công của xác thực
      onAuthSuccess('signedIn');
      
      // Thêm sản phẩm vào giỏ hàng nếu có
      if (tempItemToAdd) {
        console.log('CreateAccountForm: Adding item to cart after account creation', tempItemToAdd);
        addToCart(tempItemToAdd);
        
        // Phát ra sự kiện để thông báo cho các component khác
        const event = new CustomEvent('cartUpdated', { 
          detail: { action: 'add', item: tempItemToAdd } 
        });
        window.dispatchEvent(event);
        
        setTempItemToAdd(null);
      }
      
      // Đóng form
      setShowCreateAccountForm(false);
    } catch (err) {
      setError('Failed to create account. Please try again.');
      console.error('CreateAccountForm: Account creation error', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.formModal}>
        <h3>Create New Account</h3>
        <button 
          className={styles.closeBtn} 
          onClick={() => setShowCreateAccountForm(false)}
        >
          ✕
        </button>
        
        {error && <div className={styles.errorMessage}>{error}</div>}
        
        <form onSubmit={(e) => handleSubmit(e, userInfo)}>
          <div className={styles.formSection}>
            <div className={styles.formGroup}>
              <label>Email</label>
              <input 
                type="email" 
                value={userInfo.email} 
                onChange={(e) => updateUserInfo('email', e.target.value)} 
                required 
                disabled={loading}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Password</label>
              <input 
                type="password" 
                value={userInfo.password} 
                onChange={(e) => updateUserInfo('password', e.target.value)} 
                required 
                disabled={loading}
              />
            </div>
          </div>
          <div className={styles.formSection}>
            <h4>About you</h4>
            <div className={styles.formGroup}>
              <label>First Name</label>
              <input 
                type="text" 
                value={userInfo.firstName} 
                onChange={(e) => updateUserInfo('firstName', e.target.value)} 
                required 
                disabled={loading}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Last Name</label>
              <input 
                type="text" 
                value={userInfo.lastName} 
                onChange={(e) => updateUserInfo('lastName', e.target.value)} 
                required 
                disabled={loading}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Contact Mobile</label>
              <input 
                type="tel" 
                value={userInfo.contactMobile} 
                onChange={(e) => updateUserInfo('contactMobile', e.target.value)} 
                required 
                disabled={loading}
              />
            </div>
          </div>
          <AddressForm onSubmit={handleSubmit} disabled={loading} />
          
          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateAccountForm;