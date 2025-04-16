import React, { useState, useRef, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import './Delivery.css';

function Delivery() {
  const { cart, setCart, userAddress, setUserAddress, authStatus } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
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

  // Dropdown state
  const [wardDropdownOpen, setWardDropdownOpen] = useState(false);
  const [districtDropdownOpen, setDistrictDropdownOpen] = useState(false);
  const [streetDropdownOpen, setStreetDropdownOpen] = useState(false);

  const wards = ['Ward 1', 'Ward 2', 'Ward 3', 'Ward 4', 'Ward 5'];
  const districts = ['District 1', 'District 2', 'District 3', 'District 4', 'District 5'];
  const streets = ['Street 1', 'Street 2', 'Street 3', 'Street 4', 'Street 5'];

  // Fetch address for logged-in users
  useEffect(() => {
    if (authStatus === 'signedIn') {
      const fetchAddress = async () => {
        try {
          const token = localStorage.getItem('token'); // Assuming JWT token is stored in localStorage
          const response = await fetch('http://localhost:5000/api/customer/address', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
          if (response.ok) {
            const data = await response.json();
            setWard(data.ward || '');
            setDistrict(data.district || '');
            setStreet(data.street || '');
            setHouseNumber(data.house_number || '');
            setBuildingName(data.building_name || '');
            setBlock(data.block || '');
            setFloor(data.floor || '');
            setRoomNumber(data.room_number || '');
            setDeliveryInstructions(data.delivery_instructions || '');
          } else {
            console.error('Failed to fetch address');
          }
        } catch (error) {
          console.error('Error fetching address:', error);
        }
      };
      fetchAddress();
    }
  }, [authStatus]);

  // If userAddress exists (e.g., from guest input), prefill the form
  useEffect(() => {
    if (userAddress) {
      setWard(userAddress.ward || '');
      setDistrict(userAddress.district || '');
      setStreet(userAddress.street || '');
      setHouseNumber(userAddress.houseNumber || '');
      setBuildingName(userAddress.buildingName || '');
      setBlock(userAddress.block || '');
      setFloor(userAddress.floor || '');
      setRoomNumber(userAddress.roomNumber || '');
      setDeliveryInstructions(userAddress.deliveryInstructions || '');
    }
  }, [userAddress]);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
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
    
    setUserAddress(addressInfo);
    navigate('/checkout');
  };

  return (
    <div className="delivery-page">
      <div className="navbar menu-navbar">
        <div className={`menu-icon ${menuOpen ? 'open' : ''}`} onClick={toggleMenu}>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
        </div>
        <div className="mobile-logo">
          <img src="/assets/logo.png" alt="Logo" className="logo" />
        </div>
        <div
          className={`overlay ${menuOpen ? 'active' : ''}`}
          ref={overlayRef}
          onClick={toggleMenu}
        ></div>
        <div
          className={`nav-links ${menuOpen ? 'active' : ''}`}
          ref={navRef}
        >
          <div className="close-btn" onClick={toggleMenu}>✕</div>
          <a href="#">Menu</a>
          <a href="#">Discount</a>
          <img src="/assets/logo.png" alt="Logo" className="logo" />
          <a href="#">Account</a>
          <a href="#">Support</a>
        </div>
      </div>

      <div className="user-nav">
        <div className="user-nav-container">
          <div className="user-nav-left">
            <span className="user-icon">👤</span>
            <span className="user-nav-item">Sign in</span>
            <span className="separator">|</span>
            <span className="user-nav-item">Guest Order</span>
            <span className="separator">|</span>
            <span className="user-nav-item">Track Your Order</span>
          </div>
        </div>
      </div>

      <div className="delivery-container">
        <h2>DELIVERY ADDRESS</h2>
        <form onSubmit={handleSubmit}>
          <div className="delivery-form">
            <div className="delivery-row">
              <div className="delivery-field">
                <label>*Ward:</label>
                <div className="custom-select">
                  <div 
                    className="select-header" 
                    onClick={() => setWardDropdownOpen(!wardDropdownOpen)}
                  >
                    {ward || "We only deliver to the wards in this list"}
                    <span className="dropdown-arrow">▼</span>
                  </div>
                  {wardDropdownOpen && (
                    <div className="select-options">
                      {wards.map((item, index) => (
                        <div 
                          key={index} 
                          className="select-option" 
                          onClick={() => {
                            setWard(item);
                            setWardDropdownOpen(false);
                          }}
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="delivery-field">
                <label>*District:</label>
                <div className="custom-select">
                  <div 
                    className="select-header" 
                    onClick={() => setDistrictDropdownOpen(!districtDropdownOpen)}
                  >
                    {district || "We only deliver to the districts in this list"}
                    <span className="dropdown-arrow">▼</span>
                  </div>
                  {districtDropdownOpen && (
                    <div className="select-options">
                      {districts.map((item, index) => (
                        <div 
                          key={index} 
                          className="select-option" 
                          onClick={() => {
                            setDistrict(item);
                            setDistrictDropdownOpen(false);
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
            <div className="delivery-row">
              <div className="delivery-field">
                <label>*Street:</label>
                <div className="custom-select">
                  <div 
                    className="select-header" 
                    onClick={() => setStreetDropdownOpen(!streetDropdownOpen)}
                  >
                    {street || "We only deliver to the streets in this list"}
                    <span className="dropdown-arrow">▼</span>
                  </div>
                  {streetDropdownOpen && (
                    <div className="select-options">
                      {streets.map((item, index) => (
                        <div 
                          key={index} 
                          className="select-option" 
                          onClick={() => {
                            setStreet(item);
                            setStreetDropdownOpen(false);
                          }}
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="delivery-field">
                <label>*House/Street Number:</label>
                <input 
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