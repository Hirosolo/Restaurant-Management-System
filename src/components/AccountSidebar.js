import React from 'react';
import './AccountSidebar.css';

function AccountSidebar({ activeTab, handleTabChange, handleLogout }) {
  return (
    <div className="account-sidebar">
      <div className="sidebar-menu">
        <button 
          className={`sidebar-item ${activeTab === 'account' ? 'active' : ''}`}
          onClick={() => handleTabChange('account')}
        >
          Account Overview
        </button>
        <button 
          className={`sidebar-item ${activeTab === 'track-order' ? 'active' : ''}`}
          onClick={() => handleTabChange('track-order')}
        >
          Track Order
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
          className={`sidebar-item ${activeTab === 'profile-settings' ? 'active' : ''}`}
          onClick={() => handleTabChange('profile-settings')}
        >
          Profile Settings
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