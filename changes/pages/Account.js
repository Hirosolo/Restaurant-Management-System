import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import AccountSidebar from '../components/AccountSidebar';
import AccountOverview from '../components/AccountOverview';
import TrackOrder from '../components/TrackOrder';
import OrderHistory from '../components/OrderHistory';
import FavoriteOrders from '../components/FavoriteOrders';
import ProfileSettings from '../components/ProfileSettings';
import './Account.css';

function Account() {
  const navigate = useNavigate();
  const { authStatus, userData, userAddress, handleSignOut } = useAuth();
  
  // States
  const [activeTab, setActiveTab] = useState('account');
  const [menuOpen, setMenuOpen] = useState(false);
  const [showAddNewAddress, setShowAddNewAddress] = useState(false);
  
  // Kiểm tra trạng thái xác thực khi component mount
  useEffect(() => {
    if (authStatus !== 'signedIn') {
      navigate('/');
    }
  }, [authStatus, navigate]);
  
  // Handlers
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setShowAddNewAddress(false);
  };
  
  const handleLogout = () => {
    handleSignOut();
  };
  
  // Render content dựa trên tab hiện tại
  const renderContent = () => {
    switch(activeTab) {
      case 'account':
        return <AccountOverview />;
      case 'track-order':
        return <TrackOrder />;
      case 'order-history':
        return <OrderHistory />;
      case 'favourite-order':
        return <FavoriteOrders />;
      case 'profile-settings':
        return (
          <ProfileSettings 
            userData={userData}
            userAddress={userAddress}
            showAddNewAddress={showAddNewAddress}
            setShowAddNewAddress={setShowAddNewAddress}
          />
        );
      default:
        return <AccountOverview />;
    }
  };

  return (
    <div className="account-page">
      <Navbar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      
      <div className="account-container">
        <AccountSidebar 
          activeTab={activeTab}
          handleTabChange={handleTabChange}
          handleLogout={handleLogout}
        />
        
        <div className="account-content">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default Account;