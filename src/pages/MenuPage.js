import React, { useState, useRef, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import './MenuPage.css';

function MenuPage() {
  const { cart, setCart, authStatus, setAuthStatus, userAddress, setUserAddress, hasChosenGuest, setHasChosenGuest } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const [filtersOpen, setFiltersOpen] = useState({});
  const [categoriesOpen, setCategoriesOpen] = useState({});
  const [noteOpen, setNoteOpen] = useState({});
  const navRef = useRef(null);
  const overlayRef = useRef(null);
  const [showDetailPopup, setShowDetailPopup] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [recipeDetails, setRecipeDetails] = useState({});
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [tempItemToAdd, setTempItemToAdd] = useState(null);
  const [showSignInForm, setShowSignInForm] = useState(false);
  const [showCreateAccountForm, setShowCreateAccountForm] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [contactMobile, setContactMobile] = useState('');

  const [imageFormats, setImageFormats] = useState({});

  // Show auth modal on page load if not signed in and hasn't chosen guest
  useEffect(() => {
    if (authStatus !== 'signedIn' && !hasChosenGuest) {
      setShowAuthModal(true);
    }
  }, [authStatus, hasChosenGuest]);

  // Fetch recipe details from API
  useEffect(() => {
    let isMounted = true;
    const fetchRecipeDetails = async () => {
      if (isLoading) {
        try {
          const response = await fetch('http://localhost:5000/api/menu/recipes');
          if (!response.ok) {
            throw new Error('Failed to fetch recipe details');
          }
          const data = await response.json();
          
          if (isMounted) {
            console.log('Recipe data from API:', data); // Debug log
            setRecipeDetails(data);

            // Organize recipes into categories
            const categoryMap = {};
            Object.entries(data).forEach(([recipeId, recipe]) => {
              const category = recipe.category || 'Uncategorized';
              if (!categoryMap[category]) {
                categoryMap[category] = {
                  id: Object.keys(categoryMap).length + 1,
                  name: category,
                  items: []
                };
              }
              // Format the recipe ID to match the file naming pattern (RCP-001, RCP-002, etc.)
              const formattedId = `RCP-${String(recipeId).padStart(3, '0')}`;
              const imageUrl = `/assets/${formattedId}.jpg`; // Start with jpg
              console.log('Constructed image URL:', imageUrl); // Debug log
              categoryMap[category].items.push({
                id: recipeId,
                name: recipe.name,
                price: recipe.price || 26.10,
                rating: 5,
                image: imageUrl
              });
            });

            // Convert category map to array and sort by category name
            const categoryList = Object.values(categoryMap).sort((a, b) => a.name.localeCompare(b.name));
            setCategories(categoryList);
            setIsLoading(false);
          }
        } catch (error) {
          console.error('Error fetching recipe details:', error);
          if (isMounted) {
            setIsLoading(false);
          }
        }
      }
    };

    fetchRecipeDetails();

    // Cleanup function to prevent setting state after component unmounts
    return () => {
      isMounted = false;
    };
  }, []); // Empty dependency array since we only want to fetch once on mount

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
      setShowAuthModal(true);
    }
  };

  const filters = [
    { id: 'calories', name: 'Calories', options: ['< 300', '300 - 500', '> 500'] },
    { id: 'protein', name: 'Main Protein', options: ['Salmon', 'Tuna', 'Chicken', 'Shirmp', 'Scallop', 'Tofu'] }
  ];

  const addToCart = (item) => {
    // No need for auth check here since popup is shown on page load
    const existingItemIndex = cart.findIndex(cartItem => cartItem.id === item.id);
    if (existingItemIndex !== -1) {
      const updatedCart = [...cart];
      updatedCart[existingItemIndex].quantity += 1;
      setCart(updatedCart);
    } else {
      setCart([...cart, { ...item, quantity: 1, note: '' }]);
    }
  };

  const removeFromCart = (index) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };

  const increaseQuantity = (index) => {
    const newCart = [...cart];
    newCart[index].quantity += 1;
    setCart(newCart);
  };

  const decreaseQuantity = (index) => {
    const newCart = [...cart];
    if (newCart[index].quantity > 1) {
      newCart[index].quantity -= 1;
      setCart(newCart);
    } else {
      removeFromCart(index);
    }
  };

  const updateNote = (index, note) => {
    const newCart = [...cart];
    newCart[index].note = note;
    setCart(newCart);
  };

  const handleSignIn = () => {
    setShowAuthModal(false);
    setShowSignInForm(true);
  };

  const handleCreateAccount = () => {
    setShowAuthModal(false);
    setShowCreateAccountForm(true);
  };

  const handleNavSignInClick = () => {
    if (authStatus !== 'signedIn') {
      setShowAuthModal(true);
    }
  };

  const handleContinueAsGuest = () => {
    setShowAuthModal(false);
    setAuthStatus('guest');
    setHasChosenGuest(true); // Prevent future popups
    localStorage.setItem('authStatus', 'guest');
    if (tempItemToAdd) {
      const existingItemIndex = cart.findIndex(cartItem => cartItem.id === tempItemToAdd.id);
      if (existingItemIndex !== -1) {
        const updatedCart = [...cart];
        updatedCart[existingItemIndex].quantity += 1;
        setCart(updatedCart);
      } else {
        setCart([...cart, { ...tempItemToAdd, quantity: 1, note: '' }]);
      }
      setTempItemToAdd(null);
    }
  };

  const handleSignInSubmit = (e) => {
    e.preventDefault();
    setAuthStatus('signedIn');
    setHasChosenGuest(true); // Prevent future popups
    localStorage.setItem('authStatus', 'signedIn');
    setShowSignInForm(false);
    setUserEmail('');
    setUserPassword('');
  };

  const handleCreateAccountSubmit = (e) => {
    e.preventDefault();
    setAuthStatus('signedIn');
    setHasChosenGuest(true); // Prevent future popups
    localStorage.setItem('authStatus', 'signedIn');
    setShowCreateAccountForm(false);
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
    setUserAddress(newAddress);
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert("Your cart is empty");
      return;
    }
    if (authStatus === 'guest') {
      navigate('/delivery');
    } else {
      navigate('/checkout');
    }
  };

  const handleImageError = (imageUrl, e) => {
    const baseUrl = imageUrl.replace(/\.(jpg|webp)$/, '');
    const currentFormat = imageFormats[baseUrl] || 'jpg';
    
    if (currentFormat === 'jpg') {
      // If jpg failed, try webp
      const webpUrl = `${baseUrl}.webp`;
      console.log('Trying webp format:', webpUrl);
      setImageFormats(prev => ({ ...prev, [baseUrl]: 'webp' }));
      e.target.src = webpUrl;
    } else {
      // If both formats failed, use placeholder
      console.error('Both formats failed for:', baseUrl);
      e.target.src = '/assets/placeholder.jpg';
    }
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
            {filter.options.map((option, index) => (
              <div className="filter-option" key={index}>
                <input type="radio" id={`${filter.id}-${index}`} name={filter.id} />
                <label htmlFor={`${filter.id}-${index}`}>{option}</label>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderCategoryItems = (items) => {
    return (
      <div className="category-items">
        {items.map(item => {
          const recipeId = item.id;
          return (
            <div className="food-item" key={item.id}>
              <img 
                src={item.image} 
                alt={item.name} 
                className="food-image"
                onError={(e) => handleImageError(item.image, e)}
              />
              <div className="food-details">
                <h4>{item.name}</h4>
                <div className="rating">
                  {Array(5).fill().map((_, i) => (
                    <span key={i} className={i < item.rating ? "star filled" : "star"}>★</span>
                  ))}
                </div>
                <div className="food-actions">
                  <span className="price">${item.price.toFixed(2)}</span>
                  <button className="add-to-cart" onClick={() => addToCart(item)}>Add to cart</button>
                </div>
                {recipeId && recipeDetails[recipeId] && (
                  <div 
                    className="show-more"
                    onClick={() => showRecipeDetails(recipeId)}
                  >
                    Show more
                  </div>
                )}
                </div>
              </div>
            );
          })}
        </div>
      );
    };
  
    const calculateTotal = () => {
      return cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
    };
  
    return (
      <div className="menu-page">
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
            <a href="#">Menu</a>
            <a href="#">Discount</a>
            <img src="/assets/logo.png" alt="Logo" className="logo" />
            <span className="nav-link" onClick={handleAccountClick} style={{ cursor: 'pointer' }}>
              Account
            </span>
            <a href="#">Support</a>
          </div>
        </div>
  
        <div className="user-nav">
          <div className="user-nav-container">
            <div className="user-nav-left">
              <span className="user-icon">👤</span>
              {authStatus === 'signedIn' ? (
                <span className="user-nav-item">User</span>
              ) : (
                <span className="user-nav-item" onClick={handleNavSignInClick}>Sign In</span>
              )}
              <span className="separator">|</span>
              <span className="user-nav-item">Guest Order</span>
              <span className="separator">|</span>
              <span className="user-nav-item">Track Your Order</span>
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
            {categories.map(category => {
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
            })}
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
                          <div className="cart-item-price">{item.price.toFixed(2)}$</div>
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
                <span>${calculateTotal()}</span>
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
                <button className="auth-option-btn sign-in-btn" onClick={handleSignIn}>
                  SIGN IN
                </button>
                <div className="auth-separator"></div>
                <button className="auth-option-btn create-account-btn" onClick={handleCreateAccount}>
                  CREATE AN ACCOUNT
                  <span className="account-time">in less than 2 minutes</span>
                  <span className="account-benefits">To enjoy member benefits</span>
                </button>
                <div className="auth-separator"></div>
                <button className="auth-option-btn guest-btn" onClick={handleContinueAsGuest}>
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
              <form onSubmit={handleSignInSubmit}>
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
                <div className="form-options">
                  <div className="remember-me">
                    <input type="checkbox" id="remember" />
                    <label htmlFor="remember">Remember me</label>
                  </div>
                  <a href="#" className="forgot-password">Forgot password?</a>
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
                      type="text" 
                      value={firstName} 
                      onChange={(e) => setFirstName(e.target.value)} 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label>Last Name</label>
                    <input 
                      type="text" 
                      value={lastName} 
                      onChange={(e) => setLastName(e.target.value)} 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label>Contact Mobile</label>
                    <input 
                      type="tel" 
                      value={contactMobile} 
                      onChange={(e) => setContactMobile(e.target.value)} 
                      required 
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
                      rows={3}
                    />
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
                    src={`/assets/RCP-${String(selectedRecipe).padStart(3, '0')}.jpg`}
                    alt={recipeDetails[selectedRecipe].name}
                    onError={(e) => handleImageError(e.target.src, e)}
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
      </div>
    );
  }
  
  export default MenuPage;