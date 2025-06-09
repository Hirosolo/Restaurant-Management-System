import React, { useState, useEffect } from 'react';
import { fetchIngredients, deleteIngredient } from '../api/ingredientApi'; // Corrected import path
import EditIngredientModal from './EditIngredientModal'; // Import the new modal component
import '../styles/IngredientsManagement.css';

const IngredientsManagement = ({ onAddIngredientClick }) => {
  // Create Ingredient Modal State (must be at the very top)
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({ ingredient_name: '', unit: '', minimum_threshold: '' });
  const [createError, setCreateError] = useState(null);
  const [creating, setCreating] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const [searchTerm, setSearchTerm] = useState('');
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false); // State to control modal visibility
  const [ingredientToEdit, setIngredientToEdit] = useState(null); // State to hold ingredient data for editing
  const [latestRestockDates, setLatestRestockDates] = useState({}); // New state for latest restock dates
  const [loadingRestockDates, setLoadingRestockDates] = useState({}); // Loading state for restock dates

  useEffect(() => {
    loadIngredients();
  }, []);

  useEffect(() => {
      // Fetch latest restock date for each ingredient after ingredients are loaded
      const fetchLatestRestockDates = async () => {
          if (!ingredients || ingredients.length === 0) {
              setLatestRestockDates({});
              setLoadingRestockDates({});
              return;
          }

          const token = localStorage.getItem('staffToken');
          if (!token) {
              console.error('No staff authentication token found');
              setLatestRestockDates({});
              setLoadingRestockDates({});
              return;
          }

          const initialLoadingState = {};
          ingredients.forEach(ingredient => { initialLoadingState[ingredient.ingredient_id] = true; });
          setLoadingRestockDates(initialLoadingState);

          const fetchPromises = ingredients.map(async (ingredient) => {
              try {
                  // Fetch restock details for this ingredient, ordered by date DESC
                  const response = await fetch(`http://localhost:3001/api/ingredients/${ingredient.ingredient_id}/restocks`, {
                      headers: {
                          'Authorization': `Bearer ${token}`,
                      },
                  });

                  if (!response.ok) {
                      console.error(`Error fetching restock details for ingredient ${ingredient.ingredient_id}:`, response.status);
                       // Return null or handle error appropriately
                      return { ingredientId: ingredient.ingredient_id, latestDate: null };
                  }

                  const data = await response.json();

                  // Assuming the backend returns restock details ordered by date DESC, the first is the latest
                  const latestRestock = data.restockDetails && data.restockDetails.length > 0 ? data.restockDetails[0] : null;

                  return { ingredientId: ingredient.ingredient_id, latestDate: latestRestock ? latestRestock.restock_date : null };

              } catch (error) {
                  console.error(`Error fetching restock details for ingredient ${ingredient.ingredient_id}:`, error);
                  return { ingredientId: ingredient.ingredient_id, latestDate: null };
              }
          });

          const results = await Promise.all(fetchPromises);

          const newLatestRestockDates = {};
          const finalLoadingState = {};
          results.forEach(result => {
              newLatestRestockDates[result.ingredientId] = result.latestDate;
              finalLoadingState[result.ingredientId] = false;
          });

          setLatestRestockDates(newLatestRestockDates);
          setLoadingRestockDates(finalLoadingState);
      };

      fetchLatestRestockDates();

  }, [ingredients]); // Rerun when ingredients data changes


  const loadIngredients = async () => {
    try {
      setLoading(true);
      const fetchedIngredients = await fetchIngredients(); // Now directly returns the array

      // Check if fetchedIngredients is an array before processing
      if (!fetchedIngredients || !Array.isArray(fetchedIngredients)) {
          console.error('Fetched data is not an array:', fetchedIngredients);
          setError(new Error('Received data in unexpected format.'));
          setLoading(false);
          return;
      }

      // Process data to group by ingredient and collect all suppliers
      const groupedIngredients = {};
      fetchedIngredients.forEach(item => { // Iterate over the ingredients array
        if (!groupedIngredients[item.ingredient_id]) {
          groupedIngredients[item.ingredient_id] = {
            ingredient_id: item.ingredient_id,
            ingredient_name: item.ingredient_name,
            quantity: item.quantity,
            unit: item.unit,
            minimum_threshold: item.minimum_threshold,
            good_for: item.good_for, // Include good_for from fetched data
            suppliers: []
          };
        }
        if (item.supplier_name && !groupedIngredients[item.ingredient_id].suppliers.includes(item.supplier_name)) {
          groupedIngredients[item.ingredient_id].suppliers.push(item.supplier_name);
        }
      });

      const processedIngredients = Object.values(groupedIngredients);

      setIngredients(processedIngredients);
      setLoading(false);
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  };

  const handleAddIngredientAndRefresh = async () => {
    // Assuming onAddIngredientClick triggers the process to add an ingredient.
    // The actual adding logic might be in a separate modal or page.
    // To refresh the *page* after adding, you would typically call window.location.reload()
    // after the ingredient has been successfully added via your API.

    if (onAddIngredientClick) {
      onAddIngredientClick();
      // Simulate the delay of adding and then refresh the page.
      // You should place window.location.reload() in the success callback of your actual add ingredient API call.
      setTimeout(() => {
        window.location.reload();
      }, 1000); // Refresh page after a short delay
    }
  };

  const handleDeleteIngredient = async (ingredientId) => {
    // TODO: Implement a more robust confirmation modal later
    const isConfirmed = window.confirm('Are you sure you want to delete this ingredient?');

    if (isConfirmed) {
      try {
        await deleteIngredient(ingredientId);
        // Remove the deleted ingredient from the state
        setIngredients(ingredients.filter(ingredient => ingredient.ingredient_id !== ingredientId));
      } catch (err) {
        console.error('Failed to delete ingredient:', err);
        alert('Failed to delete ingredient.'); // TODO: More user-friendly error handling
      }
    }
  };

  const handleEditIngredient = (ingredient) => {
    setIngredientToEdit(ingredient); // Set the ingredient to be edited
    setShowEditModal(true); // Show the edit modal
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false); // Hide the edit modal
    setIngredientToEdit(null); // Clear the ingredient data
  };

  const handleIngredientUpdated = () => {
    console.log('Ingredient updated, reloading ingredients...'); // Add console log
    loadIngredients(); // Refresh the ingredient list after an update
  };

  const filteredIngredients = ingredients.filter(ingredient =>
    ingredient.ingredient_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading || Object.values(loadingRestockDates).some(isLoading => isLoading)) {
    return <div className="loading-message">Loading ingredients...</div>;
  }

  if (error) {
    return <div className="error-message">{error.message}</div>;
  }

   // Helper to calculate days before expiration
   const calculateDaysBeforeExpired = (ingredient) => {
      const latestRestockDateString = latestRestockDates[ingredient.ingredient_id];
      const goodFor = ingredient.good_for;

      if (!latestRestockDateString || goodFor === null || goodFor === undefined) {
          return 'N/A';
      }

      // Parse the date string manually to avoid timezone issues with new Date(string)
      const [year, month, day] = latestRestockDateString.split('-').map(Number);
      // Month is 0-indexed in JavaScript Date objects, so subtract 1
      const restockDate = new Date(year, month - 1, day);

      const expirationDate = new Date(restockDate);
      expirationDate.setDate(expirationDate.getDate() + goodFor);

      const today = new Date();
      // Set time to midnight for accurate day comparison
      today.setHours(0, 0, 0, 0);
      expirationDate.setHours(0, 0, 0, 0);

      const timeDiff = expirationDate.getTime() - today.getTime();
      const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

      if (daysDiff < 0) {
          return `Expired (${Math.abs(daysDiff)} days ago)`;
      } else {
          return daysDiff;
      }
   };


  // (Removed duplicate create ingredient modal state hooks)

  // Validation helper
  const validateIngredientForm = (form) => {
    if (!form.ingredient_name || !form.unit || !form.minimum_threshold) {
      return 'All fields must be filled.';
    }
    if (!/^[A-Za-z\s]+$/.test(form.ingredient_name)) {
      return 'Name must only contain letters and spaces.';
    }
    if (isNaN(form.minimum_threshold) || Number(form.minimum_threshold) < 0) {
      return 'Minimum threshold must be a number and >= 0.';
    }
    return null;
  };

  // Create ingredient handler
  const handleCreateIngredient = async () => {
    const validationError = validateIngredientForm(createForm);
    if (validationError) {
      setCreateError(validationError);
      return;
    }
    setCreating(true);
    setCreateError(null);
    try {
      const token = localStorage.getItem('staffToken');
      if (!token) throw new Error('No staff authentication token found');
      const response = await fetch('http://localhost:3001/api/ingredients', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ingredient_name: createForm.ingredient_name,
          unit: createForm.unit,
          minimum_threshold: createForm.minimum_threshold,
          // supplier_id removed
          quantity: 0
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || data.error || 'Failed to create ingredient');
      setSuccessMessage('Ingredient created successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
      setShowCreateModal(false);
      setCreateForm({ ingredient_name: '', unit: '', minimum_threshold: '' });
      loadIngredients();
    } catch (err) {
      setSuccessMessage(err.message || 'Failed to create ingredient');
      setTimeout(() => setSuccessMessage(''), 3000);
      setCreateError(err.message || 'Failed to create ingredient');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="ingredients-management">
      <div className="ingredients-header">
        <h2>Ingredients Management</h2>
        <button className="create-ingredient-btn" style={{marginBottom: '16px'}} onClick={() => setShowCreateModal(true)}>
          + Create Ingredient
        </button>
      </div>

      <div className="search-container">
        <div className="search-box">
          <div className="search-icon">🔍</div>
          <input
            type="text"
            placeholder="Quick search by supplier or date"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {successMessage && (
        <div className={successMessage.toLowerCase().includes('success') ? 'success-message' : 'error-message'}>{successMessage}</div>
      )}

      {/* Create Ingredient Modal */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Create New Ingredient</h3>
            <div className="edit-form">
              <label>ID:
                <input type="text" value={
                  ingredients.length > 0
                    ? Math.max(...ingredients.map(i => Number(i.ingredient_id) || 0)) + 1
                    : 1
                } readOnly style={{ background: '#f3f4f6' }} />
              </label>
              <label>Name:
                <input
                  type="text"
                  name="ingredient_name"
                  value={createForm.ingredient_name}
                  onChange={e => setCreateForm({ ...createForm, ingredient_name: e.target.value })}
                />
              </label>
              <label>Unit:
                <input
                  type="text"
                  name="unit"
                  value={createForm.unit}
                  onChange={e => setCreateForm({ ...createForm, unit: e.target.value })}
                />
              </label>
              <label>Minimum Threshold:
                <input
                  type="number"
                  name="minimum_threshold"
                  value={createForm.minimum_threshold}
                  onChange={e => setCreateForm({ ...createForm, minimum_threshold: e.target.value })}
                />
              </label>
              {/* Supplier field removed */}
            </div>
            {createError && <div className="error-message">{createError}</div>}
            <div className="modal-actions">
              <button className="save-btn" onClick={handleCreateIngredient} disabled={creating}>
                {creating ? 'Creating...' : 'Create'}
              </button>
              <button className="cancel-btn" onClick={() => setShowCreateModal(false)} disabled={creating}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="ingredients-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Supplier</th>
              <th>Stock</th>
              <th>Unit</th>
              <th>Min Threshold</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredIngredients.map((ingredient) => (
              <tr key={ingredient.ingredient_id}>
                <td>{ingredient.ingredient_id}</td>
                <td>{ingredient.ingredient_name}</td>
                <td>{ingredient.suppliers.join(', ') || 'N/A'}</td>
                <td>{ingredient.quantity}</td>
                <td>{ingredient.unit}</td>
                <td>{ingredient.minimum_threshold}</td>
                <td>
                  <button onClick={() => handleDeleteIngredient(ingredient.ingredient_id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredIngredients.length === 0 && searchTerm && (
        <div className="no-results">
          No ingredients found matching "{searchTerm}"
        </div>
      )}
       {filteredIngredients.length === 0 && !searchTerm && !loading && !error && (
        <div className="no-results">
          No ingredients available.
        </div>
      )}

      {/* Render the Edit Ingredient Modal */}
      <EditIngredientModal
        show={showEditModal}
        onClose={handleCloseEditModal}
        ingredient={ingredientToEdit}
        onIngredientUpdated={handleIngredientUpdated}
      />
    </div>
  );
};

export default IngredientsManagement;