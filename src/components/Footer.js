import React from 'react';
import './Footer.css';
function Footer() {
    return (
<div className="footer">
<div className="footer-left">
  <div className="contact-text">Contact channels</div>
  <div className="social-links">
    <a href="#" className="social-link">
      <img src="./assets/logofb.png" alt="Facebook icon" className="social-icon" />
      Facebook
    </a>
    <a href="#" className="social-link">
      <img src="./assets/logoig.png" alt="Instagram icon" className="social-icon" />
      Instagram
    </a>
  </div>
</div>
<div className="footer-right">
  <div className="update-info">Always updated</div>
  <div className="about-text">About information and new products</div>
</div>
</div>
);
}

export default Footer;