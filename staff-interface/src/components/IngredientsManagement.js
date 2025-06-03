import React, { useState, useEffect } from 'react';
import { fetchIngredients, deleteIngredient } from '../api/ingredientApi'; // Corrected import path
import EditIngredientModal from './EditIngredientModal'; // Import the new modal component
import '../styles/IngredientsManagement.css';

const IngredientsManagement = ({ onAddIngredientClick }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false); // State to control modal visibility
  const [ingredientToEdit, setIngredientToEdit] = useState(null); // State to hold ingredient data for editing

  useEffect(() => {
    loadIngredients();
  }, []);

  const loadIngredients = async () => {
    try {
      setLoading(true);
      const data = await fetchIngredients();

      // Process data to group by ingredient and collect all suppliers
      const groupedIngredients = {};
      data.forEach(item => {
        if (!groupedIngredients[item.ingredient_id]) {
          groupedIngredients[item.ingredient_id] = {
            ingredient_id: item.ingredient_id,
            ingredient_name: item.ingredient_name,
            quantity: item.quantity,
            unit: item.unit,
            minimum_threshold: item.minimum_threshold,
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
    loadIngredients(); // Refresh the ingredient list after an update
  };

  const filteredIngredients = ingredients.filter(ingredient =>
    ingredient.ingredient_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="loading-message">Loading ingredients...</div>;
  }

  if (error) {
    return <div className="error-message">{error.message}</div>;
  }

  return (
    <div className="ingredients-management">
      <div className="ingredients-header">
        <h2>Ingredients Management</h2>
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
                  <button onClick={() => handleEditIngredient(ingredient)}>Edit</button>
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