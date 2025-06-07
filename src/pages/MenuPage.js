import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import FoodItem from '../components/FoodItem';
import Footer from '../components/Footer';
import './MenuPage.css';

function MenuPage() {
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
  
  // New state variable for forgot password modal
  const [showForgotPasswordForm, setShowForgotPasswordForm] = useState(false);

  // New state variables for fetched data
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

  // Đồng bộ state với props
  useEffect(() => {
    if (userAddress) setUserAddress(userAddress);
  }, [userAddress, setUserAddress]);
  
  useEffect(() => {
    if (userAddress !== userAddress && setUserAddress) setUserAddress(userAddress);
  }, [userAddress, setUserAddress, userAddress]);

  // Fetch recipes when component mounts or filters change
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
        
        // Transform categories data
        setCategories(data);
        
        // Transform recipe details
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
        console.error('Error fetching recipes:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [selectedFilters]);

  // Update the useEffect hook for auth modal
  useEffect(() => {
    // Only show auth modal if user is not authenticated
    if (authStatus !== 'signedIn' && !showAuthModal) {
      console.log('MenuPage: Initial auth check - showing auth modal');
      setShowAuthModal(true);
    }
  }, [authStatus]);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  
  const toggleFilter = (filterId) => {
    setFiltersOpen(prev => ({
      ...prev,
      [filterId]: !prev[filterId]
    }));
  };
  
  const toggleCategory = (categoryId) => {
    setCategoriesOpen(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const toggleNote = (itemId) => {
    setNoteOpen(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const showRecipeDetails = (recipeId) => {
    setSelectedRecipe(recipeId);
    setShowDetailPopup(true);
  };
  
  const closeDetailPopup = () => {
    setShowDetailPopup(false);
    setSelectedRecipe(null);
  };

  const handleAccountClick = (e) => {
    e.preventDefault();
    if (authStatus === 'signedIn') {
      navigate('/account');
    } else {
      console.log('MenuPage: Showing auth modal from account click');
      setShowAuthModal(true);
    }
  };

  const onAuthSuccess = (status) => {
    console.log('MenuPage: onAuthSuccess called with status:', status);
    // Only close forms if authentication was successful
    if (status === 'signedIn') {
      setShowAuthModal(false);
      setShowSignInForm(false);
      setShowCreateAccountForm(false);
      // Close forgot password form if it was open
      setShowForgotPasswordForm(false);
    }
  };

  const filters = [
    { id: 'calories', name: 'Calories', options: ['All', '< 300', '300 - 500', '> 500'] },
    { id: 'protein', name: 'Main Protein', options: ['All', 'Salmon', 'Tuna', 'Chicken', 'Shrimp', 'Scallop', 'Tofu'] }
  ];

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  const handleCheckout = () => {
    console.log('MenuPage: Checkout clicked', {
      authStatus,
      userData,
      cartLength: cart.length
    });

    if (cart.length === 0) {
      alert("Your cart is empty");
      return;
    }

    if (authStatus === 'guest') {
      console.log('MenuPage: Proceeding as guest user');
      navigate('/delivery');
    } else if (authStatus === 'signedIn') {
      console.log('MenuPage: Proceeding as signed-in user', { userData });
      navigate('/checkout');
    } else {
      console.log('MenuPage: User not authenticated, showing auth modal');
      setShowAuthModal(true);
    }
  };

  const handleFilterChange = (filterType, value) => {
    setSelectedFilters(prev => {
      // If "All" is selected or the same value is clicked again, clear the filter
      if (value === 'All' || prev[filterType] === value) {
        const newFilters = { ...prev };
        delete newFilters[filterType];
        return newFilters;
      }
      // Otherwise, update with the new value
      return { ...prev, [filterType]: value };
    });
  };

  const renderFilterOptions = (filter) => {
    const isOpen = filtersOpen[filter.id] !== false;
    return (
      <div className="filter-block">
        <div className="filter-header">
          <h4>{filter.name}</h4>
          <span 
            className={`filter-toggle ${isOpen ? 'open' : 'closed'}`}
            onClick={() => toggleFilter(filter.id)}
          >
            ▼
          </span>
        </div>
        {isOpen && (
          <div className="filter-options">
            {filter.options.map((option) => (
              <label key={option} className="filter-option">
                <input
                  type="radio"
                  name={filter.id}
                  value={option}
                  checked={selectedFilters[filter.id] === option}
                  onChange={() => handleFilterChange(filter.id, option)}
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderCategoryItems = (items) => {
    if (loading) {
      return <div className="loading">Loading...</div>;
    }

    if (error) {
      return <div className="error">Error: {error}</div>;
    }

    return (
      <div className="category-items">
        {items.map(item => {
          const recipeId = `RCP-${String(item.id).padStart(3, '0')}`;
          const formattedPrice = formatCurrency(item.price);
          return (
            <FoodItem
              key={item.id}
              product={item}
              onAddToCart={addToCart}
              showDetails={() => showRecipeDetails(recipeId)}
              formattedPrice={formattedPrice}
            />
          );
        })}
      </div>
    );
  };

  const showNotification = (message, type = 'info') => {
    setNotification({ show: true, message, type });
    // Auto hide notification after 5 seconds
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 5000);
  };

  // Helper to format currency (assuming item.price is in a base unit and needs conversion)
  const formatCurrency = (amount) => {
    // Convert to integer to remove decimals, then to string
    const amountStr = Math.floor(amount).toString();
    // Use regex to add dot as thousand separator
    const formattedAmount = amountStr.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return `${formattedAmount} vnd`;
  };

  const handleCreateAccountSubmit = async (e) => {
    e.preventDefault();
    
    // Validate first name
    const firstNameInput = e.target.querySelector('input[name="firstName"]');
    if (!firstNameInput.value) {
      firstNameInput.setCustomValidity('This field is required');
      firstNameInput.reportValidity();
      return;
    } else if (!/^[A-Za-z]+$/.test(firstNameInput.value)) {
      firstNameInput.setCustomValidity('First name should contain only letters');
      firstNameInput.reportValidity();
      return;
    }
    firstNameInput.setCustomValidity('');

    // Validate last name
    const lastNameInput = e.target.querySelector('input[name="lastName"]');
    if (!lastNameInput.value) {
      lastNameInput.setCustomValidity('This field is required');
      lastNameInput.reportValidity();
      return;
    } else if (!/^[A-Za-z]+$/.test(lastNameInput.value)) {
      lastNameInput.setCustomValidity('Last name should contain only letters');
      lastNameInput.reportValidity();
      return;
    }
    lastNameInput.setCustomValidity('');

    // Validate contact mobile
    const contactInput = e.target.querySelector('input[name="contactMobile"]');
    if (!contactInput.value) {
      contactInput.setCustomValidity('This field is required');
      contactInput.reportValidity();
      return;
    } else if (!/^\d{10}$/.test(contactInput.value)) {
      contactInput.setCustomValidity('Contact number must be exactly 10 digits');
      contactInput.reportValidity();
      return;
    }
    contactInput.setCustomValidity('');

    // If all validations pass, proceed with form submission
    const newAddress = {
      ward,
      district,
      street,
      houseNumber,
      buildingName,
      block,
      floor,
      roomNumber,
      deliveryInstructions,
      fullName: `${firstName} ${lastName}`,
      contactMobile
    };

    const userInfo = {
      email: userEmail,
      firstName,
      lastName,
      contactMobile,
      password: userPassword
    };

    try {
      showNotification('Creating your account...', 'info');
      await handleCreateAccount(newAddress, userInfo);
      showNotification('Account created successfully! Welcome to Greedible!', 'success');
      setShowCreateAccountForm(false);
      setShowAuthModal(false);
      // Clear form fields
      setUserEmail('');
      setUserPassword('');
      setFirstName('');
      setLastName('');
      setContactMobile('');
      setWard('');
      setDistrict('');
      setStreet('');
      setHouseNumber('');
      setBuildingName('');
      setBlock('');
      setFloor('');
      setRoomNumber('');
      setDeliveryInstructions('');
    } catch (error) {
      showNotification(error.message || 'Failed to create account. Please try again.', 'error');
    }
  };

  // Add validation message handler
  const handleInvalid = (e) => {
    e.preventDefault();
    e.target.setCustomValidity('');
    if (!e.target.validity.valid) {
      if (e.target.validity.valueMissing) {
        e.target.setCustomValidity('This field is required');
      } else if (e.target.validity.patternMismatch) {
        e.target.setCustomValidity(e.target.title);
      }
    }
  };

  // Clear validation message on input
  const handleInput = (e) => {
    e.target.setCustomValidity('');
  };

  // Handle Forgot Password click
  const handleForgotPasswordClick = (e) => {
    e.preventDefault();
    setShowSignInForm(false);
    setShowForgotPasswordForm(true);
  };

  return (
    <div className="menu-page">
      {notification.show && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
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
        <div
          className={`overlay ${menuOpen ? 'active' : ''}`}
          ref={overlayRef}
          onClick={toggleMenu}
        ></div>
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
              <span className="user-nav-item" onClick={handleAccountClick}>Sign In</span>
            )}
            {authStatus !== 'signedIn' && (
              <>
                <span className="separator">|</span>
                <span className="user-nav-item" onClick={() => navigate('/guest-order')}>Guest Order</span>
              </>
            )}
            <span className="separator">|</span>
            <span className="user-nav-item" onClick={() => navigate('/track-order')}>Track Your Order</span>
          </div>
        </div>
      </div>

      <div className="menu-container">
        <div className="sidebar">
          <h3>Menu</h3>
          <div className="filters">
            {filters.map(filter => (
              <div className="filter" key={filter.id}>
                {renderFilterOptions(filter)}
              </div>
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
                  <div 
                    className="category-header"
                    onClick={() => toggleCategory(category.id)}
                  >
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
                          <input 
                            type="text" 
                            className="note-input" 
                            placeholder="Note something for store" 
                            value={item.note || ''}
                            onChange={(e) => updateNote(index, e.target.value)}
                          />
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
          <button 
            className="checkout-btn" 
            onClick={handleCheckout}
            disabled={cart.length === 0}
          >
            Check Out
          </button>
        </div>
      </div>
      
      {showAuthModal && (
        <div className="auth-modal-overlay">
          <div className="auth-modal">
            <h3>Sign in to Greedible and start Green today</h3>
            <div className="auth-options">
              <button className="auth-option-btn sign-in-btn" onClick={() => setShowSignInForm(true)}>
                SIGN IN
              </button>
              <div className="auth-separator"></div>
              <button className="auth-option-btn create-account-btn" onClick={() => setShowCreateAccountForm(true)}>
                CREATE AN ACCOUNT
                <span className="account-time">in less than 2 minutes</span>
                <span className="account-benefits">To enjoy member benefits</span>
              </button>
              <div className="auth-separator"></div>
              <button className="auth-option-btn guest-btn" onClick={() => {
                continueAsGuest();
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
                <input 
                  type="email" 
                  value={userEmail} 
                  onChange={(e) => setUserEmail(e.target.value)} 
                  required 
                  onInvalid={(e) => {
                    e.preventDefault();
                    e.target.setCustomValidity('');
                    if (e.target.validity.valueMissing) {
                      e.target.setCustomValidity('This field is required');
                    }
                  }}
                  onInput={(e) => e.target.setCustomValidity('')}
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input 
                  type="password" 
                  value={userPassword} 
                  onChange={(e) => setUserPassword(e.target.value)} 
                  required 
                  onInvalid={(e) => {
                    e.preventDefault();
                    e.target.setCustomValidity('');
                    if (e.target.validity.valueMissing) {
                      e.target.setCustomValidity('This field is required');
                    }
                  }}
                  onInput={(e) => e.target.setCustomValidity('')}
                />
              </div>
              <div className="form-options">
                <div className="remember-me">
                  <input type="checkbox" id="remember" />
                  <label htmlFor="remember">Remember me</label>
                </div>
                <a href="#" className="forgot-password" onClick={handleForgotPasswordClick}>Forgot password?</a>
              </div>
              <button type="submit" className="form-submit-btn">SIGN IN</button>
            </form>
          </div>
        </div>
      )}

      {showCreateAccountForm && (
        <div className="auth-modal-overlay">
          <div className="auth-form-modal register-form">
            <h3>Create New Account</h3>
            <button className="close-modal-btn" onClick={() => setShowCreateAccountForm(false)}>✕</button>
            <form onSubmit={handleCreateAccountSubmit}>
              <div className="form-section">
                <div className="form-group">
                  <label>Email</label>
                  <input 
                    type="email" 
                    value={userEmail} 
                    onChange={(e) => setUserEmail(e.target.value)} 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <input 
                    type="password" 
                    value={userPassword} 
                    onChange={(e) => setUserPassword(e.target.value)} 
                    required 
                  />
                </div>
              </div>
              <div className="form-section">
                <h4>About you</h4>
                <div className="form-group">
                  <label>First Name</label>
                  <input 
                    name="firstName"
                    type="text" 
                    value={firstName} 
                    onChange={(e) => setFirstName(e.target.value)}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input 
                    name="lastName"
                    type="text" 
                    value={lastName} 
                    onChange={(e) => setLastName(e.target.value)}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Contact Mobile</label>
                  <input 
                    name="contactMobile"
                    type="tel" 
                    value={contactMobile} 
                    onChange={(e) => setContactMobile(e.target.value)}
                    required 
                    pattern="[0-9]{10}"
                    title="Contact number must be exactly 10 digits"
                  />
                </div>
              </div>
              <div className="form-section" style={{maxHeight: '300px', overflowY: 'auto'}}>
                <h4>Your Address</h4>
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
                      name="houseNumber"
                      value={houseNumber}
                      onChange={(e) => setHouseNumber(e.target.value)}
                      required
                      pattern="\d+"
                      title="House/Street Number must be a number"
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
                      name="floor"
                      value={floor}
                      onChange={(e) => setFloor(e.target.value)}
                      pattern="\d+"
                      title="Floor/Level must be a number"
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
              </div>
              <button type="submit" className="form-submit-btn">Confirm</button>
            </form>
          </div>
        </div>
      )}

      {showDetailPopup && selectedRecipe && recipeDetails[selectedRecipe] && (
        <div className="detail-popup-overlay" onClick={closeDetailPopup}>
          <div className="detail-popup" onClick={(e) => e.stopPropagation()}>
            <button className="close-popup-btn" onClick={closeDetailPopup}>✕</button>
            <div className="detail-popup-content">
              <div className="detail-popup-image">
                <img 
                  src={`/assets/${selectedRecipe}.jpg`}
                  alt={recipeDetails[selectedRecipe].name}
                  onError={(e) => {
                    if (e.target.src.includes('.jpg')) {
                      e.target.src = `/assets/${selectedRecipe}.webp`;
                    }
                  }}
                />
              </div>
              <div className="detail-popup-info">
                <h3>{recipeDetails[selectedRecipe].name}</h3>
                <p className="detail-description">
                  {recipeDetails[selectedRecipe].description}
                </p>
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

              if (!email) {
                // Basic validation - though the input field is required, adding this check
                console.log('Email field is empty');
                // Using existing showNotification for simplicity for now. Can refine later if needed.
                showNotification('Please enter your email address.', 'error');
                return;
              }

              try {
                showNotification('Sending password reset link...', 'info');
                // Assume backend endpoint for forgot password is /api/forgot-password
                const response = await fetch('http://localhost:3001/api/forgot-password', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ email }),
                });

                const data = await response.json();

                if (response.ok) {
                  showNotification(data.message || 'If your email is in our system, you will receive a password reset link shortly.', 'success');
                  setShowForgotPasswordForm(false);
                  setUserEmail(''); // Clear email field
                } else {
                  // Handle backend errors (e.g., email not found)
                  showNotification(data.message || 'Failed to send reset link. Please try again.', 'error');
                }

              } catch (error) {
                console.error('Error sending password reset email:', error);
                showNotification('An error occurred while trying to send the reset link. Please try again later.', 'error');
              }
            }}>
              <div className="form-group">
                <label>Email</label>
                <input 
                  type="email" 
                  value={userEmail} 
                  onChange={(e) => setUserEmail(e.target.value)} 
                  required 
                />
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