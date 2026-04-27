/* MASTER_LOG - APRIL 26, 2026 
- Project Status: Shopping Flow Implementation.
- Last Action: Created premium Sliding Cart Drawer with Framer Motion.
- Pending Tasks: Connect Checkout button to payment gateway.
*/

"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import Image from "next/image";
import Link from "next/link";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { cart, removeFromCart, totalPrice, totalItems } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-[70] flex flex-col"
          >
            <div className="p-6 flex justify-between items-center border-b border-zinc-100">
              <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
                Your Bag <span className="text-zinc-400 font-normal">({totalItems})</span>
              </h2>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-zinc-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-grow overflow-y-auto p-6 space-y-8 no-scrollbar">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center">
                    <ShoppingBag className="w-8 h-8 text-zinc-300" />
                  </div>
                  <p className="text-zinc-500">Your bag is empty.</p>
                  <button 
                    onClick={onClose}
                    className="text-sm font-bold underline"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <motion.div 
                    layout
                    key={item.id} 
                    className="flex gap-4"
                  >
                    <div className="relative w-24 h-30 bg-zinc-50 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={item.image_url}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-grow flex flex-col justify-between py-1">
                      <div>
                        <div className="flex justify-between items-start">
                          <h3 className="font-medium text-zinc-900 leading-tight">{item.name}</h3>
                          <span className="font-bold">₹{item.price.toLocaleString()}</span>
                        </div>
                        <p className="text-xs text-zinc-500 mt-1 uppercase tracking-widest font-bold">Qty: {item.quantity}</p>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-zinc-400 hover:text-red-500 flex items-center gap-1 text-xs transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Remove
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            <div className="p-6 border-t border-zinc-100 space-y-4">
              <div className="flex justify-between items-center text-lg">
                <span className="text-zinc-500">Subtotal</span>
                <span className="font-bold text-2xl">₹{totalPrice.toLocaleString()}</span>
              </div>
              <p className="text-xs text-zinc-400">Shipping and taxes calculated at checkout.</p>
              <Link 
                href="/checkout"
                onClick={onClose}
                className="block w-full"
              >
                <button 
                  disabled={cart.length === 0}
                  className="w-full py-5 bg-zinc-900 text-white rounded-full font-bold text-lg hover:bg-zinc-800 transition-all disabled:bg-zinc-200 disabled:cursor-not-allowed active:scale-[0.98]"
                >
                  Checkout
                </button>
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
