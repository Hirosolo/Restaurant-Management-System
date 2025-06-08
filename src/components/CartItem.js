import React from 'react';
import { useCart } from '../contexts/CartContext';
import styles from '../styles/CartItem.module.css';

function CartItem({ item, index }) {
  const { removeFromCart } = useCart();

  // Định dạng giá tiền thành VND
  const formattedPrice = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(item.price * (item.quantity || 1));

  return (
    <div className={styles.cartItem}>
      <img src={item.image} alt={item.name} className={styles.itemImage} />
      <div className={styles.itemContent}>
        <div className={styles.itemHeader}>
          <span>{item.name}</span>
          <button 
            className={styles.removeBtn}
            onClick={() => removeFromCart(index)}
          >
            ✕
          </button>
        </div>
        <div className={styles.itemDetails}>
          <span>{formattedPrice}</span>
          <span>Qty: {item.quantity || 1}</span>
        </div>
      </div>
    </div>
  );
}

export default CartItem;