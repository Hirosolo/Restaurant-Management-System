import React from 'react';
import '../styles/Order.css';

const Order = ({ onTabChange, allOrdersData, isLoadingAllOrders }) => {
  const sections = [
    {
      title: "Most ordered food",
      items: [
        { name: "Chicken Noodle Soup", image: "🍜" },
        { name: "Chicken Noodle Soup", image: "🍜" },
        { name: "Chicken Noodle Soup", image: "🍜" },
        { name: "Chicken Noodle Soup", image: "🍜" }
      ]
    },
    {
      title: "Least ordered food", 
      items: [
        { name: "Chicken Noodle Soup", image: "🍜" },
        { name: "Chicken Noodle Soup", image: "🍜" },
        { name: "Chicken Noodle Soup", image: "🍜" },
        { name: "Chicken Noodle Soup", image: "🍜" }
      ]
    }
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

  // Helper to format date and time
  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    const options = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false // Use 24-hour format
    };
    return date.toLocaleDateString('en-GB', options).replace(',', '') + ' ' + date.toLocaleTimeString('en-GB', options);
  };

  return (
    <div className="order-container">
      {/* Header */}
      
      {/* Order Table */}
      <div className="order-table-container">{/* Add a container for styling */}
        <h2>All Orders</h2>
        {isLoadingAllOrders ? (
          <div className="loading">Loading orders...</div>
        ) : allOrdersData && allOrdersData.length > 0 ? (
          <table className="orders-table">{/* Add a class for styling */}
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Time</th>
                <th>Order Details</th>
                <th>Status</th>
                <th>Customer Name</th>
                <th>Delivery Address</th>
              </tr>
            </thead>
            <tbody>
              {allOrdersData.map((order) => (
                <tr key={order.order_id}> {/* Use order_id as key */}
                  <td>{order.order_id}</td>
                  <td>{formatDateTime(order.time)}</td>{/* Format time */}
                  <td>
                    {order.order_details && order.order_details.map((item, index) => (
                      <div key={index}>{item.recipe_name} x{item.quantity}</div>
                    ))}{/* Display order items */}
                  </td>
                  <td>{order.status}</td>
                  <td>{order.customer_name}</td>
                  <td>{order.delivery_address}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No orders available.</p>
        )}
      </div>
    </div>
  );
};

export default Order;