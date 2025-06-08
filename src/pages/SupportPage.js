import React from 'react';
import Navbar from '../components/Navbar';
import UserNav from '../components/UserNav';
import Footer from '../components/Footer';
import '../styles/SupportPage.css';

const SupportPage = () => {
  return (
    <div className="support-page">
      <UserNav />
      <div className="navbar menu-navbar">
        <div className="nav-links" >
          <a href="/">Home</a>
          <a href="/menu">Menu</a>
          <img src="/assets/logo.png" alt="Logo" className="logo" />
          <a href="/discount">Discount</a>
          <a href="/support">Support</a>
        </div>
      </div>
      <div className="support-container">
        <h1 className="support-heading">Support</h1>
        <div className="support-content">
          <div className="support-section">
            <h2>Contact Us</h2>
            <p>Email: support@greedible.com</p>
            <p>Phone: +84 123 456 789</p>
            <p>Address: 123 Food Street, Ho Chi Minh City, Vietnam</p>
          </div>
          
          <div className="support-section">
            <h2>Operating Hours</h2>
            <p>Monday - Friday: 8:00 AM - 10:00 PM</p>
            <p>Saturday - Sunday: 9:00 AM - 11:00 PM</p>
          </div>
          
          <div className="support-section">
            <h2>FAQ</h2>
            <div className="faq-item">
              <h3>How do I track my order?</h3>
              <p>You can track your order in real-time through your account page or the order confirmation email.</p>
            </div>
            <div className="faq-item">
              <h3>What payment methods do you accept?</h3>
              <p>We accept cash, credit cards, and MoMo wallet payments.</p>
            </div>
            <div className="faq-item">
              <h3>How can I earn loyalty points?</h3>
              <p>You earn 1 point for every 1000 VND spent. Points can be redeemed for discounts on future orders.</p>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default SupportPage;