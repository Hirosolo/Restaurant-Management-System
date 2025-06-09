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
  // Create Staff Modal State
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [createForm, setCreateForm] = useState({ staff_name: '', staff_email: '', role: '', phone: '', password: '' });
  const [createError, setCreateError] = useState(null);
  const [creating, setCreating] = useState(false);

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

  // Validation helper
  const validateStaffForm = (form, isCreate = false) => {
    // Name: only letters and spaces
    if (!/^[A-Za-z\s]+$/.test(form.staff_name)) {
      return 'Name must only contain letters and spaces.';
    }
    // Email: basic email format
    if (!/^\S+@\S+\.\S+$/.test(form.staff_email)) {
      return 'Email must be a valid email address.';
    }
    // Phone: starts with 0, only numbers, exactly 10 digits
    if (!/^0\d{9}$/.test(form.phone)) {
      return 'Phone must start with 0 and have exactly 10 digits.';
    }
    // Password required for create
    if (isCreate && !form.password) {
      return 'Password is required.';
    }
    return null;
  };

  const handleEditSave = async () => {
    // Validate
    const validationError = validateStaffForm(editForm, false);
    if (validationError) {
      setSaveError(validationError);
      return;
    }
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
      <button className="create-staff-btn" style={{marginBottom: '16px'}} onClick={() => { setCreateModalOpen(true); setCreateForm({ staff_name: '', staff_email: '', role: '', phone: '', password: '' }); setCreateError(null); }}>
        + Create Staff
      </button>
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
              <td style={{display: 'flex', gap: '8px'}}>
                <button className="edit-btn" onClick={() => openEditModal(member)}>
                  Edit
                </button>
                <button className="delete-btn" onClick={async () => {
                  if (window.confirm('Are you sure you want to delete this staff member?')) {
                    try {
                      const token = localStorage.getItem('staffToken');
                      if (!token) throw new Error('No staff authentication token found');
                      const response = await fetch(`http://localhost:3001/api/staff/${member.staff_id}`, {
                        method: 'DELETE',
                        headers: { 'Authorization': `Bearer ${token}` },
                      });
                      const data = await response.json();
                      if (!response.ok) throw new Error(data.message || 'Failed to delete staff');
                      setSuccessMessage('Staff deleted successfully!');
                      setTimeout(() => setSuccessMessage(''), 3000);
                      await fetchStaff();
                    } catch (err) {
                      setError(err.message || 'Failed to delete staff');
                    }
                  }
                }}>
                  Delete
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

      {/* Create Staff Modal */}
      {createModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Create New Staff</h3>
            <div className="edit-form">
              <label>Name:
                <input
                  type="text"
                  name="staff_name"
                  value={createForm.staff_name}
                  onChange={e => setCreateForm({ ...createForm, staff_name: e.target.value })}
                />
              </label>
              <label>Email:
                <input
                  type="email"
                  name="staff_email"
                  value={createForm.staff_email}
                  onChange={e => setCreateForm({ ...createForm, staff_email: e.target.value })}
                />
              </label>
              <label>Role:
                <select
                  name="role"
                  value={createForm.role}
                  onChange={e => setCreateForm({ ...createForm, role: e.target.value })}
                >
                  <option value="">Select role</option>
                  <option value="Manager">Manager</option>
                  <option value="Chef">Chef</option>
                  <option value="Order Staff">Order Staff</option>
                  <option value="Kitchen Supervisor">Kitchen Supervisor</option>
                  <option value="Shipper">Shipper</option>
                </select>
              </label>
              <label>Phone:
                <input
                  type="text"
                  name="phone"
                  value={createForm.phone}
                  onChange={e => setCreateForm({ ...createForm, phone: e.target.value })}
                />
              </label>
              <label>Password:
                <input
                  type="password"
                  name="password"
                  value={createForm.password}
                  onChange={e => setCreateForm({ ...createForm, password: e.target.value })}
                />
              </label>
            </div>
            {createError && <div className="error-message">{createError}</div>}
            <div className="modal-actions">
              <button className="save-btn" onClick={async () => {
                // Validate
                const validationError = validateStaffForm(createForm, true);
                if (validationError) {
                  setCreateError(validationError);
                  return;
                }
                setCreating(true);
                setCreateError(null);
                try {
                  const token = localStorage.getItem('staffToken');
                  if (!token) throw new Error('No staff authentication token found');
                  const response = await fetch('http://localhost:3001/api/staff', {
                    method: 'POST',
                    headers: {
                      'Authorization': `Bearer ${token}`,
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(createForm),
                  });
                  const data = await response.json();
                  if (!response.ok) throw new Error(data.message || 'Failed to create staff');
                  setSuccessMessage('New staff member created successfully!');
                  setTimeout(() => setSuccessMessage(''), 3000);
                  setCreateModalOpen(false);
                  await fetchStaff();
                } catch (err) {
                  setCreateError(err.message || 'Failed to create staff');
                } finally {
                  setCreating(false);
                }
              }} disabled={creating}>
                {creating ? 'Creating...' : 'Create'}
              </button>
              <button className="cancel-btn" onClick={() => setCreateModalOpen(false)} disabled={creating}>
                Cancel
              </button>
            </div>
          </div>
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
