import React, { useState, useEffect } from 'react';
import '../styles/StaffManagement.css';

const StaffManagement = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editStaff, setEditStaff] = useState(null);
  const [editForm, setEditForm] = useState({ staff_name: '', staff_email: '', role: '', phone: '' });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('staffToken');
      if (!token) throw new Error('No staff authentication token found');
      const response = await fetch('http://localhost:3001/api/staff/all', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) throw new Error(`Failed to fetch staff data: ${response.status}`);
      const data = await response.json();
      if (data.success && data.staff) setStaff(data.staff);
      else setStaff([]);
    } catch (err) {
      setError('Failed to load staff data.');
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (member) => {
    setEditStaff(member);
    setEditForm({
      staff_name: member.staff_name || '',
      staff_email: member.staff_email || '',
      role: member.role || '',
      phone: member.phone || '',
    });
    setEditModalOpen(true);
    setSaveError(null);
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    setEditStaff(null);
    setEditForm({ staff_name: '', staff_email: '', role: '', phone: '' });
    setSaveError(null);
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSave = async () => {
    setSaving(true);
    setSaveError(null);
    try {
      const token = localStorage.getItem('staffToken');
      if (!token) throw new Error('No staff authentication token found');
      const response = await fetch(`http://localhost:3001/api/staff/${editStaff.staff_id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to update staff');
      }
      await fetchStaff();
      closeEditModal();
      setSuccessMessage('Staff information updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setSaveError(err.message || 'Failed to update staff');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="loading-message">Loading staff data...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="staff-management-container">
      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}
      <h2>Staff Management</h2>
      <table className="staff-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Phone</th>
            <th>Edit</th>
          </tr>
        </thead>
        <tbody>
          {staff.map((member) => (
            <tr key={member.staff_id}>
              <td>{member.staff_id}</td>
              <td>{member.staff_name}</td>
              <td>{member.staff_email}</td>
              <td>{member.role}</td>
              <td>{member.phone}</td>
              <td>
                <button className="edit-btn" onClick={() => openEditModal(member)}>
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {staff.length === 0 && !loading && !error && (
        <div className="no-results">
          No staff members available.
        </div>
      )}

      {/* Edit Modal */}
      {editModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Edit Staff Information</h3>
            <div className="edit-form">
              <label>Name:
                <input
                  type="text"
                  name="staff_name"
                  value={editForm.staff_name}
                  onChange={handleEditChange}
                />
              </label>
              <label>Email:
                <input
                  type="email"
                  name="staff_email"
                  value={editForm.staff_email}
                  onChange={handleEditChange}
                />
              </label>
              <label>Role:
                <input
                  type="text"
                  name="role"
                  value={editForm.role}
                  onChange={handleEditChange}
                />
              </label>
              <label>Phone:
                <input
                  type="text"
                  name="phone"
                  value={editForm.phone}
                  onChange={handleEditChange}
                />
              </label>
            </div>
            {saveError && <div className="error-message">{saveError}</div>}
            <div className="modal-actions">
              <button className="save-btn" onClick={handleEditSave} disabled={saving}>
                {saving ? 'Saving...' : 'Save'}
              </button>
              <button className="cancel-btn" onClick={closeEditModal} disabled={saving}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffManagement;
