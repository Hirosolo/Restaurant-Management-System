import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Account.css';

function Account({ 
  authStatus: propAuthStatus, 
  setAuthStatus: setPropAuthStatus,
  userAddress: propUserAddress,
  setUserAddress: setPropUserAddress 
}) {
  const navigate = useNavigate();
  const [authStatus, setAuthStatus] = useState('guest');
  const [userAddress, setUserAddress] = useState(null);
  const [activeTab, setActiveTab] = useState('account');
  const [menuOpen, setMenuOpen] = useState(false);
  const [showAddNewAddress, setShowAddNewAddress] = useState(false);
  const [favoriteOrders, setFavoriteOrders] = useState([
    {
      id: 1,
      name: 'Chicken Noodle Soup',
      price: '26.10$',
      image: '/assets/RCP-001.jpg',
      isFavorite: true
    },
    {
      id: 2,
      name: 'Chicken Noodle Soup',
      price: '26.10$',
      image: '/assets/RCP-001.jpg',
      isFavorite: true
    },
    {
      id: 3,
      name: 'Chicken Noodle Soup',
      price: '26.10$',
      image: '/assets/RCP-001.jpg',
      isFavorite: true
    },
    {
      id: 4,
      name: 'Chicken Noodle Soup',
      price: '26.10$',
      image: '/assets/RCP-001.jpg',
      isFavorite: true
    }
  ]);
  
  const [orderHistory, setOrderHistory] = useState([
    {
      id: '#261004',
      name: 'Chicken Noodle Soup',
      price: '26.10$',
      image: '/assets/RCP-001.jpg',
      isFavorite: false
    },
    {
      id: '#261004',
      name: 'Chicken Noodle Soup',
      price: '26.10$',
      image: '/assets/RCP-001.jpg',
      isFavorite: false
    },
    {
      id: '#261004',
      name: 'Chicken Noodle Soup',
      price: '26.10$',
      image: '/assets/RCP-001.jpg',
      isFavorite: false
    }
  ]);
  
  const [trackOrder, setTrackOrder] = useState({
    orderId: '2024-Oct-08, 2024',
    estimatedDelivery: '20:30 Oct 09, 2024',
    status: 'Order Confirmed',
    timeline: [
      { date: 'Oct 03, 2024', completed: true },
      { date: 'Oct 05, 2024', completed: true },
      { date: 'Oct 08, 2024', completed: true },
      { date: 'Oct 09, 2024', completed: false }
    ]
  });
  
  const [userProfile, setUserProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    contactNumber: '',
    addresses: []
  });
  
  // New address form state
  const [newAddress, setNewAddress] = useState({
    ward: '',
    district: '',
    street: '',
    houseNumber: '',
    buildingName: '',
    block: '',
    floor: '',
    roomNumber: '',
    deliveryInstructions: ''
  });
  
  // Dropdown states
  const [wardDropdownOpen, setWardDropdownOpen] = useState(false);
  const [districtDropdownOpen, setDistrictDropdownOpen] = useState(false);
  const [streetDropdownOpen, setStreetDropdownOpen] = useState(false);

  // Sample data for dropdowns
  const wards = ['Ward 1', 'Ward 2', 'Ward 3', 'Ward 4', 'Ward 5'];
  const districts = ['District 1', 'District 2', 'District 3', 'District 4', 'District 5'];
  const streets = ['Street 1', 'Street 2', 'Street 3', 'Street 4', 'Street 5'];
  
  // Sync state with props
  useEffect(() => {
    if (propAuthStatus) {
      console.log('Account: propAuthStatus updated:', propAuthStatus);
      setAuthStatus(propAuthStatus);
    }
  }, [propAuthStatus]);
  
  useEffect(() => {
    if (propUserAddress) setUserAddress(propUserAddress);
  }, [propUserAddress]);
  
  useEffect(() => {
    if (userAddress !== propUserAddress && setPropUserAddress) setPropUserAddress(userAddress);
  }, [userAddress, setPropUserAddress, propUserAddress]);
  
  // Check auth status on component mount and redirect if not signed in
  useEffect(() => {
    console.log('Account: Checking auth status:', { authStatus, propAuthStatus });
    if (propAuthStatus !== 'signedIn') {
      console.log('Account: Not signed in, redirecting to home');
      navigate('/');
    }
  }, [propAuthStatus, navigate]);
  
  const handleLogout = () => {
    setAuthStatus('guest');
    // Xóa trạng thái từ localStorage
    localStorage.removeItem('authStatus');
    navigate('/');
  };
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  
  const handleAccountClick = () => {
    // Already on account page, do nothing or refresh
  };
  
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setShowAddNewAddress(false);
  };
  
  const handleAddNewAddress = () => {
    setShowAddNewAddress(true);
  };
  
  const handleSaveAddress = () => {
    // Save the new address
    const updatedUserProfile = { ...userProfile };
    updatedUserProfile.addresses.push({ ...newAddress });
    setUserProfile(updatedUserProfile);
    
    // Reset form and hide it
    setNewAddress({
      ward: '',
      district: '',
      street: '',
      houseNumber: '',
      buildingName: '',
      block: '',
      floor: '',
      roomNumber: '',
      deliveryInstructions: ''
    });
    setShowAddNewAddress(false);
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserProfile({
      ...userProfile,
      [name]: value
    });
  };
  
  const handleNewAddressChange = (e) => {
    const { name, value } = e.target;
    setNewAddress({
      ...newAddress,
      [name]: value
    });
  };
  
  const handleSetAsDefaultAddress = () => {
    // Implement setting address as default
    alert("Address set as default");
  };
  
  const renderAccount = () => {
    return (
      <div className="account-section">
        <h2>Account</h2>
        <div className="account-content">
          <p>Welcome to your account dashboard.</p>
          <p>From here you can:</p>
          <ul>
            <li>View and track your orders</li>
            <li>View your favorite orders</li>
            <li>Update your profile settings</li>
          </ul>
        </div>
      </div>
    );
  };
  
  const renderTrackOrder = () => {
    return (
      <div className="account-section">
        <h2>Track Order</h2>
        <div className="track-order-container">
          <div className="order-info">
            <div className="order-date">
              <span>Order ID:</span> {trackOrder.orderId}
            </div>
            <div className="estimated-delivery">
              <span>Estimated delivery:</span> {trackOrder.estimatedDelivery}
            </div>
          </div>
          
          <div className="order-status">
            <div className="status-label">{trackOrder.status}</div>
            <div className="status-timeline">
              {trackOrder.timeline.map((step, index) => (
                <div key={index} className={`timeline-step ${step.completed ? 'completed' : ''}`}>
                  <div className="timeline-date">{step.date}</div>
                  <div className="timeline-dot"></div>
                </div>
              ))}
              <div className="timeline-line"></div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  const renderOrderHistory = () => {
    return (
      <div className="account-section">
        <h2>Order History</h2>
        <div className="order-history-list">
          {orderHistory.map((order, index) => (
            <div className="order-item" key={index}>
              <div className="order-image">
                <img src={order.image} alt={order.name} />
              </div>
              <div className="order-details">
                <div className="order-heart">
                  {order.isFavorite ? (
                    <span className="favorite-heart">❤️</span>
                  ) : (
                    <span className="favorite-heart-outline">♡</span>
                  )}
                </div>
                <h4>{order.name}</h4>
                <p>Paid - {order.price}</p>
                <div className="order-id">{order.id}</div>
                <div className="order-actions">
                  <button className="reorder-btn">Reorder</button>
                  <button className="rating-btn">Rating</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  const renderFavoriteOrder = () => {
    return (
      <div className="account-section">
        <h2>Favourite Order</h2>
        <div className="favorite-orders">
          {favoriteOrders.map((order, index) => (
            <div className="favorite-order-item" key={index}>
              <div className="favorite-order-image">
                <img src={order.image} alt={order.name} />
              </div>
              <div className="favorite-order-details">
                <div className="favorite-heart">❤️</div>
                <h4>{order.name}</h4>
                <p>Paid - {order.price}</p>
                <div className="favorite-order-actions">
                  <button className="reorder-btn">Reorder</button>
                  <button className="rating-btn">Rating</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  const renderProfileSettings = () => {
    return (
      <div className="account-section">
        <h2>Profile Settings</h2>
        {!showAddNewAddress ? (
          <div className="profile-settings-form">
            <div className="form-row">
              <div className="form-group">
                <label>First Name</label>
                <input 
                  type="text" 
                  name="firstName" 
                  value={userProfile.firstName} 
                  onChange={handleInputChange}
                  placeholder="Enter your first name" 
                />
              </div>
              <div className="form-group">
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
            
            <div className="form-row">
              <div className="form-group">
                <label>Email</label>
                <input 
                  type="email" 
                  name="email" 
                  value={userProfile.email} 
                  onChange={handleInputChange}
                  placeholder="Enter your email" 
                />
              </div>
              <div className="form-group">
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
            
            <div className="address-section">
              <label>Address</label>
              <div className="address-display-box">
                {userProfile.addresses.length > 0 ? (
                  <div className="saved-address">
                    {/* Display first address */}
                    <p>{userProfile.addresses[0].street}, {userProfile.addresses[0].houseNumber}</p>
                    <p>{userProfile.addresses[0].district}, {userProfile.addresses[0].ward}</p>
                    {userProfile.addresses[0].buildingName && <p>{userProfile.addresses[0].buildingName}</p>}
                  </div>
                ) : (
                  <p>No addresses saved</p>
                )}
              </div>
              <div className="address-actions">
                <button className="set-default-btn" onClick={handleSetAsDefaultAddress}>Set as default address</button>
                <button className="add-address-btn" onClick={handleAddNewAddress}>+ Add New Address</button>
              </div>
            </div>
          </div>
        ) : (
          <div className="new-address-form">
            <div className="delivery-row">
              <div className="delivery-field">
                <label>*Ward:</label>
                <div className="custom-select">
                  <div 
                    className="select-header" 
                    onClick={() => setWardDropdownOpen(!wardDropdownOpen)}
                  >
                    {newAddress.ward || "We only deliver to the wards in this list"}
                    <span className="dropdown-arrow">▼</span>
                  </div>
                  {wardDropdownOpen && (
                    <div className="select-options">
                      {wards.map((item, index) => (
                        <div 
                          key={index} 
                          className="select-option" 
                          onClick={() => {
                            setNewAddress({...newAddress, ward: item});
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
                    {newAddress.district || "We only deliver to the districts in this list"}
                    <span className="dropdown-arrow">▼</span>
                  </div>
                  {districtDropdownOpen && (
                    <div className="select-options">
                      {districts.map((item, index) => (
                        <div 
                          key={index} 
                          className="select-option" 
                          onClick={() => {
                            setNewAddress({...newAddress, district: item});
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
                    {newAddress.street || "We only deliver to the streets in this list"}
                    <span className="dropdown-arrow">▼</span>
                  </div>
                  {streetDropdownOpen && (
                    <div className="select-options">
                      {streets.map((item, index) => (
                        <div 
                          key={index} 
                          className="select-option" 
                          onClick={() => {
                            setNewAddress({...newAddress, street: item});
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
                  name="houseNumber"
                  value={newAddress.houseNumber}
                  onChange={handleNewAddressChange}
                  required
                />
              </div>
            </div>
            
            <div className="delivery-field single-row">
              <label>Building Name:</label>
              <input 
                type="text" 
                name="buildingName"
                value={newAddress.buildingName}
                onChange={handleNewAddressChange}
              />
            </div>
            
            <div className="delivery-row three-column">
              <div className="delivery-field">
                <label>Block:</label>
                <input 
                  type="text" 
                  name="block"
                  value={newAddress.block}
                  onChange={handleNewAddressChange}
                />
              </div>
              
              <div className="delivery-field">
                <label>Floor / Level:</label>
                <input 
                  type="text" 
                  name="floor"
                  value={newAddress.floor}
                  onChange={handleNewAddressChange}
                />
              </div>
              
              <div className="delivery-field">
                <label>Room Number / Company Name:</label>
                <input 
                  type="text" 
                  name="roomNumber"
                  value={newAddress.roomNumber}
                  onChange={handleNewAddressChange}
                />
              </div>
            </div>
            
            <div className="delivery-field single-row">
              <label>Delivery Instruction to Rider:</label>
              <textarea 
                name="deliveryInstructions"
                value={newAddress.deliveryInstructions}
                onChange={handleNewAddressChange}
                rows={3}
              />
            </div>
            
            <button className="save-address-btn" onClick={handleSaveAddress}>SAVE ADDRESS</button>
          </div>
        )}
      </div>
    );
  };
  
  const renderContent = () => {
    switch(activeTab) {
      case 'account':
        return renderAccount();
      case 'track-order':
        return renderTrackOrder();
      case 'order-history':
        return renderOrderHistory();
      case 'favourite-order':
        return renderFavoriteOrder();
      case 'profile-settings':
        return renderProfileSettings();
      default:
        return renderAccount();
    }
  };
  
  return (
    <div className="account-page">
      {/* Header */}
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
          onClick={toggleMenu}
        ></div>

        <div
          className={`nav-links ${menuOpen ? 'active' : ''}`}
        >
          <div className="close-btn" onClick={toggleMenu}>✕</div>
          <a href="#">Menu</a>
          <a href="#">Discount</a>
          <img src="/assets/logo.png" alt="Logo" className="logo" />
          <a href="#" onClick={handleAccountClick}>Account</a>
          <a href="#">Support</a>
        </div>
      </div>

      {/* Account Container */}
      <div className="account-container">
        <div className="account-sidebar">
          <div 
            className={`sidebar-item ${activeTab === 'account' ? 'active' : ''}`}
            onClick={() => handleTabChange('account')}
          >
            Account
          </div>
          <div 
            className={`sidebar-item ${activeTab === 'track-order' ? 'active' : ''}`}
            onClick={() => handleTabChange('track-order')}
          >
            Track Order
          </div>
          <div 
            className={`sidebar-item ${activeTab === 'order-history' ? 'active' : ''}`}
            onClick={() => handleTabChange('order-history')}
          >
            Order History
          </div>
          <div 
            className={`sidebar-item ${activeTab === 'favourite-order' ? 'active' : ''}`}
            onClick={() => handleTabChange('favourite-order')}
          >
            Favourite Order
          </div>
          <div 
            className={`sidebar-item ${activeTab === 'profile-settings' ? 'active' : ''}`}
            onClick={() => handleTabChange('profile-settings')}
          >
            Profile Settings
          </div>
        </div>
        
        <div className="account-content">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default Account;