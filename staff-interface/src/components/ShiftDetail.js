import React from 'react';
import '../styles/ShiftDetail.css';

const ShiftDetail = ({ shift, onSave, onClose }) => {
  const staffList = [
    {
      id: 1,
      name: 'Lisa Adams',
      position: 'Kitchen Supervisor',
      avatar: '/api/placeholder/50/50',
      color: '#FF8A65'
    },
    {
      id: 2,
      name: 'David Lee',
      position: 'Shipper',
      avatar: '/api/placeholder/50/50',
      color: '#4FC3F7'
    },
    {
      id: 3,
      name: 'Tom Clark',
      position: 'Order Staff',
      avatar: '/api/placeholder/50/50',
      color: '#9575CD'
    },
    {
      id: 4,
      name: 'Sarah Davids',
      position: 'Chef',
      avatar: '/api/placeholder/50/50',
      color: '#F06292'
    }
  ];

  const handleSave = () => {
    if (onSave) {
      onSave();
    }
  };

  const handleRemoveStaff = (staffId) => {
    console.log('Remove staff:', staffId);
    // Logic to remove staff from shift
  };

  return (
    <div className="shift-detail">
      <div className="shift-detail-header">
        <h3 className="shift-detail-title">Shift Details</h3>
        <button className="save-btn" onClick={handleSave}>
          <span className="save-icon">✓</span>
          Save
        </button>
      </div>

      <div className="shift-time-display">
        08:00 - 15:00
      </div>

      <div className="staff-list">
        {staffList.map((staff) => (
          <div key={staff.id} className="staff-item">
            <div className="staff-info">
              <div className="staff-avatar-container">
                <img 
                  src={staff.avatar} 
                  alt={staff.name}
                  className="staff-photo"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div 
                  className="staff-avatar-fallback"
                  style={{ backgroundColor: staff.color }}
                >
                  {staff.name.charAt(0)}
                </div>
              </div>
              <div className="staff-details">
                <div className="staff-name">{staff.name}</div>
                <div className="staff-position">{staff.position}</div>
              </div>
            </div>
            <button 
              className="remove-staff-btn"
              onClick={() => handleRemoveStaff(staff.id)}
              title="Remove from shift"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <div className="shift-actions">
        <button className="add-staff-btn">
          + Add Staff
        </button>
      </div>
    </div>
  );
};

export default ShiftDetail;