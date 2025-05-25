import React from 'react';
import styles from '../styles/AccountSidebar.module.css';

function AccountSidebar({ activeTab, handleTabChange, handleLogout }) {
  const tabs = [
    { id: 'account', label: 'Account' },
    { id: 'track-order', label: 'Track Order' },
    { id: 'order-history', label: 'Order History' },
    { id: 'favourite-order', label: 'Favourite Order' },
    { id: 'profile-settings', label: 'Profile Settings' }
  ];
  
  return (
    <div className={styles.accountSidebar}>
      {tabs.map(tab => (
        <div
          key={tab.id}
          className={`${styles.sidebarItem} ${activeTab === tab.id ? styles.active : ''}`}
          onClick={() => handleTabChange(tab.id)}
        >
          {tab.label}
        </div>
      ))}
      <div
        className={`${styles.sidebarItem} ${styles.logout}`}
        onClick={handleLogout}
      >
        Log Out
      </div>
    </div>
  );
}

export default AccountSidebar;