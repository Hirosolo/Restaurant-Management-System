import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AccountSidebar from '../components/AccountSidebar';
import './Account.css';

function Account() {
  const navigate = useNavigate();
  const { authStatus, userData, userAddress, handleSignOut } = useAuth();
  
  // States
  const [activeTab, setActiveTab] = useState('account');
  
  // Check authentication status when component mounts
  useEffect(() => {
    if (authStatus !== 'signedIn') {
      navigate('/');
    }
  }, [authStatus, navigate]);
  
  // Handlers
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  
  const handleLogout = () => {
    handleSignOut();
    navigate('/');
  };
  
  // Render content based on active tab
  const renderContent = () => {
    switch(activeTab) {
      case 'account':
        return (
          <div className="account-overview">
            <h2>Account Overview</h2>
            <div className="user-info">
              <h3>Personal Information</h3>
              <p><strong>Name:</strong> {userData?.firstName} {userData?.lastName}</p>
              <p><strong>Email:</strong> {userData?.email}</p>
              <p><strong>Phone:</strong> {userData?.contactMobile}</p>
            </div>
            <div className="address-info">
              <h3>Delivery Address</h3>
              {userAddress ? (
                <>
                  <p><strong>Address:</strong> {userAddress.houseNumber} {userAddress.street}</p>
                  <p><strong>Ward:</strong> {userAddress.ward}</p>
                  <p><strong>District:</strong> {userAddress.district}</p>
                  {userAddress.buildingName && <p><strong>Building:</strong> {userAddress.buildingName}</p>}
                  {userAddress.block && <p><strong>Block:</strong> {userAddress.block}</p>}
                  {userAddress.floor && <p><strong>Floor:</strong> {userAddress.floor}</p>}
                  {userAddress.roomNumber && <p><strong>Room:</strong> {userAddress.roomNumber}</p>}
                </>
              ) : (
                <p>No delivery address set</p>
              )}
            </div>
          </div>
        );
      case 'track-order':
        return <div className="track-order">Track Order Content</div>;
      case 'order-history':
        return <div className="order-history">Order History Content</div>;
      case 'favourite-order':
        return <div className="favourite-orders">Favourite Orders Content</div>;
      case 'profile-settings':
        return <div className="profile-settings">Profile Settings Content</div>;
      default:
        return <div className="account-overview">Account Overview Content</div>;
    }
  };

  return (
    <div className="account-page">
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