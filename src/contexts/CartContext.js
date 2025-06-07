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
        // If item exists, increment its quantity by 1
        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          quantity: updatedCart[existingItemIndex].quantity + 1
        };
        console.log(`CartContext: Updated quantity for ${item.name}: ${updatedCart[existingItemIndex].quantity}`);
      } else {
        // If item doesn't exist, add it with quantity 1
        const newItem = { 
          ...item, 
          quantity: 1, 
          note: '',
          image: item.image || item.image_url
        };
        updatedCart.push(newItem);
        console.log(`CartContext: Added new item ${newItem.name} with quantity: ${newItem.quantity}`);
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
      console.log(`CartContext: Increased quantity for item at index ${index}: ${updatedCart[index].quantity}`);
      return updatedCart;
    });
  }, []);

  /* Giảm số lượng */
  const decreaseQuantity = useCallback((index) => {
    setCart(prevCart => {
      const updatedCart = [...prevCart];
      if (updatedCart[index].quantity > 1) {
        updatedCart[index].quantity -= 1;
        console.log(`CartContext: Decreased quantity for item at index ${index}: ${updatedCart[index].quantity}`);
      } else {
        const removedItem = updatedCart.splice(index, 1);
        console.log(`CartContext: Removed item at index ${index}: ${removedItem[0]?.name}`);
      }
      return updatedCart;
    });
  }, []);

  /* Cập nhật ghi chú */
  const updateNote = useCallback((index, note) => {
    setCart(prevCart => {
      const updatedCart = [...prevCart];
      updatedCart[index].note = note;
      console.log(`CartContext: Updated note for item at index ${index}: ${note}`);
      return updatedCart;
    });
  }, []);

  /* Tính tổng giá */
  const calculateTotal = useCallback(() => {
    if (!cart || cart.length === 0) return 0;
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    console.log(`CartContext: Calculated total: ${total}`);
    return total;
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