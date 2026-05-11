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
  selectedSize?: string;
}

export interface CartItem extends Shoe {
  quantity: number;
  cartItemId: string; // Unique ID for cart item combining id and selectedSize
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (shoe: Shoe) => void;
  removeFromCart: (cartItemIdOrId: string | number) => void;
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
      const cartItemId = `${shoe.id}-${shoe.selectedSize || 'default'}`;
      const existing = prev.find((item) => item.cartItemId === cartItemId);
      if (existing) {
        return prev.map((item) =>
          item.cartItemId === cartItemId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...shoe, quantity: 1, cartItemId }];
    });
  };

  const removeFromCart = (cartItemIdOrId: string | number) => {
    setCart((prev) => prev.filter((item) => 
      typeof cartItemIdOrId === 'string' 
        ? item.cartItemId !== cartItemIdOrId 
        : item.id !== cartItemIdOrId
    ));
  };

  const clearCart = () => setCart([]);

  /**
   * Buy Now: Bypasses cart state.
   * Temporarily replaces the cart with just this one item,
   * then navigates to /checkout. Cart is restored to original on clearCart().
   */
  const buyNow = (shoe: Shoe) => {
    const cartItemId = `${shoe.id}-${shoe.selectedSize || 'default'}`;
    setCart([{ ...shoe, quantity: 1, cartItemId }]);
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
