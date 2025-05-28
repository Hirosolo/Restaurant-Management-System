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
  const [address, setAddress] = useState(null);

  const updateUserInfo = (field, value) => {
    setUserInfo(prev => {
      const newState = { ...prev, [field]: value };
      
      if (field === 'password') {
        console.log('Password field updated:', { 
          valueReceived: value, 
          currentStateAfterUpdate: {
            ...newState,
            password: newState.password // Show actual password
          }
        });
      } else {
        console.log('Form field updated:', { 
          field, 
          value: field === 'password' ? '***' : value, 
          currentState: {
            ...newState,
            password: newState.password ? '***' : undefined
          }
        });
      }
      
      return newState;
    });
  };

  const handleAddressSubmit = (e, addressData) => {
    e.preventDefault();
    console.log('Address form submitted:', addressData);
    setAddress(addressData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Main form submitted with user info:', {
      ...userInfo,
      password: userInfo.password // Show actual password
    });
    
    if (!address) {
      setError('Please fill in your address first');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      // Add detailed logging for password validation
      console.log('Password validation check:', {
        passwordExists: !!userInfo.password,
        passwordLength: userInfo.password ? userInfo.password.length : 0,
        passwordValue: userInfo.password ? '***' : undefined
      });

      // Validate required fields
      if (!userInfo.password) {
        console.error('CreateAccountForm: Password validation failed - password is empty');
        throw new Error('Password is required');
      }

      if (!userInfo.email) {
        console.error('CreateAccountForm: Email validation failed');
        throw new Error('Email is required');
      }

      if (!userInfo.firstName || !userInfo.lastName) {
        console.error('CreateAccountForm: Name validation failed');
        throw new Error('First name and last name are required');
      }

      if (!userInfo.contactMobile) {
        console.error('CreateAccountForm: Contact validation failed');
        throw new Error('Contact mobile is required');
      }
      
      console.log('CreateAccountForm: All validations passed, proceeding with account creation');
      
      // Create account with all user info including password
      // const userData = {
      //   ...userInfo,
      //   password: userInfo.password // Ensure password is included
      // };

      console.log('Sending user data to handleCreateAccount:', {
        // ...userData,
        email: userInfo.email,
        password: userInfo.password,
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
        contactMobile: userInfo.contactMobile,
        address: address
        // password: '***' // Hide password in logs
      });

      // Pass individual user info fields including password explicitly
      await handleCreateAccount(address, {
        email: userInfo.email,
        password: userInfo.password,
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
        contactMobile: userInfo.contactMobile,
      });
      
      console.log('CreateAccountForm: Account creation successful');
      
      // Notify about successful authentication
      onAuthSuccess('signedIn');
      
      // Add item to cart if exists
      if (tempItemToAdd) {
        console.log('CreateAccountForm: Adding item to cart after account creation', tempItemToAdd);
        addToCart(tempItemToAdd);
        
        // Emit event to notify other components
        const event = new CustomEvent('cartUpdated', { 
          detail: { action: 'add', item: tempItemToAdd } 
        });
        window.dispatchEvent(event);
        
        setTempItemToAdd(null);
      }
      
      // Close form
      setShowCreateAccountForm(false);
    } catch (err) {
      setError(err.message || 'Failed to create account. Please try again.');
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
        
        <form onSubmit={handleSubmit}>
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
          <AddressForm onSubmit={handleAddressSubmit} disabled={loading} showDeliveryInstructions={false} />
          
          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateAccountForm;