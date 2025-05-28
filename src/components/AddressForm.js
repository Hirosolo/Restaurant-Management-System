import React from 'react';
import { useAddress } from '../hooks/useAddress';
import styles from '../styles/AddressForm.module.css';

/* Component form địa chỉ */
function AddressForm({ onSubmit, showDeliveryInstructions = false }) {
  const { address, updateAddressField, dropdownOpen, toggleDropdown, addressOptions } = useAddress();

  /* Xử lý gửi form */
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(e, address);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className={styles.formSection}>
        <h4>Your Address</h4>
        <div className={styles.deliveryRow}>
          <div className={styles.deliveryField}>
            <label>*Ward:</label>
            <div className={styles.customSelect}>
              <div 
                className={styles.selectHeader} 
                onClick={() => toggleDropdown('ward')}
              >
                {address.ward || "Select ward"}
                <span className={styles.dropdownArrow}>▼</span>
              </div>
              {dropdownOpen.ward && (
                <div className={styles.selectOptions}>
                  {addressOptions.wards.map((item, index) => (
                    <div 
                      key={index} 
                      className={styles.selectOption} 
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
          <div className={styles.deliveryField}>
            <label>*District:</label>
            <div className={styles.customSelect}>
              <div 
                className={styles.selectHeader} 
                onClick={() => toggleDropdown('district')}
              >
                {address.district || "Select district"}
                <span className={styles.dropdownArrow}>▼</span>
              </div>
              {dropdownOpen.district && (
                <div className={styles.selectOptions}>
                  {addressOptions.districts.map((item, index) => (
                    <div 
                      key={index} 
                      className={styles.selectOption} 
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
        <div className={styles.deliveryRow}>
          <div className={styles.deliveryField}>
            <label>*Street:</label>
            <div className={styles.customSelect}>
              <div 
                className={styles.selectHeader} 
                onClick={() => toggleDropdown('street')}
              >
                {address.street || "Select street"}
                <span className={styles.dropdownArrow}>▼</span>
              </div>
              {dropdownOpen.street && (
                <div className={styles.selectOptions}>
                  {addressOptions.streets.map((item, index) => (
                    <div 
                      key={index} 
                      className={styles.selectOption} 
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
          <div className={styles.deliveryField}>
            <label>*House/Street Number:</label>
            <input 
              type="text" 
              value={address.houseNumber}
              onChange={(e) => updateAddressField('houseNumber', e.target.value)}
              required
            />
          </div>
        </div>
        <div className={styles.deliveryFieldSingle}>
          <label>Building Name:</label>
          <input 
            type="text" 
            value={address.buildingName}
            onChange={(e) => updateAddressField('buildingName', e.target.value)}
          />
        </div>
        <div className={styles.deliveryRowThree}>
          <div className={styles.deliveryField}>
            <label>Block:</label>
            <input 
              type="text" 
              value={address.block}
              onChange={(e) => updateAddressField('block', e.target.value)}
            />
          </div>
          <div className={styles.deliveryField}>
            <label>Floor / Level:</label>
            <input 
              type="text" 
              value={address.floor}
              onChange={(e) => updateAddressField('floor', e.target.value)}
            />
          </div>
          <div className={styles.deliveryField}>
            <label>Room Number / Company Name:</label>
            <input 
              type="text" 
              value={address.roomNumber}
              onChange={(e) => updateAddressField('roomNumber', e.target.value)}
            />
          </div>
        </div>
        {showDeliveryInstructions && (
          <div className={styles.deliveryFieldSingle}>
            <label>Delivery Instruction to Rider:</label>
            <textarea 
              value={address.deliveryInstructions}
              onChange={(e) => updateAddressField('deliveryInstructions', e.target.value)}
              rows={3}
            />
          </div>
        )}
        <button type="submit" className={styles.submitBtn}>Confirm</button>
      </div>
    </form>
  );
}

export default AddressForm;