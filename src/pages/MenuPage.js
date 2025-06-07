import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import FoodItem from '../components/FoodItem';
import Footer from '../components/Footer';
import './MenuPage.css';

function MenuPage() {
  // Track if user has explicitly continued as guest this session
  const [hasContinuedAsGuest, setHasContinuedAsGuest] = useState(false);

  const {
    authStatus,
    setAuthStatus,
    userAddress,
    setUserAddress,
    continueAsGuest,
    handleCreateAccount,
    handleSignIn,
    userData
  } = useAuth();
  const { cart, addToCart, removeFromCart, increaseQuantity, decreaseQuantity, updateNote } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState({});
  const [categoriesOpen, setCategoriesOpen] = useState({});
  const [noteOpen, setNoteOpen] = useState({});
  const navRef = useRef(null);
  const overlayRef = useRef(null);
  const [showDetailPopup, setShowDetailPopup] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSignInForm, setShowSignInForm] = useState(false);
  const [showCreateAccountForm, setShowCreateAccountForm] = useState(false);
  const [tempItemToAdd, setTempItemToAdd] = useState(null);
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [contactMobile, setContactMobile] = useState('');
  const [showForgotPasswordForm, setShowForgotPasswordForm] = useState(false);

  // Track Your Order popup state
  const [showTrackOrderPopup, setShowTrackOrderPopup] = useState(false);
  const [trackOrderPhone, setTrackOrderPhone] = useState('');
  const [trackOrderHistory, setTrackOrderHistory] = useState([]);
  const [isLoadingTrackOrders, setIsLoadingTrackOrders] = useState(false);
  const [trackOrderError, setTrackOrderError] = useState('');

  // Data
  const [categories, setCategories] = useState([]);
  const [recipeDetails, setRecipeDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [ward, setWard] = useState('');
  const [district, setDistrict] = useState('');
  const [houseNumber, setHouseNumber] = useState('');
  const [buildingName, setBuildingName] = useState('');
  const [block, setBlock] = useState('');
  const [floor, setFloor] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [deliveryInstructions, setDeliveryInstructions] = useState('');
  const [street, setStreet] = useState('');

  const [wardDropdownOpen, setWardDropdownOpen] = useState(false);
  const [districtDropdownOpen, setDistrictDropdownOpen] = useState(false);
  const [streetDropdownOpen, setStreetDropdownOpen] = useState(false);

  const wards = ['Ward 1', 'Ward 2', 'Ward 3', 'Ward 4', 'Ward 5'];
  const districts = ['District 1', 'District 2', 'District 3', 'District 4', 'District 5'];
  const streets = ['Street 1', 'Street 2', 'Street 3', 'Street 4', 'Street 5'];

  const [selectedFilters, setSelectedFilters] = useState({
    calories: '',
    protein: ''
  });

  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  useEffect(() => {
    if (userAddress) setUserAddress(userAddress);
  }, [userAddress, setUserAddress]);

  useEffect(() => {
    if (userAddress !== userAddress && setUserAddress) setUserAddress(userAddress);
  }, [userAddress, setUserAddress, userAddress]);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true);
        const queryParams = new URLSearchParams();
        if (selectedFilters.calories) {
          queryParams.append('calories', selectedFilters.calories);
        }
        if (selectedFilters.protein) {
          queryParams.append('protein', selectedFilters.protein);
        }
        const response = await fetch(`http://localhost:3001/api/recipes?${queryParams.toString()}`);
        if (!response.ok) {
          throw new Error('Failed to fetch recipes');
        }
        const data = await response.json();
        setCategories(data);
        const details = {};
        data.forEach(category => {
          category.items.forEach(item => {
            details[`RCP-${String(item.id).padStart(3, '0')}`] = {
              id: `RCP-${String(item.id).padStart(3, '0')}`,
              name: item.name,
              calories: item.calories.toString(),
              protein: item.protein.toString(),
              fat: item.fat.toString(),
              fiber: item.fiber.toString(),
              carb: item.carb.toString(),
              description: `${item.name} is a delicious ${category.name.toLowerCase()} dish.`
            };
          });
        });
        setRecipeDetails(details);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchRecipes();
  }, [selectedFilters]);

  useEffect(() => {
    if (authStatus === 'guest' && !showAuthModal && !hasContinuedAsGuest) {
      setShowAuthModal(true);
    }
  }, [authStatus, showAuthModal, hasContinuedAsGuest]);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleFilter = (filterId) => setFiltersOpen(prev => ({ ...prev, [filterId]: !prev[filterId] }));
  const toggleCategory = (categoryId) => setCategoriesOpen(prev => ({ ...prev, [categoryId]: !prev[categoryId] }));
  const toggleNote = (itemId) => setNoteOpen(prev => ({ ...prev, [itemId]: !prev[itemId] }));
  const showRecipeDetails = (recipeId) => { setSelectedRecipe(recipeId); setShowDetailPopup(true); };
  const closeDetailPopup = () => { setShowDetailPopup(false); setSelectedRecipe(null); };
  const handleAccountClick = (e) => { e.preventDefault(); if (authStatus === 'signedIn') { navigate('/account'); } else { setShowAuthModal(true); } };
  const onAuthSuccess = (status) => { if (status === 'signedIn') { setShowAuthModal(false); setShowSignInForm(false); setShowCreateAccountForm(false); setShowForgotPasswordForm(false); } };
  const filters = [
    { id: 'calories', name: 'Calories', options: ['All', '< 300', '300 - 500', '> 500'] },
    { id: 'protein', name: 'Main Protein', options: ['All', 'Salmon', 'Tuna', 'Chicken', 'Shrimp', 'Scallop', 'Tofu'] }
  ];
  const calculateTotal = () => cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  const handleCheckout = () => {
    if (cart.length === 0) { alert("Your cart is empty"); return; }
    if (authStatus === 'guest') { navigate('/delivery'); }
    else if (authStatus === 'signedIn') { navigate('/checkout'); }
    else { setShowAuthModal(true); }
  };
  const handleFilterChange = (filterType, value) => {
    setSelectedFilters(prev => {
      if (value === 'All' || prev[filterType] === value) {
        const newFilters = { ...prev };
        delete newFilters[filterType];
        return newFilters;
      }
      return { ...prev, [filterType]: value };
    });
  };
  const renderFilterOptions = (filter) => {
    const isOpen = filtersOpen[filter.id] !== false;
    return (
      <div className="filter-block">
        <div className="filter-header">
          <h4>{filter.name}</h4>
          <span className={`filter-toggle ${isOpen ? 'open' : 'closed'}`} onClick={() => toggleFilter(filter.id)}>▼</span>
        </div>
        {isOpen && (
          <div className="filter-options">
            {filter.options.map((option) => (
              <label key={option} className="filter-option">
                <input type="radio" name={filter.id} value={option} checked={selectedFilters[filter.id] === option} onChange={() => handleFilterChange(filter.id, option)} />
                <span>{option}</span>
              </label>
            ))}
          </div>
        )}
      </div>
    );
  };
  const renderCategoryItems = (items) => {
    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">Error: {error}</div>;
    return (
      <div className="category-items">
        {items.map(item => {
          const recipeId = `RCP-${String(item.id).padStart(3, '0')}`;
          const formattedPrice = formatCurrency(item.price);
          return (
            <FoodItem key={item.id} product={item} onAddToCart={addToCart} showDetails={() => showRecipeDetails(recipeId)} formattedPrice={formattedPrice} />
          );
        })}
      </div>
    );
  };
  const showNotification = (message, type = 'info') => {
    setNotification({ show: true, message, type });
    setTimeout(() => { setNotification({ show: false, message: '', type: '' }); }, 5000);
  };
  const formatCurrency = (amount) => {
    const amountStr = Math.floor(amount).toString();
    const formattedAmount = amountStr.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return `${formattedAmount} vnd`;
  };
  const handleCreateAccountSubmit = async (e) => {
    e.preventDefault();
    // ... (validation and logic unchanged)
  };
  const handleForgotPasswordClick = (e) => {
    e.preventDefault();
    setShowSignInForm(false);
    setShowForgotPasswordForm(true);
  };

  // Track Your Order logic
  const handleTrackOrderClick = (e) => {
    e.preventDefault();
    setShowTrackOrderPopup(true);
    setTrackOrderPhone('');
    setTrackOrderHistory([]);
    setTrackOrderError('');
  };
  const handleTrackOrderSubmit = async (e) => {
    e.preventDefault();
    if (!trackOrderPhone) { setTrackOrderError('Please enter your phone number'); return; }
    if (!/^\d{10}$/.test(trackOrderPhone)) { setTrackOrderError('Phone number must be exactly 10 digits'); return; }
    setIsLoadingTrackOrders(true);
    setTrackOrderError('');
    try {
      const response = await fetch(`http://localhost:3001/api/orders/guest/orders/${trackOrderPhone}`);
      if (!response.ok) throw new Error('Failed to fetch order history');
      const data = await response.json();
      if (data.success) {
        setTrackOrderHistory(data.orders);
        if (data.orders.length === 0) setTrackOrderError('No orders found for this phone number');
      } else {
        setTrackOrderError(data.message || 'Failed to fetch order history');
      }
    } catch (error) {
      setTrackOrderError('Error fetching order history. Please try again.');
    } finally {
      setIsLoadingTrackOrders(false);
    }
  };
  const calculateTotalAmountTrack = (items) => items.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div className="menu-page">
      {notification.show && (
        <div className={`notification ${notification.type}`}>{notification.message}</div>
      )}
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
      <div className="user-nav">
        <div className="user-nav-container">
          <div className="user-nav-left">
            <span className="user-icon">👤</span>
            {authStatus === 'signedIn' ? (
              <span className="user-nav-item" onClick={handleAccountClick}>My Account</span>
            ) : (
              <span className="user-nav-item" onClick={() => { setShowSignInForm(true); setShowAuthModal(false); }}>Sign In</span>
            )}

      {/* Ensure the auth modal and sign-in modal rendering is present */}
      {showAuthModal && (
        <div className="auth-modal-overlay">
          <div className="auth-modal">
            <h3>Sign in to Greedible and start Green today</h3>
            <div className="auth-options">
              <button className="auth-option-btn sign-in-btn" onClick={() => { setShowSignInForm(true); setShowAuthModal(false); }}>
                SIGN IN
              </button>
              <div className="auth-separator"></div>
              <button className="auth-option-btn create-account-btn" onClick={() => { setShowCreateAccountForm(true); setShowAuthModal(false); }}>
                CREATE AN ACCOUNT
                <span className="account-time">in less than 2 minutes</span>
                <span className="account-benefits">To enjoy member benefits</span>
              </button>
              <div className="auth-separator"></div>
              <button className="auth-option-btn guest-btn" onClick={() => {
                continueAsGuest();
                setHasContinuedAsGuest(true);
                setShowAuthModal(false);
              }}>
                CONTINUE AS GUEST
              </button>
            </div>
          </div>
        </div>
      )}

      {showSignInForm && (
        <div className="auth-modal-overlay">
          <div className="auth-form-modal">
            <h3>Sign In</h3>
            <button className="close-modal-btn" onClick={() => setShowSignInForm(false)}>✕</button>
            <form onSubmit={async (e) => {
              e.preventDefault();
              // Validate email
              const emailInput = e.target.querySelector('input[type="email"]');
              if (!emailInput.value) {
                emailInput.setCustomValidity('This field is required');
                emailInput.reportValidity();
                return;
              }
              emailInput.setCustomValidity('');
              // Validate password
              const passwordInput = e.target.querySelector('input[type="password"]');
              if (!passwordInput.value) {
                passwordInput.setCustomValidity('This field is required');
                passwordInput.reportValidity();
                return;
              }
              passwordInput.setCustomValidity('');
              try {
                showNotification('Signing in...', 'info');
                await handleSignIn(userEmail, userPassword);
                showNotification('Successfully signed in! Welcome back!', 'success');
                setShowSignInForm(false);
                setShowAuthModal(false);
                setUserEmail('');
                setUserPassword('');
              } catch (error) {
                showNotification(error.message || 'Invalid email or password. Please try again.', 'error');
              }
            }}>
              <div className="form-group">
                <label>Email</label>
                <input type="email" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input type="password" value={userPassword} onChange={(e) => setUserPassword(e.target.value)} required />
              </div>
              <button type="submit" className="form-submit-btn">SIGN IN</button>
            </form>
          </div>
        </div>
      )}
            <span className="separator">|</span>
            <span className="user-nav-item" onClick={handleTrackOrderClick}>Track Your Order</span>
          </div>
        </div>
      </div>
      <div className="menu-container">
        <div className="sidebar">
          <h3>Menu</h3>
          <div className="filters">
            {filters.map(filter => (
              <div className="filter" key={filter.id}>{renderFilterOptions(filter)}</div>
            ))}
          </div>
        </div>
        <div className="menu-content">
          {loading ? (
            <div className="loading">Loading menu...</div>
          ) : error ? (
            <div className="error">Error: {error}</div>
          ) : (
            categories.map(category => {
              const isCategoryOpen = categoriesOpen[category.id] !== false;
              return (
                <div className="category" key={category.id}>
                  <div className="category-header" onClick={() => toggleCategory(category.id)}>
                    <h3>{category.name}</h3>
                    <span className={`toggle-icon ${isCategoryOpen ? 'open' : 'closed'}`}>▼</span>
                  </div>
                  {isCategoryOpen && renderCategoryItems(category.items)}
                </div>
              );
            })
          )}
        </div>
        <div className="cart-section">
          <h3>My Order</h3>
          <div className="cart-items">
            {cart.length > 0 ? (
              cart.map((item, index) => (
                <div className="cart-item" key={index}>
                  <div className="cart-item-content">
                    <div className="cart-item-image">
                      <img src={item.image} alt={item.name} />
                    </div>
                    <div className="cart-item-details">
                      <div className="cart-item-header">
                        <h4>{item.name}</h4>
                        <div className="item-quantity-controls">
                          <span className="quantity-btn" onClick={() => decreaseQuantity(index)}>-</span>
                          <span className="quantity">{item.quantity}</span>
                          <span className="quantity-btn" onClick={() => increaseQuantity(index)}>+</span>
                          <span className="remove-btn" onClick={() => removeFromCart(index)}>🗑️</span>
                        </div>
                      </div>
                      <div className="cart-item-footer">
                        <div className="note-section">
                          <div className="note-label">Note:</div>
                          <input type="text" className="note-input" placeholder="Note something for store" value={item.note || ''} onChange={(e) => updateNote(index, e.target.value)} />
                        </div>
                        <div className="cart-item-price">{formatCurrency(item.price)}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-cart">Your cart is empty</div>
            )}
          </div>
          {cart.length > 0 && (
            <div className="cart-total">
              <span>Total:</span>
              <span>{formatCurrency(calculateTotal())}</span>
            </div>
          )}
          <button className="checkout-btn" onClick={handleCheckout} disabled={cart.length === 0}>Check Out</button>
        </div>
      </div>
      {showTrackOrderPopup && (
        <div className="auth-modal-overlay">
          <div className="auth-form-modal track-order-modal">
            <h3>Track Your Order</h3>
            <button className="close-modal-btn" onClick={() => setShowTrackOrderPopup(false)}>✕</button>
            {trackOrderHistory.length === 0 ? (
              <form onSubmit={handleTrackOrderSubmit}>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input type="tel" value={trackOrderPhone} onChange={(e) => setTrackOrderPhone(e.target.value)} placeholder="Enter your phone number" required pattern="[0-9]{10}" title="Phone number must be exactly 10 digits" />
                </div>
                {trackOrderError && <div className="error-message" style={{color: 'red', marginBottom: '10px'}}>{trackOrderError}</div>}
                <button type="submit" className="form-submit-btn" disabled={isLoadingTrackOrders}>{isLoadingTrackOrders ? 'Loading...' : 'Track Orders'}</button>
              </form>
            ) : (
              <div className="track-order-results">
                <div className="track-order-header">
                  <h4>Order History for {trackOrderPhone}</h4>
                  <button className="back-btn" onClick={() => { setTrackOrderHistory([]); setTrackOrderPhone(''); setTrackOrderError(''); }}>Search Again</button>
                </div>
                {isLoadingTrackOrders ? (
                  <div className="loading">Loading orders...</div>
                ) : trackOrderHistory.length > 0 ? (
                  <div className="orders-list">
                    {trackOrderHistory.map((order) => (
                      <div key={order.sale_id} className="order-card">
                        <div className="order-header">
                          <div className="order-info">
                            <span className="order-id">Order #{order.sale_id}</span>
                            <span className="order-date">{new Date(order.sale_time).toLocaleDateString()}</span>
                          </div>
                          <div className="order-status">
                            <span className={`status ${order.status.toLowerCase()}`}>{order.status}</span>
                          </div>
                        </div>
                        <div className="order-items">
                          {order.items.map((item, index) => (
                            <div key={index} className="order-item">
                              <img src={item.image_url} alt={item.recipe_name} onError={(e) => { e.target.onerror = null; e.target.src = '/placeholder-food.jpg'; }} />
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
                          <div className="order-total">
                            <span>Total:</span>
                            <span>{formatCurrency(calculateTotalAmountTrack(order.items))}</span>
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
                                  const response = await fetch(`http://localhost:3001/api/orders/guest/complete/${order.sale_id}`, {
                                    method: 'PUT',
                                    headers: { 'Content-Type': 'application/json' },
                                  });
                                  const data = await response.json();
                                  if (response.ok && data.success) {
                                    // Update order status in UI
                                    setTrackOrderHistory(prev => prev.map(o =>
                                      o.sale_id === order.sale_id ? { ...o, status: 'Completed' } : o
                                    ));
                                    alert('Order marked as completed!');
                                  } else {
                                    alert(data.message || 'Failed to mark order as completed');
                                  }
                                } catch (error) {
                                  alert('Failed to mark order as completed. Please try again.');
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
                  <div className="no-orders"><p>No orders found for this phone number.</p></div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
      {showDetailPopup && selectedRecipe && recipeDetails[selectedRecipe] && (
        <div className="detail-popup-overlay" onClick={closeDetailPopup}>
          <div className="detail-popup" onClick={(e) => e.stopPropagation()}>
            <button className="close-popup-btn" onClick={closeDetailPopup}>✕</button>
            <div className="detail-popup-content">
              <div className="detail-popup-image">
                <img src={`/assets/${selectedRecipe}.jpg`} alt={recipeDetails[selectedRecipe].name} onError={(e) => { if (e.target.src.includes('.jpg')) { e.target.src = `/assets/${selectedRecipe}.webp`; } }} />
              </div>
              <div className="detail-popup-info">
                <h3>{recipeDetails[selectedRecipe].name}</h3>
                <p className="detail-description">{recipeDetails[selectedRecipe].description}</p>
                <ul className="nutrition-list">
                  <li><strong>Calories:</strong> {recipeDetails[selectedRecipe].calories}</li>
                  <li><strong>Protein:</strong> {recipeDetails[selectedRecipe].protein}g</li>
                  <li><strong>Fat:</strong> {recipeDetails[selectedRecipe].fat}g</li>
                  <li><strong>Fiber:</strong> {recipeDetails[selectedRecipe].fiber}g</li>
                  <li><strong>Carb:</strong> {recipeDetails[selectedRecipe].carb}g</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
      {showForgotPasswordForm && (
        <div className="auth-modal-overlay">
          <div className="auth-form-modal">
            <h3>Forgot Password?</h3>
            <button className="close-modal-btn" onClick={() => setShowForgotPasswordForm(false)}>✕</button>
            <form onSubmit={async (e) => {
              e.preventDefault();
              const email = userEmail;
              if (!email) { showNotification('Please enter your email address.', 'error'); return; }
              try {
                showNotification('Sending password reset link...', 'info');
                const response = await fetch('http://localhost:3001/api/forgot-password', {
                  method: 'POST', headers: { 'Content-Type': 'application/json', }, body: JSON.stringify({ email }),
                });
                const data = await response.json();
                if (response.ok) {
                  showNotification(data.message || 'If your email is in our system, you will receive a password reset link shortly.', 'success');
                  setShowForgotPasswordForm(false); setUserEmail('');
                } else {
                  showNotification(data.message || 'Failed to send reset link. Please try again.', 'error');
                }
              } catch (error) {
                showNotification('An error occurred while trying to send the reset link. Please try again later.', 'error');
              }
            }}>
              <div className="form-group">
                <label>Email</label>
                <input type="email" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} required />
              </div>
              <button type="submit" className="form-submit-btn">Send Reset Link</button>
            </form>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}

export default MenuPage;
