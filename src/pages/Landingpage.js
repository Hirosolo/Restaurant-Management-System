import { Link, useNavigate } from 'react-router-dom';
import React, { useState, useRef } from 'react';
import Navbar from '../components/Navbar';
import UserNav from '../components/UserNav';
import './Landingpage.css';
import Footer from '../components/Footer';

function Landingpage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef(null);
  const overlayRef = useRef(null);
  const navigate = useNavigate();

  // Navbar now handles all auth/account popups globally

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleOrderNow = () => {
    navigate('/menu');
  };

  return (
    <div className="landing-page">
      <UserNav />
      <Navbar />
      <div className="container">
        {/* Navbar */}
        <div className="navbar">
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
            <a href="">Home</a>
            <Link to="/menu" onClick={toggleMenu}>Menu</Link>
            <img src="/assets/logo.png" alt="Logo" className="logo" />
            <a href="/discount">Discount</a>
            <a href="/support">Support</a>
          </div>
        </div>

        {/* Banner */}
        <div className="banner">
          <img src="/assets/slogan.png" alt="Greedible Banner" className="banner-img" />
        </div>

        {/* Menu Sections */}
        <div className="menu-section">

          {/* --- Main Meals --- */}
          <div className="menu-item main-meals">
            <img src="/assets/RCP-001.jpg" alt="Main Meals" className="menu-image" />
            <div className="menu-details">
              <div>
                <div className="menu-title">Main Meals</div>
                <div className="menu-description">
                This group includes hearty dishes packed with protein like salmon, chicken, shrimp, meatballs, and burgers. These are full-portion meals meant to satisfy hunger and provide essential nutrients—perfect as the centerpiece of any lunch or dinner.
                </div>
              </div>
              <button className="order-btn" onClick={handleOrderNow}>Order now</button>
            </div>
          </div>

          {/* --- Salads --- */}
          <div className="menu-item salads">
            <div className="menu-details">
              <div>
                <div className="menu-title">Salads</div>
                <div className="menu-description">
                These refreshing salads combine fresh greens with protein sources like smoked salmon, grilled chicken, or tofu. Light yet nutritious, they're ideal for a healthy meal or a quick, energizing lunch.
                </div>
              </div>
              <button className="order-btn" onClick={handleOrderNow}>Order now</button>
            </div>
            <img src="/assets/RCP-009.jpg" alt="Salads" className="menu-image" />
          </div>

          {/* --- Pasta & Noodles --- */}
          <div className="menu-item pasta-noodles">
          <img src="/assets/RCP-021.jpg" alt="Pasta&Noodles" className="menu-image" />
            <div className="menu-details">
             
              <div>
                <div className="menu-title">Pasta & Noodles</div>
                <div className="menu-description">
                A variety of pasta dishes featuring everything from light tomato sauces to rich creamy shrimp sauces. These meals are comforting, flavorful, and inspired by Italian cuisine—great for those craving something savory and satisfying.
                </div>
              </div>
              <button className="order-btn" onClick={handleOrderNow}>Order now</button>
            </div>
          </div>

          {/* --- Rice Dishes --- */}
          <div className="menu-item rice-dishes">
            <div className="menu-details">
              <div>
                <div className="menu-title">Rice Dishes</div>
                <div className="menu-description">
                Including fried rice with shrimp or tofu, these meals are influenced by Asian cuisine and are quick, filling options. Perfect for an easy, well-rounded meal at lunch or dinner.
                </div>
              </div>
              <button className="order-btn" onClick={handleOrderNow}>Order now</button>
            </div>
            <img src="/assets/RCP-022.webp" alt="Rice Dishes" className="menu-image" />
          </div>

          {/* --- Soups --- */}
          <div className="menu-item soups">
          <img src="/assets/RCP-031.jpg" alt="Soups" className="menu-image" />
            <div className="menu-details">
              <div>
                <div className="menu-title">Soups</div>
                <div className="menu-description">
                Warm and light, this group features classics like bean soup, carrot soup, and tomato soup. They're great as appetizers or for a comforting, nutritious light meal on chilly days.
                </div>
              </div>
              <button className="order-btn" onClick={handleOrderNow}>Order now</button>
            </div>
          </div>

          {/* --- Side Dishes --- */}
          <div className="menu-item side-dishes">
            <div className="menu-details">
              <div>
                <div className="menu-title">Side Dishes</div>
                <div className="menu-description">
                These lighter items, like lettuce wraps, pan-seared scallops, and garlic butter salmon, are typically served alongside main meals to enhance flavor or as tasty small bites.
                </div>
              </div>
              <button className="order-btn" onClick={handleOrderNow}>Order now</button>
            </div>
            <img src="/assets/RCP-027.jpg" alt="Side Dishes" className="menu-image" />
          </div>

          {/* Spacer */}
          <div className="spacer"></div>

          {/* Logo section */}
          <div className="logo-section">
            <img src="./assets/message.png" alt="Greedible Message" className="green-logo" />
          </div>
          </div>
          </div>

          <Footer />
    </div>
  );
}

export default Landingpage;
