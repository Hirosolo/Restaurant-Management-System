import React, { useState } from 'react';
import styles from '../styles/OrderHistory.module.css';

function OrderHistory() {
  // Sample order history data - có thể nhận từ props hoặc API
  const [orderHistory] = useState([
    {
      id: '#261004',
      name: 'Chicken Noodle Soup',
      price: '26.10$',
      image: '/assets/RCP-001.jpg',
      isFavorite: false
    },
    {
      id: '#261004',
      name: 'Chicken Noodle Soup',
      price: '26.10$',
      image: '/assets/RCP-001.jpg',
      isFavorite: false
    },
    {
      id: '#261004',
      name: 'Chicken Noodle Soup',
      price: '26.10$',
      image: '/assets/RCP-001.jpg',
      isFavorite: false
    }
  ]);

  // Handlers
  const handleReorder = (orderId) => {
    console.log(`Reordering order ${orderId}`);
    // Implement reorder logic
  };

  const handleRating = (orderId) => {
    console.log(`Rating order ${orderId}`);
    // Implement rating logic
  };

  return (
    <div className={styles.accountSection}>
      <h2>Order History</h2>
      <div className={styles.orderHistoryList}>
        {orderHistory.map((order, index) => (
          <div className={styles.orderItem} key={index}>
            <div className={styles.orderImage}>
              <img src={order.image} alt={order.name} />
            </div>
            <div className={styles.orderDetails}>
              <div className={styles.orderHeart}>
                {order.isFavorite ? (
                  <span className={styles.favoriteHeart}>❤️</span>
                ) : (
                  <span className={styles.favoriteHeartOutline}>♡</span>
                )}
              </div>
              <h4>{order.name}</h4>
              <p>Paid - {order.price}</p>
              <div className={styles.orderId}>{order.id}</div>
              <div className={styles.orderActions}>
                <button 
                  className={styles.reorderBtn}
                  onClick={() => handleReorder(order.id)}
                >
                  Reorder
                </button>
                <button 
                  className={styles.ratingBtn}
                  onClick={() => handleRating(order.id)}
                >
                  Rating
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OrderHistory;