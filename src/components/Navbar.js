import React, { useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import CreateAccountForm from './CreateAccountForm';
import SignInForm from './SignInForm';
import AuthModal from './AuthModal';
import styles from '../styles/Navbar.module.css';

/* Component thanh điều hướng */
function Navbar({ menuOpen, setMenuOpen }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { authStatus } = useAuth();
  const navRef = useRef(null);
  const overlayRef = useRef(null);
  
  // Thêm state cho modals
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSignInForm, setShowSignInForm] = useState(false);
  const [showCreateAccountForm, setShowCreateAccountForm] = useState(false);
  const [tempItemToAdd, setTempItemToAdd] = useState(null);

  /* Bật/tắt menu mobile */
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  /* Xử lý nhấn liên kết tài khoản */
  const handleAccountClick = (e) => {
    e.preventDefault();
    
    if (localStorage.getItem('authStatus') === 'signedIn') {
      console.log('Navbar: User is signed in, navigating to account');
      window.location.href = '/account';
    } else {
      console.log('Navbar: User is not signed in, showing auth modal');
      setShowAuthModal(true);
    }
  };

  /* Xử lý điều hướng */
  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <>
      <div className={styles.navbar}>
        {/* Menu cho mobile */}
        <div 
          className={`${styles.menuIcon} ${menuOpen ? styles.open : ''}`} 
          onClick={toggleMenu}
        >
          <div className={styles.bar}></div>
          <div className={styles.bar}></div>
          <div className={styles.bar}></div>
        </div>
        
        <div className={styles.mobileLogo}>
          <img 
            src="/assets/logo.png"
            alt="Logo" 
            className={styles.logo} 
          />
        </div>
        
        {/* Overlay khi menu mobile mở */}
        <div 
          ref={overlayRef}
          className={`${styles.overlay} ${menuOpen ? styles.active : ''}`}
          onClick={toggleMenu}
        ></div>
        
        {/* Menu chính */}
        <div 
          ref={navRef}
          className={`${styles.navContainer} ${menuOpen ? styles.active : ''}`}
        >
          <div 
            className={styles.navItem} 
            onClick={() => handleNavigation('/')}
          >
            Home
          </div>
          
          <div 
            className={styles.navItem} 
            onClick={() => handleNavigation('/menu')}
          >
            Menu
          </div>
          
          <div 
            className={styles.navItem} 
            onClick={() => handleNavigation('/discount')}
          >
            Discount
          </div>
          
          <div 
            className={styles.navItem} 
            onClick={() => handleNavigation('/support')}
          >
            Support
          </div>

          <div className={styles.logoContainer}>
            <img 
              src="/assets/logo.png" 
              alt="Logo" 
              className={styles.desktopLogo} 
              onClick={() => handleNavigation('/')}
            />
          </div>

          {/* Account and Dashboard links */}
          <div 
            className={styles.navItem} 
            onClick={handleAccountClick}
          >
            Account
          </div>
          
          {authStatus === 'staff' && (
            <div 
              className={styles.navItem} 
              onClick={() => handleNavigation('/dashboard')}
            >
              Dashboard
            </div>
          )}
        </div>
      </div>

      {/* Hiển thị AuthModal khi cần */}
      {showAuthModal && (
        <AuthModal
          setShowAuthModal={setShowAuthModal}
          setShowSignInForm={setShowSignInForm}
          setShowCreateAccountForm={setShowCreateAccountForm}
          tempItemToAdd={tempItemToAdd}
          setTempItemToAdd={setTempItemToAdd}
        />
      )}

      {/* Thêm forms đăng nhập/đăng ký nếu cần */}
      {showSignInForm && (
        <SignInForm 
          setShowSignInForm={setShowSignInForm} 
          tempItemToAdd={tempItemToAdd}
          setTempItemToAdd={setTempItemToAdd}
        />
      )}

      {showCreateAccountForm && (
        <CreateAccountForm 
          setShowCreateAccountForm={setShowCreateAccountForm}
          tempItemToAdd={tempItemToAdd}
          setTempItemToAdd={setTempItemToAdd}
        />
      )}
    </>
  );
}

export default Navbar;