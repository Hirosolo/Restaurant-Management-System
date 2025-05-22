import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import CartItem from './CartItem';
import styles from '../styles/CartSection.module.css';

function CartSection() {
  const { cart, calculateTotal } = useCart();
  const [localCart, setLocalCart] = useState(cart);
  const navigate = useNavigate;
  
  // Cập nhật localCart khi cart thay đổi
  useEffect(() => {
    setLocalCart(cart);
    console.log('CartSection: Cart updated', cart);
  }, [cart]);
  
  // Đọc cart từ localStorage khi component mount
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem('cart');
      if (storedCart) {
        const parsedCart = JSON.parse(storedCart);
        if (Array.isArray(parsedCart)) {
          setLocalCart(parsedCart);
        }
      }
    } catch (err) {
      console.error('Error reading cart from localStorage', err);
    }
  }, []);
   const handleCheckout = () => {
    // Nếu giỏ hàng không trống, chuyển đến trang checkout
    if (cart.length > 0) {
      navigate('/checkout');
    }
  };
  return (
    <div className={styles.cartSection}>
      <h2 className={styles.cartTitle}>My Order</h2>
      
      {localCart.length === 0 ? (
        <div className={styles.emptyCart}>
          Your cart is empty
        </div>
      ) : (
        <div className={styles.cartItems}>
          {localCart.map((item, index) => (
            <CartItem key={index} item={item} index={index} />
          ))}
          
          <div className={styles.cartTotal}>
            <span>Total:</span>
            <span>${calculateTotal()}</span>
          </div>
        </div>
      )}
      
      <button 
        className={styles.checkoutButton}
        disabled={localCart.length === 0}
        onClick={handleCheckout}
      >
        Check Out
      </button>
    </div>
  );
}

export default CartSection;