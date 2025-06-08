import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Delivery.css';
import Navbar from '../components/Navbar';

function Delivery({ cart, setCart, userAddress, setUserAddress }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [notification, setNotification] = useState(null);
  const navRef = useRef(null);
  const overlayRef = useRef(null);
  const navigate = useNavigate();

  // Form state
  const [ward, setWard] = useState('');
  const [district, setDistrict] = useState('');
  const [street, setStreet] = useState('');
  const [houseNumber, setHouseNumber] = useState('');
  const [buildingName, setBuildingName] = useState('');
  const [block, setBlock] = useState('');
  const [floor, setFloor] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [deliveryInstructions, setDeliveryInstructions] = useState('');
  const [deliveryNote, setDeliveryNote] = useState('');

  // Dropdown state
  const [wardDropdownOpen, setWardDropdownOpen] = useState(false);
  const [districtDropdownOpen, setDistrictDropdownOpen] = useState(false);
  const [streetDropdownOpen, setStreetDropdownOpen] = useState(false);

  // Sample data for dropdowns
  const wards = ['Ward 1', 'Ward 2', 'Ward 3', 'Ward 4', 'Ward 5'];
  const districts = ['District 1', 'District 2', 'District 3', 'District 4', 'District 5'];
  const streets = ['Street 1', 'Street 2', 'Street 3', 'Street 4', 'Street 5'];

  // Show notification
  const showNotification = (message, type = 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Toggle menu
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!ward || !district || !street || !houseNumber) {
      // Find the first empty required field and focus it
      if (!ward) {
        document.querySelector('select[name="ward"]')?.focus();
        showNotification('Please select a ward', 'error');
      } else if (!district) {
        document.querySelector('select[name="district"]')?.focus();
        showNotification('Please select a district', 'error');
      } else if (!street) {
        document.querySelector('select[name="street"]')?.focus();
        showNotification('Please select a street', 'error');
      } else if (!houseNumber) {
        document.querySelector('input[name="houseNumber"]')?.focus();
        showNotification('Please enter a house/street number', 'error');
      }
      return;
    }
    
    // Save address information as an object for the UI
    const addressInfo = {
      ward,
      district,
      street,
      houseNumber,
      buildingName,
      block,
      floor,
      roomNumber,
      deliveryInstructions
    };
    
    // Format address as a single string for the database
    const addressParts = [];
    
    // Required fields
    if (houseNumber) addressParts.push(houseNumber);
    if (street) addressParts.push(street);
    if (ward) addressParts.push(ward);
    if (district) addressParts.push(district);
    
    // Optional fields
    if (buildingName) addressParts.push(`Building: ${buildingName}`);
    if (block) addressParts.push(`Block ${block}`);
    if (floor) addressParts.push(`Floor ${floor}`);
    if (roomNumber) addressParts.push(`Room ${roomNumber}`);
    
    const formattedAddress = addressParts.join(', ');
    
    // Save both the object (for UI) and string (for DB) versions
    const finalAddress = {
      ...addressInfo,
      formattedAddress,
      delivery_note: deliveryNote
    };
    
    console.log('Saving address:', finalAddress);
    setUserAddress(finalAddress);
    
    // Save address to localStorage for guest users
    localStorage.setItem('userAddress', JSON.stringify(finalAddress));
    
    // Show success notification
    showNotification('Delivery address saved successfully!', 'success');
    
    // Navigate to checkout page
    navigate('/checkout');
  };

  return (
    <div className="delivery-page">
      {/* Notification */}
      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}

      {/* Navbar like Menu Page */}
      <div className="navbar menu-navbar">
        <div className={`menu-icon ${menuOpen ? 'open' : ''}`} onClick={toggleMenu}>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
        </div>
        <div className="mobile-logo">
          <img src="/assets/logo.png" alt="Logo" className="logo" />
        </div>
        <div className={`overlay ${menuOpen ? 'active' : ''}`} ref={overlayRef} onClick={toggleMenu}></div>
        <div className={`nav-links ${menuOpen ? 'active' : ''}`} ref={navRef}>
          <div className="close-btn" onClick={toggleMenu}>✕</div>
          <a href="/">Home</a>
          <a href="/menu">Menu</a>
          <img src="/assets/logo.png" alt="Logo" className="logo" />
          <a href="/discount">Discount</a>
          <a href="/support">Support</a>
        </div>
      </div>

      {/* Delivery Form Container */}
      <div className="delivery-container">
        <h2>DELIVERY ADDRESS</h2>
        
        <form onSubmit={handleSubmit} noValidate>
          <div className="delivery-form">
            <div className="delivery-row">
              <div className="delivery-field">
                <label>*Ward:</label>
                <div className="custom-select">
                  <select 
                    name="ward"
                    value={ward}
                    onChange={(e) => setWard(e.target.value)}
                    required
                    className="select-header"
                  >
                    <option value="">We only deliver to the wards in this list</option>
                    {wards.map((item, index) => (
                      <option key={index} value={item}>{item}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="delivery-field">
                <label>*District:</label>
                <div className="custom-select">
                  <select 
                    name="district"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    required
                    className="select-header"
                  >
                    <option value="">We only deliver to the districts in this list</option>
                    {districts.map((item, index) => (
                      <option key={index} value={item}>{item}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            
            <div className="delivery-row">
              <div className="delivery-field">
                <label>*Street:</label>
                <div className="custom-select">
                  <select 
                    name="street"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    required
                    className="select-header"
                  >
                    <option value="">We only deliver to the streets in this list</option>
                    {streets.map((item, index) => (
                      <option key={index} value={item}>{item}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="delivery-field">
                <label>*House/Street Number:</label>
                <input 
                  name="houseNumber"
                  type="text" 
                  value={houseNumber}
                  onChange={(e) => setHouseNumber(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="delivery-field single-row">
              <label>Building Name:</label>
              <input 
                type="text" 
                value={buildingName}
                onChange={(e) => setBuildingName(e.target.value)}
              />
            </div>
            
            <div className="delivery-row three-column">
              <div className="delivery-field">
                <label>Block:</label>
                <input 
                  type="text" 
                  value={block}
                  onChange={(e) => setBlock(e.target.value)}
                />
              </div>
              
              <div className="delivery-field">
                <label>Floor / Level:</label>
                <input 
                  type="text" 
                  value={floor}
                  onChange={(e) => setFloor(e.target.value)}
                />
              </div>
              
              <div className="delivery-field">
                <label>Room Number / Company Name:</label>
                <input 
                  type="text" 
                  value={roomNumber}
                  onChange={(e) => setRoomNumber(e.target.value)}
                />
              </div>
            </div>
            
            <div className="delivery-field single-row">
              <label>Note for Delivery:</label>
              <textarea 
                value={deliveryNote}
                onChange={(e) => setDeliveryNote(e.target.value)}
                rows={3}
                placeholder="Add any special instructions for the rider"
              />
            </div>
            <div className="delivery-field single-row">
              <label>Delivery Instruction to Rider:</label>
              <textarea 
                value={deliveryInstructions}
                onChange={(e) => setDeliveryInstructions(e.target.value)}
                rows={5}
              />
            </div>
          </div>
          
          <button type="submit" className="confirm-address-btn">
            CONFIRM DELIVERY ADDRESS
          </button>
        </form>
      </div>
    </div>
  );
}

export default Delivery;