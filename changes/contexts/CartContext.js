import { createContext, useContext, useState, useCallback, useEffect } from 'react';

/* Context cho giỏ hàng */
const CartContext = createContext();

/* Provider cung cấp giỏ hàng và hàm quản lý */
export function CartProvider({ children, initialCart, setPropCart }) {
  /* Trạng thái giỏ hàng, khởi tạo từ initialCart */
  const [cart, setCart] = useState(initialCart || []);

  // Lắng nghe thay đổi trong localStorage
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'cart') {
        try {
          const newCart = JSON.parse(e.newValue || '[]');
          setCart(newCart);
        } catch (err) {
          console.error('Error parsing cart from localStorage', err);
        }
      }
    };

    // Lắng nghe sự kiện cartUpdated
    const handleCartUpdated = () => {
      try {
        const storedCart = localStorage.getItem('cart');
        if (storedCart) {
          setCart(JSON.parse(storedCart));
        }
      } catch (err) {
        console.error('Error reading cart from storage event', err);
      }
    };

    // Thêm event listener
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('cartUpdated', handleCartUpdated);

    // Cleanup khi unmount
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cartUpdated', handleCartUpdated);
    };
  }, []);

  // Lấy dữ liệu cart từ localStorage khi component mount
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem('cart');
      if (storedCart) {
        const parsedCart = JSON.parse(storedCart);
        if (Array.isArray(parsedCart) && parsedCart.length > 0) {
          setCart(parsedCart);
        }
      }
    } catch (err) {
      console.error('Error reading cart from localStorage', err);
    }
  }, []);

  /* Thêm món vào giỏ */
  const addToCart = useCallback((item) => {
    console.log('CartContext: Adding item to cart', item);
    
    const existingItemIndex = cart.findIndex(cartItem => cartItem.id === item.id);
    const updatedCart = [...cart];
    
    if (existingItemIndex !== -1) {
      updatedCart[existingItemIndex].quantity += 1;
      console.log('CartContext: Increased quantity for existing item');
    } else {
      updatedCart.push({ 
        ...item, 
        quantity: 1, 
        note: ''
      });
      console.log('CartContext: Added new item to cart');
    }
    
    setCart(updatedCart);
    console.log('CartContext: Updated cart state', updatedCart);
    
    if (typeof setPropCart === 'function') {
      setPropCart(updatedCart);
      console.log('CartContext: Called setPropCart');
    } else {
      console.log('CartContext: setPropCart is not available');
    }
    
    // Lưu giỏ hàng vào localStorage
    try {
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      console.log('CartContext: Saved cart to localStorage');
      
      // Phát ra sự kiện để thông báo cho các component khác
      const event = new CustomEvent('cartUpdated', { 
        detail: { action: 'add', item } 
      });
      window.dispatchEvent(event);
    } catch (err) {
      console.error('CartContext: Error saving cart to localStorage', err);
    }
    
    return updatedCart;
  }, [cart, setPropCart]);

  /* Xóa món khỏi giỏ */
  const removeFromCart = useCallback((index) => {
    console.log('CartContext: Removing item at index', index);
    
    const updatedCart = cart.filter((_, i) => i !== index);
    setCart(updatedCart);
    
    if (typeof setPropCart === 'function') {
      setPropCart(updatedCart);
    }
    
    // Cập nhật localStorage
    try {
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      
      // Phát ra sự kiện để thông báo cho các component khác
      const event = new CustomEvent('cartUpdated', { 
        detail: { action: 'remove', index } 
      });
      window.dispatchEvent(event);
    } catch (err) {
      console.error('CartContext: Error saving cart to localStorage', err);
    }
    
    return updatedCart;
  }, [cart, setPropCart]);

  /* Tăng số lượng */
  const increaseQuantity = useCallback((index) => {
    console.log('CartContext: Increasing quantity for item at index', index);
    
    const updatedCart = [...cart];
    updatedCart[index].quantity += 1;
    setCart(updatedCart);
    
    if (typeof setPropCart === 'function') {
      setPropCart(updatedCart);
    }
    
    // Cập nhật localStorage
    try {
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      
      // Phát ra sự kiện để thông báo cho các component khác
      const event = new CustomEvent('cartUpdated', { 
        detail: { action: 'increase', index } 
      });
      window.dispatchEvent(event);
    } catch (err) {
      console.error('CartContext: Error saving cart to localStorage', err);
    }
    
    return updatedCart;
  }, [cart, setPropCart]);

  /* Giảm số lượng */
  const decreaseQuantity = useCallback((index) => {
    console.log('CartContext: Decreasing quantity for item at index', index);
    
    const updatedCart = [...cart];
    if (updatedCart[index].quantity > 1) {
      updatedCart[index].quantity -= 1;
    } else {
      updatedCart.splice(index, 1);
    }
    setCart(updatedCart);
    
    if (typeof setPropCart === 'function') {
      setPropCart(updatedCart);
    }
    
    // Cập nhật localStorage
    try {
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      
      // Phát ra sự kiện để thông báo cho các component khác
      const event = new CustomEvent('cartUpdated', { 
        detail: { action: 'decrease', index } 
      });
      window.dispatchEvent(event);
    } catch (err) {
      console.error('CartContext: Error saving cart to localStorage', err);
    }
    
    return updatedCart;
  }, [cart, setPropCart]);

  /* Cập nhật ghi chú */
  const updateNote = useCallback((index, note) => {
    console.log('CartContext: Updating note for item at index', index);
    
    const updatedCart = [...cart];
    updatedCart[index].note = note;
    setCart(updatedCart);
    
    if (typeof setPropCart === 'function') {
      setPropCart(updatedCart);
    }
    
    // Cập nhật localStorage
    try {
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      
      // Phát ra sự kiện để thông báo cho các component khác
      const event = new CustomEvent('cartUpdated', { 
        detail: { action: 'updateNote', index, note } 
      });
      window.dispatchEvent(event);
    } catch (err) {
      console.error('CartContext: Error saving cart to localStorage', err);
    }
    
    return updatedCart;
  }, [cart, setPropCart]);

  /* Tính tổng giá */
  const calculateTotal = useCallback(() => {
    const total = cart.reduce((total, item) => total + item.price * item.quantity, 0);
    console.log('CartContext: Calculated total', total);
    return total.toFixed(2);
  }, [cart]);

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      increaseQuantity,
      decreaseQuantity,
      updateNote,
      calculateTotal
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartProvider;