"use client";

import React, { createContext, useContext, useState } from "react";
import { useRouter } from "next/navigation";

export interface Shoe {
  id: number;
  name: string;
  price: number;
  image_url: string;
  description: string;
  category?: string;
}

interface CartItem extends Shoe {
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (shoe: Shoe) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  // ── Buy Now ──
  buyNow: (shoe: Shoe) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const router = useRouter();

  const addToCart = (shoe: Shoe) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === shoe.id);
      if (existing) {
        return prev.map((item) =>
          item.id === shoe.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...shoe, quantity: 1 }];
    });
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => setCart([]);

  /**
   * Buy Now: Bypasses cart state.
   * Temporarily replaces the cart with just this one item,
   * then navigates to /checkout. Cart is restored to original on clearCart().
   */
  const buyNow = (shoe: Shoe) => {
    setCart([{ ...shoe, quantity: 1 }]);
    router.push("/checkout");
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, clearCart, totalItems, totalPrice, buyNow }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
}
