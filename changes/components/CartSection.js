import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import CartItem from './CartItem';
import styles from '../styles/CartSection.module.css';

function CartSection() {
  const { cart, calculateTotal } = useCart();
  const { authStatus, userAddress } = useAuth(); // Thêm userAddress từ AuthContext
  const [localCart, setLocalCart] = useState(cart);
  const navigate = useNavigate(); // Sửa lỗi: thiếu () ở đây
  
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
    // Kiểm tra giỏ hàng có rỗng không
    if (localCart.length === 0) {
      console.log('Cart is empty, cannot checkout');
      return;
    }

    // Debug thông tin chi tiết
    console.log('=== CHECKOUT DEBUG ===');
    console.log('authStatus from useAuth:', authStatus);
    console.log('userAddress from useAuth:', userAddress);
    console.log('authStatus from localStorage:', localStorage.getItem('authStatus'));
    console.log('userAddress from localStorage:', localStorage.getItem('userAddress'));
    
    // Lấy trạng thái đăng nhập (ưu tiên localStorage vì nó persistent)
    const currentAuthStatus = localStorage.getItem('authStatus') || authStatus;
    const currentUserAddress = localStorage.getItem('userAddress') || userAddress;
    
    console.log('Final currentAuthStatus:', currentAuthStatus);
    console.log('Final currentUserAddress:', currentUserAddress);
    
    if (currentAuthStatus === 'signedIn') {
      console.log('User is signed in');
      
      // Kiểm tra xem có địa chỉ không
      if (currentUserAddress && currentUserAddress !== 'null') {
        console.log('User has address, navigating to checkout');
        navigate('/checkout');
      } else {
        console.log('User signed in but no address, navigating to delivery');
        navigate('/delivery');
      }
    } else {
      // Chưa đăng nhập hoặc là guest -> chuyển đến delivery
      console.log('User is not signed in or is guest, navigating to delivery');
      navigate('/delivery');
    }
    console.log('=== END DEBUG ===');
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