import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import ShiftView from '../components/ShiftView';
import ShiftDetail from '../components/ShiftDetail';
import '../styles/StaffPage.css';

const StaffPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showShiftDetail, setShowShiftDetail] = useState(false);
  const [selectedShift, setSelectedShift] = useState(null);

  const getActiveMenu = (pathname) => {
    if (pathname === '/dashboard') return 'Dashboard';
    if (pathname === '/recipe') return 'Recipe';
    if (pathname === '/inventory') return 'Inventory';
    if (pathname === '/staff') return 'Staff';
    return '';
  };

  const handleMenuClick = (menuId) => {
    console.log('Navigate to:', menuId);
    
    switch (menuId) {
      case 'Dashboard':
        navigate('/dashboard');
        break;
      case 'Recipe':
        navigate('/recipe');
        break;
      case 'Inventory':
        navigate('/inventory');
        break;
      case 'User':
        navigate('/user');
        break;
      case 'Staff':
      default:
        break;
    }
  };

  const handleShiftClick = (date, shift) => {
    console.log('Shift clicked:', date, shift);
    setSelectedShift({ date, ...shift });
    setShowShiftDetail(true);
  };

  const handleCloseShiftDetail = () => {
    setShowShiftDetail(false);
    setSelectedShift(null);
  };

  const handleSaveShift = () => {
    console.log('Save shift:', selectedShift);
    setShowShiftDetail(false);
    setSelectedShift(null);
  };

  return (
    <div className="staff-page">
      <Sidebar 
        key={location.pathname}
        onMenuClick={handleMenuClick} 
        activeMenu={getActiveMenu(location.pathname)}
      />
      <div className="main-content">
        <Navbar />
        <div className="content-area">
          <div className="staff-content">
            <ShiftView onShiftClick={handleShiftClick} />
          </div>
        </div>
      </div>

      {showShiftDetail && selectedShift && (
        <div className="modal-overlay">
          <div className="shift-detail-modal">
            <ShiftDetail
              shift={selectedShift}
              onSave={handleSaveShift}
              onClose={handleCloseShiftDetail}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffPage;