import { createContext, useContext, useState, useCallback, useEffect } from 'react';

/* Context cho giỏ hàng */
const CartContext = createContext();

/* Provider cung cấp giỏ hàng và hàm quản lý */
export function CartProvider({ children, initialCart, setPropCart }) {
  /* Trạng thái giỏ hàng, khởi tạo từ initialCart */
  const [cart, setCart] = useState(initialCart || []);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem('cart');
      if (storedCart) {
        const parsedCart = JSON.parse(storedCart);
        if (Array.isArray(parsedCart) && parsedCart.length > 0) {
          setCart(parsedCart);
          if (typeof setPropCart === 'function') {
            setPropCart(parsedCart);
          }
        }
      }
    } catch (err) {
      console.error('Error reading cart from localStorage', err);
    }
  }, [setPropCart]);

  // Update localStorage when cart changes
  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(cart));
      if (typeof setPropCart === 'function') {
        setPropCart(cart);
      }
    } catch (err) {
      console.error('Error saving cart to localStorage', err);
    }
  }, [cart, setPropCart]);

  /* Thêm món vào giỏ */
  const addToCart = useCallback((item) => {
    console.log('CartContext: Adding item to cart', item);
    
    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(cartItem => cartItem.id === item.id);
      const updatedCart = [...prevCart];
      
      if (existingItemIndex !== -1) {
        updatedCart[existingItemIndex].quantity += 1;
      } else {
        updatedCart.push({ 
          ...item, 
          quantity: 1, 
          note: '',
          image: item.image || item.image_url
        });
      }
      
      return updatedCart;
    });
  }, []);

  /* Xóa món khỏi giỏ */
  const removeFromCart = useCallback((index) => {
    setCart(prevCart => prevCart.filter((_, i) => i !== index));
  }, []);

  /* Tăng số lượng */
  const increaseQuantity = useCallback((index) => {
    setCart(prevCart => {
      const updatedCart = [...prevCart];
      updatedCart[index].quantity += 1;
      return updatedCart;
    });
  }, []);

  /* Giảm số lượng */
  const decreaseQuantity = useCallback((index) => {
    setCart(prevCart => {
      const updatedCart = [...prevCart];
      if (updatedCart[index].quantity > 1) {
        updatedCart[index].quantity -= 1;
      } else {
        updatedCart.splice(index, 1);
      }
      return updatedCart;
    });
  }, []);

  /* Cập nhật ghi chú */
  const updateNote = useCallback((index, note) => {
    setCart(prevCart => {
      const updatedCart = [...prevCart];
      updatedCart[index].note = note;
      return updatedCart;
    });
  }, []);

  /* Tính tổng giá */
  const calculateTotal = useCallback(() => {
    if (!cart || cart.length === 0) return 0;
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  }, [cart]);

  return (
    <CartContext.Provider value={{
      cart,
      setCart,
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