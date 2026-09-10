import React, { createContext, useContext, useState, useMemo } from 'react';
import { MenuItem, CartItem } from '../types';
import { getItemPriceINR } from '../utils/price';

interface CartContextType {
  items: CartItem[];
  addToCart: (item: MenuItem) => void;
  addItem: (item: MenuItem) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  tax: number;
  total: number;
}

const CartContext = createContext<CartContextType>({
  items: [],
  addToCart: () => {},
  addItem: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  itemCount: 0,
  subtotal: 0,
  tax: 0,
  total: 0
});

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = (menuItem: MenuItem) => {
    setItems((prev) => {
      const existing = prev.find((ci) => ci.menuItem.id === menuItem.id);
      if (existing) {
        return prev.map((ci) =>
          ci.menuItem.id === menuItem.id
            ? { ...ci, quantity: ci.quantity + 1 }
            : ci
        );
      }
      return [...prev, { menuItem, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setItems((prev) => prev.filter((ci) => ci.menuItem.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setItems((prev) =>
      prev.map((ci) =>
        ci.menuItem.id === itemId ? { ...ci, quantity } : ci
      )
    );
  };

  const clearCart = () => setItems([]);

  const { itemCount, subtotal, tax, total } = useMemo(() => {
    const count = items.reduce((acc, ci) => acc + ci.quantity, 0);
    const sub = items.reduce((acc, ci) => acc + getItemPriceINR(ci.menuItem) * ci.quantity, 0);
    // 5% standard cafeteria tax
    const t = Math.round(sub * 0.05);
    return {
      itemCount: count,
      subtotal: sub,
      tax: t,
      total: sub + t
    };
  }, [items]);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        addItem: addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        itemCount,
        subtotal,
        tax,
        total
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
