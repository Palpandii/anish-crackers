import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);
const STORAGE_KEY = "deepam-cart";

function loadCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState(loadCart);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch {
      // storage full or unavailable - cart still works for this session
    }
  }, [cart]);

  const addToCart = (product, quantity = 1) => {
    setCart((current) => {
      const exists = current.find((item) => item.id === product.id);
      if (exists) {
        return current.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...current, { ...product, quantity }];
    });
  };

  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) return removeFromCart(id);
    setCart((current) => current.map((item) => (item.id === id ? { ...item, quantity } : item)));
  };

  const removeFromCart = (id) => setCart((current) => current.filter((item) => item.id !== id));
  const clearCart = () => setCart([]);

  const totals = useMemo(() => {
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discount = cart.reduce((sum, item) => {
      const original = item.oldPrice ?? item.price;
      return sum + Math.max(0, original - item.price) * item.quantity;
    }, 0);
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    return { subtotal, discount, total: subtotal, count };
  }, [cart]);

  return (
    <CartContext.Provider value={{ cart, addToCart, updateQuantity, removeFromCart, clearCart, ...totals }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside a CartProvider");
  return ctx;
};
