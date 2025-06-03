import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

function Dashboard() {
  const [revenue, setRevenue] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        const revRes = await fetch('http://localhost:3001/api/orders/revenue', {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });
        if (!revRes.ok) throw new Error('Failed to fetch revenue data');
        const revData = await revRes.json();
        const ingRes = await fetch('http://localhost:3001/api/orders/ingredients', {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });
        if (!ingRes.ok) throw new Error('Failed to fetch ingredients data');
        const ingData = await ingRes.json();
        setRevenue(revData.revenue || []);
        setIngredients(ingData.ingredients || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Dashboard</h1>
      <button className="dashboard-back-btn" onClick={() => navigate('/')}>Back to Home</button>
      {loading ? <p>Loading...</p> : error ? <p style={{color: 'red'}}>{error}</p> : (
        <>
          <section className="dashboard-section">
            <h2>Revenue Overview</h2>
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Revenue</th>
                </tr>
              </thead>
              <tbody>
                {revenue.length === 0 ? (
                  <tr><td colSpan={2}>No revenue data</td></tr>
                ) : revenue.map((r, i) => (
                  <tr key={i}>
                    <td>{r.date_recorded || '-'}</td>
                    <td>{r.daily_revenue ? r.daily_revenue.toLocaleString() + ' vnd' : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
          <section className="dashboard-section">
            <h2>Ingredients Stock</h2>
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Ingredient</th>
                  <th>Stock</th>
                </tr>
              </thead>
              <tbody>
                {ingredients.length === 0 ? (
                  <tr><td colSpan={2}>No ingredient data</td></tr>
                ) : ingredients.map((ing, i) => (
                  <tr key={i}>
                    <td>{ing.ingredient_name}</td>
                    <td>{ing.quantity} {ing.unit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </>
      )}
    </div>
  );
}

export default Dashboard; 