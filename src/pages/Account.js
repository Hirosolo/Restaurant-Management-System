import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import AccountSidebar from '../components/AccountSidebar';
import './Account.css';
import { useLocation } from 'react-router-dom';

function Account() {
  const navigate = useNavigate();
  const { authStatus, userData, userAddress, handleSignOut, setUserData } = useAuth();
  const { addToCart } = useCart();
  
  // Tab state synced with ?tab=... in URL
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const initialTab = params.get('tab') || 'account';
  const [activeTab, setActiveTab] = useState(initialTab);
  useEffect(() => {
  setActiveTab(new URLSearchParams(location.search).get('tab') || 'account');
  }, [location.search]);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [orderHistory, setOrderHistory] = useState([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [favoriteMeals, setFavoriteMeals] = useState([]);
  const [isLoadingFavorites, setIsLoadingFavorites] = useState(false);
  const [refreshOrdersTrigger, setRefreshOrdersTrigger] = useState(0);
  
  // Address form states
  const [ward, setWard] = useState('');
  const [district, setDistrict] = useState('');
  const [street, setStreet] = useState('');
  const [houseNumber, setHouseNumber] = useState('');
  const [buildingName, setBuildingName] = useState('');
  const [block, setBlock] = useState('');
  const [floor, setFloor] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [deliveryInstructions, setDeliveryInstructions] = useState('');

  // Dropdown states
  const [wardDropdownOpen, setWardDropdownOpen] = useState(false);
  const [districtDropdownOpen, setDistrictDropdownOpen] = useState(false);
  const [streetDropdownOpen, setStreetDropdownOpen] = useState(false);

  // Sample data for dropdowns
  const wards = ['Ward 1', 'Ward 2', 'Ward 3', 'Ward 4', 'Ward 5'];
  const districts = ['District 1', 'District 2', 'District 3', 'District 4', 'District 5'];
  const streets = ['Street 1', 'Street 2', 'Street 3', 'Street 4', 'Street 5'];

  // Helper to format currency
  const formatCurrency = (amount) => {
    // Convert to integer to remove decimals, then to string
    const amountStr = Math.floor(amount).toString();
    // Use regex to add dot as thousand separator
    const formattedAmount = amountStr.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return `${formattedAmount} vnd`;
  };

  // Fetch user profile data
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await fetch('http://localhost:3001/api/users/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch profile data');
        }

        const data = await response.json();
        if (data.success) {
          // Parse the address string into an object if it exists
          if (data.user.address) {
            try {
              const addressObj = JSON.parse(data.user.address);
              data.user.address = addressObj;
            } catch (e) {
              // If address is not a JSON string, keep it as is
              console.log('Address is not in JSON format:', data.user.address);
            }
          }
          setProfileData(data.user);
        }
      } catch (err) {
        setError(err.message);
        console.error('Error fetching profile:', err);
        if (err.message === 'No authentication token found') {
          handleSignOut();
          navigate('/');
        }
      } finally {
        setLoading(false);
      }
    };

    if (authStatus === 'signedIn') {
      fetchProfileData();
    }
  }, [authStatus, handleSignOut, navigate]);

  // Initialize address form with current address when opening modal
  useEffect(() => {
    if (showAddressModal && profileData?.address) {
      setWard(profileData.address.ward || '');
      setDistrict(profileData.address.district || '');
      setStreet(profileData.address.street || '');
      setHouseNumber(profileData.address.houseNumber || '');
      setBuildingName(profileData.address.buildingName || '');
      setBlock(profileData.address.block || '');
      setFloor(profileData.address.floor || '');
      setRoomNumber(profileData.address.roomNumber || '');
      setDeliveryInstructions(profileData.address.deliveryInstructions || '');
    }
  }, [showAddressModal, profileData]);
  
  // Check authentication status when component mounts
  useEffect(() => {
    if (authStatus !== 'signedIn') {
      navigate('/');
    }
  }, [authStatus, navigate]);
  
  // Fetch order history when order history tab is active or trigger changes
  useEffect(() => {
    const fetchOrderHistory = async () => {
      if (activeTab === 'order-history' && authStatus === 'signedIn') {
        setIsLoadingOrders(true);
        try {
          const token = localStorage.getItem('token');
          if (!token) {
            throw new Error('No authentication token found');
          }

          console.log('Fetching order history...');
          const response = await fetch('http://localhost:3001/api/orders/user/orders', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (!response.ok) {
            throw new Error('Failed to fetch order history');
          }

          const data = await response.json();
          console.log('Order history fetched:', data);
          if (data.success) {
            setOrderHistory(data.orders);
          }
        } catch (err) {
          console.error('Error fetching order history:', err);
          setError(err.message);
        } finally {
          setIsLoadingOrders(false);
        }
      }
    };

    fetchOrderHistory();
  }, [activeTab, authStatus, refreshOrdersTrigger]);
  
  // Fetch favorite meals when favourite-orders tab is active
  useEffect(() => {
    const fetchFavoriteMeals = async () => {
      if (activeTab === 'favourite-order' && authStatus === 'signedIn') {
        setIsLoadingFavorites(true);
        try {
          const token = localStorage.getItem('token');
          if (!token) {
            throw new Error('No authentication token found');
          }

          console.log('Fetching favorite meals...');
          const response = await fetch('http://localhost:3001/api/orders/user/favorite-meals', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (!response.ok) {
            throw new Error('Failed to fetch favorite meals');
          }

          const data = await response.json();
          console.log('Favorite meals fetched:', data);
          if (data.success) {
            setFavoriteMeals(data.favoriteMeals);
          }
        } catch (err) {
          console.error('Error fetching favorite meals:', err);
          setError(err.message);
        } finally {
          setIsLoadingFavorites(false);
        }
      }
    };

    fetchFavoriteMeals();
  }, [activeTab, authStatus]);
  
  // Handlers
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'order-history') {
      setRefreshOrdersTrigger(prev => prev + 1);
    }
  };
  
  const handleLogout = () => {
    handleSignOut();
    navigate('/');
  };

  const handleUpdateAddress = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const newAddress = {
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

      const response = await fetch('http://localhost:3001/api/users/update-address', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ address: newAddress })
      });

      if (!response.ok) {
        throw new Error('Failed to update address');
      }

      const data = await response.json();
      if (data.success) {
        // Update local state
        setProfileData(prev => ({
          ...prev,
          address: newAddress
        }));
        setShowAddressModal(false);
      }
    } catch (err) {
      console.error('Error updating address:', err);
      setError(err.message);
    }
  };
  
  const calculateTotalAmount = (items, deliveryCharge = 0) => {
    const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
    return subtotal + (deliveryCharge || 0);
  };

  // Render content based on active tab
  const renderContent = () => {
    if (loading) {
      return <div className="loading">Loading...</div>;
    }

    if (error) {
      return <div className="error">{error}</div>;
    }

    switch(activeTab) {
      case 'account':
        return (
          <div className="account-overview">
            <h2>Account Overview</h2>
            <div className="user-info">
              <h3>Personal Information</h3>
              <p><strong>Name:</strong> {profileData?.firstName} {profileData?.lastName}</p>
              <p><strong>Email:</strong> {profileData?.email}</p>
              <p><strong>Phone:</strong> {profileData?.contactMobile}</p>
              <p><strong>Loyalty Points:</strong> {profileData?.loyaltyPoints || 0}</p>
            </div>
            <div className="address-info">
              <div className="address-header">
                <h3>Delivery Address</h3>
                <button 
                  className="change-address-btn"
                  onClick={() => setShowAddressModal(true)}
                >
                  Change Address
                </button>
              </div>
              {profileData?.address ? (
                <>
                  <p><strong>Address:</strong> {profileData.address.houseNumber} {profileData.address.street}</p>
                  <p><strong>Ward:</strong> {profileData.address.ward}</p>
                  <p><strong>District:</strong> {profileData.address.district}</p>
                  {profileData.address.buildingName && <p><strong>Building:</strong> {profileData.address.buildingName}</p>}
                  {profileData.address.block && <p><strong>Block:</strong> {profileData.address.block}</p>}
                  {profileData.address.floor && <p><strong>Floor:</strong> {profileData.address.floor}</p>}
                  {profileData.address.roomNumber && <p><strong>Room:</strong> {profileData.address.roomNumber}</p>}
                  {profileData.address.deliveryInstructions && (
                    <p><strong>Delivery Instructions:</strong> {profileData.address.deliveryInstructions}</p>
                  )}
                </>
              ) : (
                <p>No delivery address set</p>
              )}
            </div>
          </div>
        );
      case 'order-history':
        return (
          <div className="order-history">
            <h2>Order History</h2>
            {isLoadingOrders ? (
              <div className="loading">Loading orders...</div>
            ) : orderHistory.length > 0 ? (
              <div className="orders-list">
                {orderHistory.map((order) => (
                  <div key={order.sale_id} className="order-card">
                    <div className="order-header">
                      <div className="order-info">
                        <span className="order-id">Order #{order.sale_id}</span>
                        <span className="order-date">
                          {new Date(order.sale_time).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="order-status">
                        <span className={`status ${order.status.toLowerCase()}`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                    <div className="order-items">
                      {order.items.map((item, index) => (
                        <div key={index} className="order-item">
                          <img 
                            src={item.image_url} 
                            alt={item.recipe_name}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = '/placeholder-food.jpg';
                            }}
                          />
                          <div className="item-details">
                            <span className="item-name">{item.recipe_name}</span>
                            <span className="item-quantity">x{item.quantity}</span>
                          </div>
                          <div className="order-item-details">
                            <p>{formatCurrency(item.price * item.quantity)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="order-footer">
                      <div className="order-fee">
                        <span>Delivery Fee:</span>
                        <span>{formatCurrency(order.delivery_charge || 0)}</span>
                      </div>
                      <div className="order-total">
                        <span>Total:</span>
                        <span>{formatCurrency(calculateTotalAmount(order.items, order.delivery_charge))}</span>
                      </div>
                      <div className="order-address">
                        <span>Delivered to:</span>
                        <span>{order.delivery_address}</span>
                      </div>
                      {order.status === 'Pending' && (
                        <button
                          className="received-order-btn"
                          onClick={async () => {
                            try {
                              const token = localStorage.getItem('token');
                              const response = await fetch(`http://localhost:3001/api/orders/complete/${order.sale_id}`, {
                                method: 'PUT',
                                headers: { 
                                  'Authorization': `Bearer ${token}`,
                                  'Content-Type': 'application/json'
                                }
                              });

                              if (!response.ok) {
                                throw new Error('Failed to mark order as completed');
                              }

                              const data = await response.json();
                              if (data.success) {
                                // Refresh order history locally after marking as complete
                                setOrderHistory((prev) => prev.map(o => 
                                  o.sale_id === order.sale_id ? { ...o, status: 'Completed' } : o
                                ));
                                // Also trigger a full re-fetch to be safe
                                setRefreshOrdersTrigger(prev => prev + 1);

                                // Update user's loyalty points in the UI
                                if (data.loyaltyPointsEarned) {
                                  // Update userData with new loyalty points
                                  setUserData(prev => ({
                                    ...prev,
                                    loyaltyPoints: (prev.loyaltyPoints || 0) + data.loyaltyPointsEarned
                                  }));
                                  // Update localStorage
                                  const updatedUserData = {
                                    ...userData,
                                    loyaltyPoints: (userData.loyaltyPoints || 0) + data.loyaltyPointsEarned
                                  };
                                  localStorage.setItem('userData', JSON.stringify(updatedUserData));
                                  
                                  // Show success message with points earned
                                  alert(`Order marked as completed! You earned ${data.loyaltyPointsEarned} loyalty points.`);
                                }
                              } else {
                                throw new Error(data.message || 'Failed to mark order as completed');
                              }
                            } catch (error) {
                              console.error('Error marking order as completed:', error);
                            }
                          }}
                        >
                          Received the order
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-orders">
                <p>You haven't placed any orders yet.</p>
                <button 
                  className="start-ordering-btn"
                  onClick={() => navigate('/menu')}
                >
                  Start Ordering
                </button>
              </div>
            )}
          </div>
        );
      case 'track-order':
        return <div className="track-order">Track Order Content</div>;
      case 'favourite-order':
        return (
          <div className="favorite-meals">
            <h2>Favourite Meals</h2>
            {isLoadingFavorites ? (
              <div className="loading">Loading favorite meals...</div>
            ) : favoriteMeals.length > 0 ? (
              <div className="meals-list">
                {favoriteMeals.map((meal) => (
                  <div key={meal.recipe_id} className="meal-card">
                    <div className="meal-image">
                      <img 
                        src={meal.image_url} 
                        alt={meal.recipe_name}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/placeholder-food.jpg';
                        }}
                      />
                    </div>
                    <div className="meal-details">
                      <h3>{meal.recipe_name}</h3>
                      <div className="meal-stats">
                        <span>Ordered {meal.times_ordered} times</span>
                        <span>Total items: {meal.total_ordered}</span>
                      </div>
                      <div className="favourite-meal-details">
                        <h4>{meal.recipe_name}</h4>
                        <p>{meal.description}</p>
                        <p>{formatCurrency(meal.price)}</p>
                      </div>
                      <button 
                        className="reorder-btn"
                        onClick={() => {
                          // Add the meal to cart
                          addToCart({
                            id: meal.recipe_id,
                            name: meal.recipe_name,
                            price: meal.price,
                            image_url: meal.image_url,
                            description: meal.description
                          });
                          // Navigate to menu page
                          navigate('/menu');
                        }}
                      >
                        Order Again
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-favorites">
                <p>You haven't ordered any meals yet.</p>
                <button 
                  className="start-ordering-btn"
                  onClick={() => navigate('/menu')}
                >
                  Start Ordering
                </button>
              </div>
            )}
          </div>
        );
      case 'profile-settings':
        return <div className="profile-settings">Profile Settings Content</div>;
      default:
        return <div className="account-overview">Account Overview Content</div>;
    }
  };

  return (
    <div className="account-page">
      <div className="account-container">
        <AccountSidebar 
          activeTab={activeTab}
          handleTabChange={handleTabChange}
          handleLogout={handleLogout}
        />
        
        <div className="account-content">
          {renderContent()}
        </div>
      </div>

      {showAddressModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Update Delivery Address</h3>
              <button 
                className="close-modal-btn"
                onClick={() => setShowAddressModal(false)}
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleUpdateAddress}>
              <div className="delivery-form">
                <div className="delivery-row">
                  <div className="delivery-field">
                    <label>*Ward:</label>
                    <div className="custom-select">
                      <div 
                        className="select-header" 
                        onClick={() => setWardDropdownOpen(!wardDropdownOpen)}
                      >
                        {ward || "Select ward"}
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
                        {district || "Select district"}
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
                        {street || "Select street"}
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
                  <label>Delivery Instructions:</label>
                  <textarea 
                    value={deliveryInstructions}
                    onChange={(e) => setDeliveryInstructions(e.target.value)}
                    rows={3}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="cancel-btn" onClick={() => setShowAddressModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="save-btn">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Account;