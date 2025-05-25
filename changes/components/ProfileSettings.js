import React, { useState, useEffect } from 'react';
import AddressForm from './AddressForm';
import styles from '../styles/ProfileSettings.module.css';

function ProfileSettings({ userData, userAddress, showAddNewAddress, setShowAddNewAddress }) {
  const [userProfile, setUserProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    contactNumber: '',
    addresses: []
  });

  // Cập nhật userProfile từ userData khi có dữ liệu
  useEffect(() => {
    if (userData) {
      setUserProfile(prev => ({
        ...prev,
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        email: userData.email || '',
        contactNumber: userData.contactMobile || '',
        addresses: userAddress || []
      }));
    }
  }, [userData, userAddress]);

  // Handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserProfile({
      ...userProfile,
      [name]: value
    });
  };

  const handleAddNewAddress = () => {
    setShowAddNewAddress(true);
  };

  const handleSetAsDefaultAddress = () => {
    alert("Address set as default");
    // Implement setting address as default
  };

  const handleSaveAddress = (e, newAddress) => {
    // Save the new address
    const updatedUserProfile = { ...userProfile };
    updatedUserProfile.addresses = [...(updatedUserProfile.addresses || []), newAddress];
    setUserProfile(updatedUserProfile);
    
    // Ẩn form sau khi lưu
    setShowAddNewAddress(false);
  };

  return (
    <div className={styles.accountSection}>
      <h2>Profile Settings</h2>
      {!showAddNewAddress ? (
        <div className={styles.profileSettingsForm}>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>First Name</label>
              <input 
                type="text" 
                name="firstName" 
                value={userProfile.firstName} 
                onChange={handleInputChange}
                placeholder="Enter your first name" 
              />
            </div>
            <div className={styles.formGroup}>
              <label>Last Name</label>
              <input 
                type="text" 
                name="lastName" 
                value={userProfile.lastName} 
                onChange={handleInputChange}
                placeholder="Enter your last name" 
              />
            </div>
          </div>
          
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Email</label>
              <input 
                type="email" 
                name="email" 
                value={userProfile.email} 
                onChange={handleInputChange}
                placeholder="Enter your email" 
              />
            </div>
            <div className={styles.formGroup}>
              <label>Contact Number</label>
              <input 
                type="tel" 
                name="contactNumber" 
                value={userProfile.contactNumber} 
                onChange={handleInputChange}
                placeholder="Enter your contact number" 
              />
            </div>
          </div>
          
          <div className={styles.addressSection}>
            <label>Address</label>
            <div className={styles.addressDisplayBox}>
              {userProfile.addresses && userProfile.addresses.length > 0 ? (
                <div className={styles.savedAddress}>
                  {/* Display first address */}
                  <p>{userProfile.addresses[0].street}, {userProfile.addresses[0].houseNumber}</p>
                  <p>{userProfile.addresses[0].district}, {userProfile.addresses[0].ward}</p>
                  {userProfile.addresses[0].buildingName && <p>{userProfile.addresses[0].buildingName}</p>}
                </div>
              ) : (
                <p>No addresses saved</p>
              )}
            </div>
            <div className={styles.addressActions}>
              <button className={styles.setDefaultBtn} onClick={handleSetAsDefaultAddress}>Set as default address</button>
              <button className={styles.addAddressBtn} onClick={handleAddNewAddress}>+ Add New Address</button>
            </div>
          </div>
        </div>
      ) : (
        <AddressForm onSubmit={handleSaveAddress} />
      )}
    </div>
  );
}

export default ProfileSettings;