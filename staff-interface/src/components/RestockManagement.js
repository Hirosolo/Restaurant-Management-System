import React, { useState, useEffect } from 'react';
import '../styles/RestockManagement.css';

const RestockManagement = ({ onViewDetails }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [ingredientFilter, setIngredientFilter] = useState('');
  const [restockOrders, setRestockOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterLoading, setFilterLoading] = useState(false);

  useEffect(() => {
    const fetchRestockOrders = async () => {
      try {
        const token = localStorage.getItem('staffToken');
        if (!token) {
          throw new Error('No staff authentication token found');
        }

        const response = await fetch('http://localhost:3001/api/restocks', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch restock orders');
        }
        const data = await response.json();
        setRestockOrders(data.restocks);
      } catch (err) {
        setError('Failed to load restock orders.');
      } finally {
        setLoading(false);
      }
    };

    const fetchIngredients = async () => {
      try {
        const token = localStorage.getItem('staffToken');
        if (!token) {
          throw new Error('No staff authentication token found');
        }
        const response = await fetch('http://localhost:3001/api/ingredients', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch ingredients');
        }
        const data = await response.json();
        setIngredients(data.ingredients || []);
      } catch (err) {
        // fallback: no ingredients
        setIngredients([]);
      }
    };

    fetchRestockOrders();
    fetchIngredients();
  }, []);

  // Filtering logic
  useEffect(() => {
    const filterOrders = async () => {
      setFilterLoading(true);
      let filtered = restockOrders.filter(order =>
        order.supplier_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.restock_date && new Date(order.restock_date).toLocaleDateString().includes(searchTerm))
      );
      if (ingredientFilter) {
        // For each restock, fetch its details and check if it contains the selected ingredient
        const token = localStorage.getItem('staffToken');
        const filteredWithIngredient = [];
        for (const order of filtered) {
          try {
            const resp = await fetch(`http://localhost:3001/api/restocks/${order.restock_id}`, {
              headers: {
                'Authorization': `Bearer ${token}`,
              },
            });
            if (!resp.ok) continue;
            const data = await resp.json();
            const details = data.restockDetails || [];
            if (details.some(ing => ing.ingredient_name === ingredientFilter)) {
              filteredWithIngredient.push(order);
            }
          } catch (e) {
            // skip this order if error
          }
        }
        setFilteredOrders(filteredWithIngredient);
      } else {
        setFilteredOrders(filtered);
      }
      setFilterLoading(false);
    };
    filterOrders();
  }, [searchTerm, ingredientFilter, restockOrders]);

  const handleViewDetails = (order) => {
    if (onViewDetails) {
      onViewDetails(order);
    }
  };

  if (loading) {
    return <div className="loading-message">Loading restock orders...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="restock-management">
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

      {/* Ingredient Filter Dropdown */}
      <div className="ingredient-filter-container" style={{ margin: '16px 0' }}>
        <label htmlFor="ingredient-filter" style={{ marginRight: 8 }}>Filter by Ingredient:</label>
        <select
          id="ingredient-filter"
          value={ingredientFilter}
          onChange={e => setIngredientFilter(e.target.value)}
          style={{ padding: '4px 8px', borderRadius: 4 }}
        >
          <option value="">All Ingredients</option>
          {ingredients.map(ing => (
            <option key={ing.ingredient_id} value={ing.ingredient_name}>{ing.ingredient_name}</option>
          ))}
        </select>
      </div>

      <div className="restock-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Date</th>
              <th>Supplier Name</th>
              <th>View Details</th>
            </tr>
          </thead>
          <tbody>
            {filterLoading ? (
              <tr><td colSpan="4">Filtering...</td></tr>
            ) : filteredOrders.map((order) => (
              <tr key={order.restock_id}>
                <td>{order.restock_id}</td>
                <td>{new Date(order.restock_date).toLocaleDateString()}</td>
                <td>{order.supplier_name}</td>
                <td>
                  <button 
                    className="view-details-btn"
                    onClick={() => handleViewDetails(order)}
                    title="View Details"
                  >
                    👁️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredOrders.length === 0 && !filterLoading && (searchTerm || ingredientFilter) && (
        <div className="no-results">
          No restock orders found matching your filter.
        </div>
      )}
      {filteredOrders.length === 0 && !searchTerm && !ingredientFilter && !loading && !error && (
         <div className="no-results">
           No restock orders available.
         </div>
       )}
    </div>
  );
};

export default RestockManagement;
