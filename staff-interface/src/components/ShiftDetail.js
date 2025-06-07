import React, { useState, useEffect } from 'react';
import '../styles/ShiftDetail.css';

// Helper function to format date as YYYY-MM-DD (consistent with backend expectation)
const formatDate = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// API calls for removing and adding staff to shifts
const removeStaffFromShiftAPI = async (scheduleId, token) => {
  const response = await fetch(`http://localhost:3001/api/schedules/${scheduleId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to remove staff from shift');
  }
  return response.json();
};

const addStaffToShiftAPI = async (shiftData, token) => {
  const response = await fetch('http://localhost:3001/api/schedules', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(shiftData),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to add staff to shift');
  }
  return response.json();
};

const createShiftAPI = async (shiftData, token) => {
  const response = await fetch('http://localhost:3001/api/schedules', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(shiftData),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create shift');
  }
  return response.json();
};

const deleteShiftAPI = async (scheduleId, token) => {
  const response = await fetch(`http://localhost:3001/api/schedules/${scheduleId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to delete shift');
  }
  return response.json();
};

const fetchAllStaff = async (token) => {
   const response = await fetch('http://localhost:3001/api/staff/all', {
     headers: {
       'Authorization': `Bearer ${token}`,
     },
   });
   if (!response.ok) {
     const error = await response.json();
     throw new Error(error.message || 'Failed to fetch staff list');
   }
   const data = await response.json();
   if (data.success && data.staff) {
     return data.staff;
   } else {
     return [];
   }
};

const ShiftDetail = ({ shift, onClose, onShiftUpdate, isNewShift }) => {
  const [availableStaff, setAvailableStaff] = useState([]);
  const [loadingAvailableStaff, setLoadingAvailableStaff] = useState(true);
  const [errorAvailableStaff, setErrorAvailableStaff] = useState(null);
  const [showAddStaffDropdown, setShowAddStaffDropdown] = useState(false);
  
  // State to manage pending changes for existing shifts
  const [staffToRemove, setStaffToRemove] = useState(new Set());
  const [staffToAdd, setStaffToAdd] = useState([]); // Array of staff objects

  // State for new shifts
  const [newShiftDate, setNewShiftDate] = useState(shift?.date ? formatDate(shift.date) : '');
  const [newShiftTime, setNewShiftTime] = useState(shift?.time || '');
  const [selectedStaffForNewShift, setSelectedStaffForNewShift] = useState([]);

  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  useEffect(() => {
    const loadAvailableStaff = async () => {
      setLoadingAvailableStaff(true);
      setErrorAvailableStaff(null);
      try {
        const token = localStorage.getItem('staffToken');
        if (!token) {
            throw new Error('No staff authentication token found');
        }
        const staffList = await fetchAllStaff(token);
        setAvailableStaff(staffList);
      } catch (err) {
        console.error('Error fetching available staff:', err);
        setErrorAvailableStaff('Failed to load available staff.');
      } finally {
        setLoadingAvailableStaff(false);
      }
    };

    loadAvailableStaff();

    if (shift && !isNewShift) {
        // Initialize staffToRemove and staffToAdd when modal opens for an existing shift
        setStaffToRemove(new Set());
        setStaffToAdd([]);
    } else if (isNewShift) {
        // Reset states for a new shift
        setNewShiftDate('');
        setNewShiftTime('');
        setSelectedStaffForNewShift([]);
    }

  }, [shift, isNewShift]);

  const handleRemoveStaff = (scheduleId) => {
    setStaffToRemove(prev => new Set(prev).add(scheduleId));
  };

  const handleAddStaffClick = () => {
    setShowAddStaffDropdown(prev => !prev);
  };

  const handleSelectStaff = (staffId) => {
    const selectedStaffMember = availableStaff.find(staff => staff.staff_id === staffId);

    if (!selectedStaffMember) {
        console.error('Selected staff member not found in available staff list.');
        setShowAddStaffDropdown(false);
        return;
    }

    if (isNewShift) {
        // For new shift, prevent adding same staff twice
        if (!selectedStaffForNewShift.some(person => person.staff_id === staffId)) {
            setSelectedStaffForNewShift(prev => [...prev, selectedStaffMember]);
        } else {
            alert('This staff member is already selected for the new shift.');
        }
    } else {
        // For existing shift
        const isCurrentlyAssigned = shift?.staff.some(person => 
            person.id === staffId && !staffToRemove.has(person.schedule_id)
        );
        
        const isAlreadyAdding = staffToAdd.some(person => person.staff_id === staffId);

        if (isCurrentlyAssigned || isAlreadyAdding) {
            alert('This staff member is already assigned or pending addition to this shift.');
        } else {
            setStaffToAdd(prev => [...prev, selectedStaffMember]);
        }
    }
    setShowAddStaffDropdown(false);
  };

  const handleRemoveStaffFromNewShift = (staffIdToRemove) => {
    setSelectedStaffForNewShift(prev => prev.filter(staff => staff.staff_id !== staffIdToRemove));
  };

  const handleSave = async () => {
    if (isSaving) return;
    setIsSaving(true);
    setSaveError(null);
    const token = localStorage.getItem('staffToken');
    if (!token) {
        setSaveError('No staff authentication token found');
        setIsSaving(false);
        return;
    }

    if (isNewShift) {
        // Logic for creating a new shift
        if (!newShiftDate || !newShiftTime || selectedStaffForNewShift.length === 0) {
            setSaveError('Please select a date, time, and at least one staff member for the new shift.');
            setIsSaving(false);
            return;
        }

        const newShiftPromises = selectedStaffForNewShift.map(staffMember => 
            createShiftAPI({
                shift_date: newShiftDate,
                shift: newShiftTime,
                staff_id: staffMember.staff_id,
            }, token)
        );

        try {
            await Promise.all(newShiftPromises);
            console.log('New shifts created successfully.');
            if (onShiftUpdate) onShiftUpdate();
            onClose();
        } catch (err) {
            console.error('Error creating new shifts:', err);
            setSaveError(`Failed to create shifts: ${err.message}`);
        } finally {
            setIsSaving(false);
        }

    } else {
        // Logic for updating an existing shift
        const actions = [];

        staffToRemove.forEach(scheduleId => {
          actions.push(removeStaffFromShiftAPI(scheduleId, token));
        });

        const shiftDateFormatted = shift?.date ? formatDate(shift.date) : null;
        const shiftType = shift?.shift;

        if (!shiftDateFormatted || !shiftType) {
            setSaveError('Shift date or type is missing for additions.');
            setIsSaving(false);
            return;
        }

        staffToAdd.forEach(staffMember => {
          actions.push(addStaffToShiftAPI({
            shift_date: shiftDateFormatted,
            shift: shiftType,
            staff_id: staffMember.staff_id,
          }, token));
        });

        try {
          await Promise.all(actions);
          console.log('All shift changes saved successfully.');
          if (onShiftUpdate) onShiftUpdate();
          onClose();
        } catch (err) {
          console.error('Error saving shift changes:', err);
          setSaveError(`Failed to save shift changes: ${err.message}`);
        } finally {
          setIsSaving(false);
        }
    }
  };

  const handleDeleteShift = async () => {
    if (!shift?.id) {
        alert('Cannot delete: Shift ID is missing.');
        return;
    }

    const isConfirmed = window.confirm('Are you sure you want to delete this entire shift? This will remove all staff assignments for this shift.');
    if (!isConfirmed) return;

    setIsSaving(true);
    setSaveError(null);
    const token = localStorage.getItem('staffToken');
    if (!token) {
        setSaveError('No staff authentication token found');
        setIsSaving(false);
        return;
    }

    try {
        // Delete the main schedule entry. This should cascade delete staff assignments if foreign keys are set up.
        // If not, you might need to iterate and delete each staff assignment first.
        await deleteShiftAPI(shift.id, token); 
        console.log('Shift deleted successfully.');
        if (onShiftUpdate) onShiftUpdate();
        onClose();
    } catch (err) {
        console.error('Error deleting shift:', err);
        setSaveError(`Failed to delete shift: ${err.message}`);
    } finally {
        setIsSaving(false);
    }
  };

  const staffToDisplay = shift && shift.staff
    ? shift.staff.filter(person => !staffToRemove.has(person.schedule_id))
    : [];
    
  const finalStaffList = [...staffToDisplay, ...staffToAdd.map(person => ({ 
      ...person, 
      isPendingAddition: true
    }))];

   const allAssignedOrAddingStaffIds = new Set([
       ...(shift && shift.staff ? shift.staff.map(s => s.id) : []),
       ...staffToAdd.map(s => s.staff_id)
    ]);

   const availableStaffFiltered = availableStaff.filter(s => !allAssignedOrAddingStaffIds.has(s.staff_id));

  return (
    <div className="shift-detail">
      <div className="shift-detail-header">
        <h3 className="shift-detail-title">{isNewShift ? 'Create New Shift' : 'Shift Details'}</h3>
        <div className="header-buttons">
          {!isNewShift && (
            <button className="delete-shift-btn" onClick={handleDeleteShift} disabled={isSaving}>
              Delete Shift
            </button>
          )}
          <button className="close-btn" onClick={onClose} disabled={isSaving}>×</button>
        </div>
      </div>

      {isNewShift ? (
        <div className="new-shift-form">
          <div className="form-group">
            <label>Date:</label>
            <input
              type="date"
              value={newShiftDate}
              onChange={(e) => setNewShiftDate(e.target.value)}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label>Time:</label>
            <select
              value={newShiftTime}
              onChange={(e) => setNewShiftTime(e.target.value)}
              className="form-select"
            >
              <option value="">Select Time</option>
              <option value="Morning">Morning</option>
              <option value="Evening">Evening</option>
            </select>
          </div>
          {saveError && <div className="error-message">{saveError}</div>}
          <div className="staff-list">
            <h4>Selected Staff:</h4>
            {selectedStaffForNewShift.length > 0 ? (
              selectedStaffForNewShift.map((person) => (
                <div key={person.staff_id} className="staff-item new-shift-staff-item">
                  <div className="staff-info">
                    <div className="staff-avatar-container">
                      <img 
                        src={person.avatar} 
                        alt={person.name}
                        className="staff-photo"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          if (e.target.nextSibling) {
                            e.target.nextSibling.style.display = 'flex';
                          }
                        }}
                        style={{ display: person.avatar ? '' : 'none' }}
                      />
                      <div 
                        className="staff-avatar-fallback"
                        style={{ 
                          backgroundColor: person.color || '#CCCCCC',
                          display: person.avatar ? 'none' : 'flex'
                        }}
                      >
                        {person.name ? person.name.charAt(0) : '?'}
                      </div>
                    </div>
                    <div className="staff-details">
                      <div className="staff-name">{person.staff_name}</div>
                      <div className="staff-position">{person.role}</div>
                    </div>
                  </div>
                  <button 
                    className="remove-staff-btn"
                    onClick={() => handleRemoveStaffFromNewShift(person.staff_id)}
                    title="Remove from new shift"
                    disabled={isSaving}
                  >
                    ×
                  </button>
                </div>
              ))
            ) : (
              <p>No staff selected for this new shift.</p>
            )}
          </div>
        </div>
      ) : (
        <>
          <div className="shift-time-display">
            {shift?.date ? `${new Date(shift.date).toLocaleDateString()} - ${shift?.time || 'N/A'}` : 'N/A'}
          </div>

          {saveError && <div className="error-message">{saveError}</div>}

          <div className="staff-list">
            {finalStaffList.length > 0 ? (
              finalStaffList.map((person) => (
                <div key={person.id || person.staff_id} className={`staff-item ${staffToRemove.has(person.schedule_id) ? 'removing' : ''} ${person.isPendingAddition ? 'adding' : ''}`}>
                  <div className="staff-info">
                    <div className="staff-avatar-container">
                      <img 
                        src={person.avatar} 
                        alt={person.name}
                        className="staff-photo"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          if (e.target.nextSibling) {
                             e.target.nextSibling.style.display = 'flex';
                          }
                        }}
                        style={{ display: person.avatar ? '' : 'none' }}
                      />
                      <div 
                        className="staff-avatar-fallback"
                        style={{ 
                           backgroundColor: person.color || '#CCCCCC',
                           display: person.avatar ? 'none' : 'flex'
                        }}
                      >
                        {person.name ? person.name.charAt(0) : '?'}
                      </div>
                    </div>
                    <div className="staff-details">
                      <div className="staff-name">{person.name} {person.isPendingAddition && '(Adding)'}</div>
                      <div className="staff-position">{person.role}</div>
                    </div>
                  </div>
                  {!person.isPendingAddition && (
                      <button 
                        className="remove-staff-btn"
                        onClick={() => handleRemoveStaff(person.schedule_id)}
                        title="Remove from shift"
                        disabled={isSaving}
                      >
                        ×
                      </button>
                  )}
                </div>
              ))
            ) : (
              <p>No staff assigned to this shift.</p>
            )}
          </div>
        </>
      )}

      <div className="add-staff-section">
        <button onClick={handleAddStaffClick} className="add-staff-toggle-btn" disabled={loadingAvailableStaff || isSaving}>
          {showAddStaffDropdown ? 'Hide Staff List' : 'Add Staff'}
        </button>
        
        {showAddStaffDropdown && (
          <div className="add-staff-dropdown">
            {loadingAvailableStaff ? (
              <div>Loading staff list...</div>
            ) : errorAvailableStaff ? (
              <div className="error-message">{errorAvailableStaff}</div>
            ) : availableStaffFiltered.length > 0 ? (
              <ul>
                {availableStaffFiltered.map(staffMember => (
                  <li key={staffMember.staff_id} onClick={() => handleSelectStaff(staffMember.staff_id)}>
                    {staffMember.staff_name} ({staffMember.role})
                  </li>
                ))}
              </ul>
            ) : (
              <p>No more staff available to add.</p>
            )}
          </div>
        )}
      </div>

      <div className="shift-actions">
        <button 
          onClick={handleSave}
          className="save-shift-btn"
          disabled={isSaving}
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
};

export default ShiftDetail;