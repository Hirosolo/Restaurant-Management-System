import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AccountSidebar.css';

function AccountSidebar({ activeTab, handleTabChange, handleLogout }) {
  const navigate = useNavigate();

  return (
    <div className="account-sidebar">
      <div className="sidebar-menu">
        <button 
          className="sidebar-item navigation"
          onClick={() => navigate('/')}
        >
          Home
        </button>
        <button 
          className="sidebar-item navigation"
          onClick={() => navigate('/menu')}
        >
          Menu
        </button>
        <div className="sidebar-divider"></div>
        <button 
          className={`sidebar-item ${activeTab === 'account' ? 'active' : ''}`}
          onClick={() => handleTabChange('account')}
        >
          Account Overview
        </button>
        <button 
          className={`sidebar-item ${activeTab === 'order-history' ? 'active' : ''}`}
          onClick={() => handleTabChange('order-history')}
        >
          Order History
        </button>
        <button 
          className={`sidebar-item ${activeTab === 'favourite-order' ? 'active' : ''}`}
          onClick={() => handleTabChange('favourite-order')}
        >
          Favourite Orders
        </button>
        <button 
          className="sidebar-item logout"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default AccountSidebar;