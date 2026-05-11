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
            className="fixed inset-0 bg-[#050505]/80 backdrop-blur-md z-[60]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-[420px] bg-[#0a0a0a] border-l border-white/5 shadow-[-20px_0_50px_rgba(0,0,0,0.8)] z-[70] flex flex-col"
          >
            {/* Header */}
            <div className="px-8 py-6 flex justify-between items-center border-b border-white/5 bg-[#0a0a0a]/50 backdrop-blur-md">
              <h2 className="text-xl font-black uppercase tracking-tighter text-white">Your Bag</h2>
              <button
                onClick={onClose}
                className="p-2 text-zinc-500 hover:text-white transition-colors rounded-full hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-grow overflow-y-auto px-8 py-6 space-y-6 no-scrollbar relative">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                    <ShoppingBag className="w-8 h-8 text-zinc-600" />
                  </div>
                  <div>
                    <p className="text-white font-bold uppercase tracking-widest text-sm mt-4">Bag is empty</p>
                    <p className="text-zinc-500 text-sm mt-2">Discover our latest collection.</p>
                  </div>
                  <button
                    onClick={onClose}
                    className="mt-6 px-8 py-4 border border-white/20 text-white rounded-full text-xs font-bold uppercase tracking-[0.2em] hover:bg-white/10 hover:border-white/40 transition-all"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <motion.div
                    layout
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex gap-6 group bg-white/5 p-4 rounded-2xl border border-white/5 hover:border-white/10 transition-colors"
                  >
                    <div className="relative w-20 h-20 bg-[#050505] rounded-xl overflow-hidden flex-shrink-0 border border-white/5">
                      <Image src={item.image_url} alt={item.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div className="flex-grow flex flex-col justify-center min-w-0">
                      <div className="flex justify-between items-start gap-4 mb-1">
                        <h3 className="font-bold text-white uppercase tracking-tight text-sm truncate group-hover:text-[#FDE68A] transition-colors">{item.name}</h3>
                      </div>
                      <span className="font-bold text-white text-sm mb-3">₹{(item.price * item.quantity).toLocaleString()}</span>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-[#FDE68A] font-bold uppercase tracking-widest bg-[#FDE68A]/10 px-2 py-1 rounded">Qty {item.quantity}</span>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-zinc-500 hover:text-red-400 flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                          Remove
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="px-8 py-6 border-t border-white/5 bg-[#050505]/50 backdrop-blur-md">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-zinc-400 text-sm font-bold uppercase tracking-[0.2em]">Subtotal</span>
                  <span className="font-black text-2xl text-white tracking-tighter">₹{totalPrice.toLocaleString()}</span>
                </div>
                <Link href="/checkout" onClick={onClose} className="block w-full">
                  <button className="w-full py-4 bg-[#FDE68A] text-black rounded-full font-bold text-xs uppercase tracking-[0.2em] hover:bg-[#D97706] hover:scale-[1.02] transition-all shadow-[0_0_20px_rgba(253,230,138,0.2)]">
                    Checkout Securely
                  </button>
                </Link>
                <p className="text-center text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em] mt-6">
                  Complimentary Shipping Included
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
