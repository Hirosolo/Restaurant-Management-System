import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
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

  // Handle body scroll when image is expanded
  useEffect(() => {
    if (expandedImage !== null) {
      document.body.classList.add('image-expanded');
    } else {
      document.body.classList.remove('image-expanded');
    }

    // Cleanup on unmount
    return () => {
      document.body.classList.remove('image-expanded');
    };
  }, [expandedImage]);

  // Handle escape key to close expanded image
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape' && expandedImage !== null) {
        setExpandedImage(null);
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [expandedImage]);

  // Handle click outside image to close
  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) {
      setExpandedImage(null);
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
            onClick={expandedImage === 0 ? handleBackdropClick : () => handleImageClick(0)}
          >
            <img 
              src="/assets/morning-energy.jpg" 
              alt="Morning Energy" 
            />
          </div>
          <div 
            className={`image-item ${expandedImage === 1 ? 'expanded' : ''}`}
            onClick={expandedImage === 1 ? handleBackdropClick : () => handleImageClick(1)}
          >
            <img 
              src="/assets/special-food-menu.jpg" 
              alt="Special Food Menu" 
            />
          </div>
          <div 
            className={`image-item ${expandedImage === 2 ? 'expanded' : ''}`}
            onClick={expandedImage === 2 ? handleBackdropClick : () => handleImageClick(2)}
          >
            <img 
              src="/assets/loyalty-card.jpg" 
              alt="Loyalty Card" 
            />
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default DiscountPage; 