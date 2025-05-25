import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom'; // Thêm import này
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { CartProvider } from '../contexts/CartContext';
import { AuthProvider } from '../contexts/AuthContext';
import AuthModal from '../components/AuthModal';
import Navbar from '../components/Navbar';
import UserNav from '../components/UserNav';
import Sidebar from '../components/Sidebar';
import MenuContent from '../components/MenuContent';
import CartSection from '../components/CartSection';
import './MenuPage.css'; 
import Footer from '../components/Footer';
import SignInForm from '../components/SignInForm';
import CreateAccountForm from '../components/CreateAccountForm';
import { categories } from '../data/menuData';

function MenuPage({ 
  cart: propCart, 
  setCart: setPropCart, 
  authStatus: propAuthStatus, 
  setAuthStatus: setPropAuthStatus,
  userAddress: propUserAddress,
  setUserAddress: setPropUserAddress 
}) {
  // State cho menu và danh mục
  const [menuOpen, setMenuOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState({
    'main-meals': true,
    'salads': false,
    'pasta-noodles': false,
    'rice-dishes': false,
    'soups': false,
    'side-dishes': false
  });
  
  // State cho bộ lọc
  const [filtersOpen, setFiltersOpen] = useState({ 
    calories: true, 
    protein: true 
  });
  
  // State cho popup và modal
  const [showDetailPopup, setShowDetailPopup] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  // State cho thanh toán và đăng nhập
  const [tempItemToAdd, setTempItemToAdd] = useState(null);
  const [showSignInForm, setShowSignInForm] = useState(false);
  const [showCreateAccountForm, setShowCreateAccountForm] = useState(false);
  
  // Khởi tạo isLoggedIn trực tiếp
  const [isLoggedIn, setIsLoggedIn] = useState(
    propAuthStatus === 'signedIn' || localStorage.getItem('authStatus') === 'signedIn'
  );

  const navigate = useNavigate(); // Khởi tạo useNavigate
  
  // Toggle mở/đóng danh mục
  const toggleCategory = useCallback((categoryId) => {
    setCategoriesOpen(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  }, []);

  // Toggle mở/đóng bộ lọc
  const toggleFilter = useCallback((filterId) => {
    setFiltersOpen(prev => ({
      ...prev,
      [filterId]: !prev[filterId]
    }));
  }, []);

  // Hiển thị chi tiết công thức
  const showRecipeDetails = useCallback((recipeId) => {
    setSelectedRecipe(recipeId);
    setShowDetailPopup(true);
  }, []);

  // Xử lý khi nhấn nút Sign In
  const handleSignInClick = useCallback(() => {
    setShowAuthModal(true);
  }, []);

  const { addToCart } = useCart();

  // Xử lý khi thêm món vào giỏ hàng
  const handleAddToCart = useCallback((item) => {
    console.log('MenuPage: handleAddToCart called', { item, isLoggedIn });
    
    // Kiểm tra trạng thái đăng nhập
    const currentAuthStatus = isLoggedIn || localStorage.getItem('authStatus') === 'signedIn';
    
    if (currentAuthStatus) {
      console.log('MenuPage: User is logged in, adding item directly');
      addToCart(item);
    } else {
      console.log('MenuPage: User is not logged in, showing AuthModal');
      setTempItemToAdd(item);
      setShowAuthModal(true);
    }
  }, [isLoggedIn, addToCart, setTempItemToAdd, setShowAuthModal]);

  // Callback khi đăng nhập/đăng ký/guest thành công
  const handleAuthSuccess = useCallback((newAuthStatus) => {
    console.log('MenuPage: Auth success with status', newAuthStatus);
    setIsLoggedIn(newAuthStatus === 'signedIn');
    
    if (setPropAuthStatus) {
      setPropAuthStatus(newAuthStatus);
    }

    // Điều hướng đến /checkout nếu đăng nhập thành công
    if (newAuthStatus === 'signedIn') {
      navigate('/checkout');
    }
  }, [setPropAuthStatus, navigate]);
  
  return (
    <div className="menu-page">
      {/* Navbar chính */}
      <Navbar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      
      {/* UserNav (phần điều hướng người dùng) */}
      <div className="user-nav-container">
        <UserNav onSignInClick={handleSignInClick} />
      </div>
      
      {/* Container chính cho nội dung menu */}
      <div className="menu-content-container">
        {/* Sidebar bên trái */}
        <div className="sidebar-container">
          <Sidebar 
            filtersOpen={filtersOpen} 
            toggleFilter={toggleFilter} 
          />
        </div>
        
        {/* Khu vực hiển thị sản phẩm */}
        <div className="products-area">
          <MenuContent 
            categoriesOpen={categoriesOpen} 
            toggleCategory={toggleCategory} 
            showRecipeDetails={showRecipeDetails} 
            onAddToCart={handleAddToCart}
          />
        </div>
        
        {/* Khu vực giỏ hàng */}
        <div className="cart-area">
          <CartSection />
        </div>
      </div>
      
      {/* Hiển thị modal đăng nhập nếu cần */}
      {showAuthModal && (
        <AuthModal 
          setShowAuthModal={setShowAuthModal}
          setShowSignInForm={setShowSignInForm}
          setShowCreateAccountForm={setShowCreateAccountForm}
          tempItemToAdd={tempItemToAdd}
          setTempItemToAdd={setTempItemToAdd}
          onAuthSuccess={handleAuthSuccess}
        />
      )}

      {/* Hiển thị form đăng nhập nếu cần */}
      {showSignInForm && (
        <SignInForm 
          setShowSignInForm={setShowSignInForm} 
          tempItemToAdd={tempItemToAdd}
          setTempItemToAdd={setTempItemToAdd}
          onAuthSuccess={handleAuthSuccess}
        />
      )}

      {/* Hiển thị form tạo tài khoản nếu cần */}
      {showCreateAccountForm && (
        <CreateAccountForm 
          setShowCreateAccountForm={setShowCreateAccountForm} 
          tempItemToAdd={tempItemToAdd}
          setTempItemToAdd={setTempItemToAdd}
          onAuthSuccess={handleAuthSuccess}
        />
      )}
      
      <Footer/>
    </div>
  );
}

export default MenuPage;