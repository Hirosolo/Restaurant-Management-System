import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useAddress } from '../hooks/useAddress';
import styles from '../styles/CreateAccountForm.module.css';
import addressStyles from '../styles/AddressForm.module.css';

function CreateAccountForm({ 
  setShowCreateAccountForm, 
  tempItemToAdd, 
  setTempItemToAdd,
  onAuthSuccess = () => {},
  showNotification
}) {
  const { handleCreateAccount, handleSignIn } = useAuth();
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
  const [buildingNameBlurred, setBuildingNameBlurred] = useState(false);
  const { address, updateAddressField, dropdownOpen, toggleDropdown, addressOptions } = useAddress();

  // Override addressOptions to match Delivery page
  addressOptions.wards = ['Ward 1', 'Ward 2', 'Ward 3', 'Ward 4', 'Ward 5'];
  addressOptions.districts = ['District 1', 'District 2', 'District 3', 'District 4', 'District 5'];
  addressOptions.streets = ['Street 1', 'Street 2', 'Street 3', 'Street 4', 'Street 5'];

  const updateUserInfo = (field, value) => {
    setUserInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate all user info fields before proceeding
    if (!userInfo.email) {
      setError('Email is required');
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(userInfo.email)) {
      setError('Email must be a valid email address');
      return;
    }
    if (!userInfo.password) {
      setError('Password is required');
      return;
    }
    if (!userInfo.firstName || !userInfo.lastName) {
      setError('First name and last name are required');
      return;
    }
    if (!/^[A-Za-z]+$/.test(userInfo.firstName)) {
      setError('First name must contain letters only');
      return;
    }
    if (!/^[A-Za-z]+$/.test(userInfo.lastName)) {
      setError('Last name must contain letters only');
      return;
    }
    if (!userInfo.contactMobile) {
      setError('Contact mobile is required');
      return;
    }
    if (!/^0\d{9}$/.test(userInfo.contactMobile)) {
      setError('Contact mobile must start with 0 and be exactly 10 digits');
      return;
    }
    if (!address.ward || !address.district || !address.street || !address.houseNumber) {
      setError('Ward, District, Street, and House/Street Number are required');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await handleCreateAccount(address, {
        email: userInfo.email,
        password: userInfo.password,
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
        contactMobile: userInfo.contactMobile,
      });
      // Automatically sign in the user after account creation
      await handleSignIn(userInfo.email, userInfo.password);
      if (showNotification) showNotification('Account created! You are now signed in.', 'success');
      setTimeout(() => {
        setShowCreateAccountForm(false);
      }, 100); // slight delay to ensure notification is visible
      onAuthSuccess('signedIn');
      if (tempItemToAdd) {
        addToCart(tempItemToAdd);
        setTempItemToAdd(null);
      }
    } catch (err) {
      setError(err.message || 'Failed to create account. Please try again.');
      if (showNotification) showNotification(err.message || 'Failed to create account. Please try again.', 'error');
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
                pattern="^0\d{9}$"
                title="Contact number must start with 0 and be exactly 10 digits"
                disabled={loading}
              />
            </div>
          </div>
          <div className={addressStyles.formSection}>
            <h4>Your Address</h4>
            <div className={addressStyles.deliveryRow}>
              <div className={addressStyles.deliveryField}>
                <label>*Ward:</label>
                <div className={addressStyles.customSelect}>
                  <div 
                    className={addressStyles.selectHeader} 
                    onClick={() => toggleDropdown('ward')}
                  >
                    {address.ward || "Select ward"}
                    <span className={addressStyles.dropdownArrow}>▼</span>
                  </div>
                  {dropdownOpen.ward && (
                    <div className={addressStyles.selectOptions}>
                      {addressOptions.wards.map((item, index) => (
                        <div 
                          key={index} 
                          className={addressStyles.selectOption} 
                          onClick={() => {
                            updateAddressField('ward', item);
                            toggleDropdown('ward');
                          }}
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className={addressStyles.deliveryField}>
                <label>*District:</label>
                <div className={addressStyles.customSelect}>
                  <div 
                    className={addressStyles.selectHeader} 
                    onClick={() => toggleDropdown('district')}
                  >
                    {address.district || "Select district"}
                    <span className={addressStyles.dropdownArrow}>▼</span>
                  </div>
                  {dropdownOpen.district && (
                    <div className={addressStyles.selectOptions}>
                      {addressOptions.districts.map((item, index) => (
                        <div 
                          key={index} 
                          className={addressStyles.selectOption} 
                          onClick={() => {
                            updateAddressField('district', item);
                            toggleDropdown('district');
                          }}
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className={addressStyles.deliveryRow}>
              <div className={addressStyles.deliveryField}>
                <label>*Street:</label>
                <div className={addressStyles.customSelect}>
                  <div 
                    className={addressStyles.selectHeader} 
                    onClick={() => toggleDropdown('street')}
                  >
                    {address.street || "Select street"}
                    <span className={addressStyles.dropdownArrow}>▼</span>
                  </div>
                  {dropdownOpen.street && (
                    <div className={addressStyles.selectOptions}>
                      {addressOptions.streets.map((item, index) => (
                        <div 
                          key={index} 
                          className={addressStyles.selectOption} 
                          onClick={() => {
                            updateAddressField('street', item);
                            toggleDropdown('street');
                          }}
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className={addressStyles.deliveryField}>
                <label>*House/Street Number:</label>
                <input 
                  type="text" 
                  value={address.houseNumber}
                  onChange={(e) => updateAddressField('houseNumber', e.target.value)}
                  required
                />
              </div>
            </div>
            <div className={styles.formGroup}>
              <label>Building Name:</label>
              <input 
                type="text" 
                value={address.buildingName}
                onChange={(e) => updateAddressField('buildingName', e.target.value)}
                onBlur={() => setBuildingNameBlurred(true)}
              />
            </div>
            {address.buildingName && buildingNameBlurred && (
              <div className={addressStyles.deliveryRowThree}>
                <div className={addressStyles.deliveryField}>
                  <label>Block:</label>
                  <input 
                    type="text" 
                    value={address.block}
                    onChange={(e) => updateAddressField('block', e.target.value)}
                  />
                </div>
                <div className={addressStyles.deliveryField}>
                  <label>Floor / Level:</label>
                  <input 
                    type="text" 
                    value={address.floor}
                    onChange={(e) => updateAddressField('floor', e.target.value)}
                  />
                </div>
                <div className={addressStyles.deliveryField}>
                  <label>Room Number / Company Name:</label>
                  <input 
                    type="text" 
                    value={address.roomNumber}
                    onChange={(e) => updateAddressField('roomNumber', e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>
          <button type="submit" className={addressStyles.submitBtn} disabled={loading}>
            {loading ? 'Creating Account...' : 'Confirm'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateAccountForm;
