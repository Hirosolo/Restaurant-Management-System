import React, { useState } from 'react';
import styles from '../styles/FavoriteOrders.module.css';

function FavoriteOrders() {
  // Sample favorite orders data - có thể nhận từ props hoặc API
  const [favoriteOrders] = useState([
    {
      id: 1,
      name: 'Chicken Noodle Soup',
      price: '26.10$',
      image: '/assets/RCP-001.jpg',
      isFavorite: true
    },
    {
      id: 2,
      name: 'Chicken Noodle Soup',
      price: '26.10$',
      image: '/assets/RCP-001.jpg',
      isFavorite: true
    },
    {
      id: 3,
      name: 'Chicken Noodle Soup',
      price: '26.10$',
      image: '/assets/RCP-001.jpg',
      isFavorite: true
    },
    {
      id: 4,
      name: 'Chicken Noodle Soup',
      price: '26.10$',
      image: '/assets/RCP-001.jpg',
      isFavorite: true
    }
  ]);

  // Handlers
  const handleReorder = (orderId) => {
    console.log(`Reordering favorite order ${orderId}`);
    // Implement reorder logic
  };

  const handleRating = (orderId) => {
    console.log(`Rating favorite order ${orderId}`);
    // Implement rating logic
  };

  return (
    <div className={styles.accountSection}>
      <h2>Favourite Order</h2>
      <div className={styles.favoriteOrders}>
        {favoriteOrders.map((order, index) => (
          <div className={styles.favoriteOrderItem} key={index}>
            <div className={styles.favoriteOrderImage}>
              <img src={order.image} alt={order.name} />
            </div>
            <div className={styles.favoriteOrderDetails}>
              <div className={styles.favoriteHeart}>❤️</div>
              <h4>{order.name}</h4>
              <p>Paid - {order.price}</p>
              <div className={styles.favoriteOrderActions}>
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

export default FavoriteOrders;