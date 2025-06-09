import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Profile.css';

const Profile = () => {
  const { user } = useAuth();
  const [staff, setStaff] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [salaryData, setSalaryData] = useState({ hours: 0, salary: 0 });
  const [salaryLoading, setSalaryLoading] = useState(true);
  const [salaryError, setSalaryError] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({ staff_name: '', phone: '' });
  const [editError, setEditError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchStaff = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('staffToken');
        if (!token) throw new Error('No staff authentication token found');
        // Fetch staff info by email (unique)
        const response = await fetch(`http://localhost:3001/api/staff/by-email/${encodeURIComponent(user.staff_email)}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('Failed to fetch staff info');
        const data = await response.json();
        setStaff(data.staff);
      } catch (err) {
        setError(err.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    if (user?.staff_email) fetchStaff();
  }, [user]);

  useEffect(() => {
    const fetchSalaryData = async () => {
      setSalaryLoading(true);
      setSalaryError(null);
      try {
        const token = localStorage.getItem('staffToken');
        const now = new Date();
        const month = now.getMonth() + 1;
        const year = now.getFullYear();
        const response = await fetch(`http://localhost:3001/api/staff/salary?month=${month}&year=${year}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('Failed to fetch salary data');
        const result = await response.json();
        setSalaryData({ hours: result.hours, salary: result.salary });
      } catch (err) {
        setSalaryError('Could not load salary data.');
      } finally {
        setSalaryLoading(false);
      }
    };
    fetchSalaryData();
  }, [user]);

  const openEditModal = () => {
    setEditForm({ staff_name: staff.staff_name, phone: staff.phone });
    setEditError(null);
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    setEditError(null);
  };

  const validateEditForm = (form) => {
    if (!form.staff_name || !form.phone) return 'All fields are required.';
    if (!/^[A-Za-z\s]+$/.test(form.staff_name)) return 'Name must only contain letters and spaces.';
    if (!/^0\d{9}$/.test(form.phone)) return 'Phone must start with 0 and have exactly 10 digits.';
    return null;
  };

  const handleEditSave = async () => {
    const validationError = validateEditForm(editForm);
    if (validationError) {
      setEditError(validationError);
      return;
    }
    setSaving(true);
    setEditError(null);
    try {
      const token = localStorage.getItem('staffToken');
      if (!token) throw new Error('No staff authentication token found');
      const response = await fetch(`http://localhost:3001/api/staff/${staff.staff_id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...staff, ...editForm }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to update profile');
      }
      setSuccessMessage('Profile updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
      setEditModalOpen(false);
      // Refresh staff info
      const refreshed = await fetch(`http://localhost:3001/api/staff/by-email/${encodeURIComponent(user.staff_email)}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const refreshedData = await refreshed.json();
      setStaff(refreshedData.staff);
    } catch (err) {
      setEditError(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="loading-message">Loading profile...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!staff) return <div className="error-message">Profile not found.</div>;

  return (
    <div className="profile-info-box">
      <div className="profile-header-row">
        {successMessage && <div className="success-message">{successMessage}</div>}
        <button className="edit-profile-btn" onClick={openEditModal}>Edit</button>
      </div>
      <table className="profile-table">
        <tbody>
          <tr><th>ID</th><td>{staff.staff_id}</td></tr>
          <tr><th>Name</th><td>{staff.staff_name}</td></tr>
          <tr><th>Email</th><td>{staff.staff_email}</td></tr>
          <tr><th>Role</th><td>{staff.role}</td></tr>
          <tr><th>Phone</th><td>{staff.phone}</td></tr>
        </tbody>
      </table>
      <div className="salary-section">
        <h3>Your Salary for This Month</h3>
        {salaryLoading ? (
          <div>Loading salary data...</div>
        ) : salaryError ? (
          <div className="error-message">{salaryError}</div>
        ) : (
          <table className="salary-table">
            <tbody>
              <tr>
                <td className="salary-label">Working Hours</td>
                <td>{salaryData.hours}</td>
              </tr>
              <tr>
                <td className="salary-label">Salary</td>
                <td>{salaryData.salary.toLocaleString('en-US', { style: 'currency', currency: 'VND' })}</td>
              </tr>
            </tbody>
          </table>
        )}
      </div>
      {/* Edit Modal */}
      {editModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Edit Profile</h3>
            <div className="edit-form">
              <label>Name:
                <input
                  type="text"
                  name="staff_name"
                  value={editForm.staff_name}
                  onChange={e => setEditForm({ ...editForm, staff_name: e.target.value })}
                />
              </label>
              <label>Phone:
                <input
                  type="text"
                  name="phone"
                  value={editForm.phone}
                  onChange={e => setEditForm({ ...editForm, phone: e.target.value })}
                />
              </label>
            </div>
            {editError && <div className="error-message">{editError}</div>}
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

export default Profile;
