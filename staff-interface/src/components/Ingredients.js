import React from 'react';
import '../styles/Ingredients.css';

const Ingredients = ({ onTabChange }) => {
  // Sample data
  const importedIngredients = [
    { name: 'Salmon', quantity: 2, unit: 'kg', supplier: 'Thuy cute' },
    { name: 'Chicken', quantity: 2, unit: 'kg', supplier: 'Thuy cute' },
    { name: 'Tuna', quantity: 2, unit: 'kg', supplier: 'Thuy cute' },
    { name: 'Shrimp', quantity: 2, unit: 'kg', supplier: 'Thuy cute' }
  ];

  const expiredIngredients = [
    { name: 'Salmon', quantity: 2, unit: 'kg' },
    { name: 'Chicken', quantity: 2, unit: 'kg' }
  ];

  const incompleteOrders = [
    { orderId: 1, reason: 'Order not made as requested' },
    { orderId: 2, reason: 'Order not made as requested' }
  ];

  const handleTabClick = (tab) => {
    if (onTabChange) {
      onTabChange(tab);
    }
  };

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  return (
    <div className="ingredients-container">
      {/* Header */}
     

      {/* Content */}
      <div className="ingredients-content">
        {/* Most Imported Ingredients */}
        <div className="ingredients-section">
          <h3 className="section-title">Most imported ingredients</h3>
          <div className="ingredients-table">
            <div className="table-header">
              <div className="col-ingredients">Ingredients</div>
              <div className="col-quantity">Quantity</div>
              <div className="col-unit">Unit</div>
              <div className="col-supplier">Supplier Name</div>
            </div>
            <div className="table-body">
              {importedIngredients.map((item, index) => (
                <div key={index} className="table-row">
                  <div className="col-ingredients">{item.name}</div>
                  <div className="col-quantity">{item.quantity}</div>
                  <div className="col-unit">{item.unit}</div>
                  <div className="col-supplier">{item.supplier}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="bottom-section">
          {/* Waste Materials */}
          <div className="waste-section">
            <h3 className="section-title">Waste materials</h3>
            
            {/* Expired Ingredients */}
            <div className="subsection">
              <h4 className="subsection-title">Expired ingredients</h4>
              <div className="waste-table">
                <div className="table-header">
                  <div className="col-ingredients">Ingredients</div>
                  <div className="col-quantity">Quantity</div>
                  <div className="col-unit">Unit</div>
                </div>
                <div className="table-body">
                  {expiredIngredients.map((item, index) => (
                    <div key={index} className="table-row">
                      <div className="col-ingredients">{item.name}</div>
                      <div className="col-quantity">{item.quantity}</div>
                      <div className="col-unit">{item.unit}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Incomplete Orders */}
          <div className="incomplete-section">
            <h4 className="subsection-title">Incompleted orders</h4>
            <div className="incomplete-table">
              <div className="table-header">
                <div className="col-order-id">Order ID</div>
                <div className="col-reason">Reason</div>
              </div>
              <div className="table-body">
                {incompleteOrders.map((order, index) => (
                  <div key={index} className="table-row">
                    <div className="col-order-id">{order.orderId}</div>
                    <div className="col-reason">{order.reason}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ingredients;