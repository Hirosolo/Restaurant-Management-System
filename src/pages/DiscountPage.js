import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import '../styles/DiscountPage.css';

const DiscountPage = () => {
  const [expandedImage, setExpandedImage] = useState(null);

  const handleImageClick = (index) => {
    if (expandedImage === index) {
      setExpandedImage(null);
    } else {
      setExpandedImage(index);
    }
  };

  return (
    <div className="discount-page">
      
      <div className="navbar menu-navbar">
        <div className="nav-links" >
          <a href="/">Home</a>
          <a href="/menu">Menu</a>
          <img src="/assets/logo.png" alt="Logo" className="logo" />
          <a href="/discount">Discount</a>
          <a href="/support">Support</a>
        </div>
      </div>
      
      <div className="discount-container">
        <div className="discount-images">
          <div 
            className={`image-item ${expandedImage === 0 ? 'expanded' : ''}`}
            onClick={() => handleImageClick(0)}
          >
            <img 
              src="/assets/morning-energy.jpg" 
              alt="Morning Energy" 
            />
          </div>
          <div 
            className={`image-item ${expandedImage === 1 ? 'expanded' : ''}`}
            onClick={() => handleImageClick(1)}
          >
            <img 
              src="/assets/special-food-menu.jpg" 
              alt="Special Food Menu" 
            />
          </div>
          <div 
            className={`image-item ${expandedImage === 2 ? 'expanded' : ''}`}
            onClick={() => handleImageClick(2)}
          >
            <img 
              src="/assets/loyalty-card.jpg" 
              alt="Loyalty Card" 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscountPage; 