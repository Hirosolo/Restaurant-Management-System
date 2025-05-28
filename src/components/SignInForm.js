import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import styles from '../styles/SignInForm.module.css';

function SignInForm({ 
  setShowSignInForm, 
  tempItemToAdd, 
  setTempItemToAdd,
  onAuthSuccess = () => {}
}) {
  const { handleSignIn } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const updateCredentials = (field, value) => {
    setCredentials(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      console.log('SignInForm: Attempting to sign in', { email: credentials.email });
      
      // Đăng nhập và không chuyển hướng
      await handleSignIn(credentials.email, credentials.password, false);
      
      console.log('SignInForm: Sign-in successful');
      
      // Thông báo về sự thành công của xác thực
      onAuthSuccess('signedIn');
      
      // Thêm sản phẩm vào giỏ hàng nếu có
      if (tempItemToAdd) {
        console.log('SignInForm: Adding item to cart after login', tempItemToAdd);
        addToCart(tempItemToAdd);
        
        // Phát ra sự kiện để thông báo cho các component khác
        const event = new CustomEvent('cartUpdated', { 
          detail: { action: 'add', item: tempItemToAdd } 
        });
        window.dispatchEvent(event);
        
        setTempItemToAdd(null);
      }
      // Đóng form
      setShowSignInForm(false);
    } catch (err) {
      console.error('SignInForm: Sign in error:', err);
      setError(err.message || 'Failed to sign in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.formModal}>
        <h3>Sign In</h3>
        <button 
          className={styles.closeBtn}
          onClick={() => setShowSignInForm(false)}
        >
          ✕
        </button>
        
        {error && <div className={styles.errorMessage}>{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>Email</label>
            <input 
              type="email" 
              value={credentials.email}
              onChange={(e) => updateCredentials('email', e.target.value)}
              required 
              disabled={loading}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Password</label>
            <input 
              type="password" 
              value={credentials.password}
              onChange={(e) => updateCredentials('password', e.target.value)}
              required 
              disabled={loading}
            />
          </div>
          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default SignInForm;