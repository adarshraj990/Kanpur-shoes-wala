"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, ShoppingBag, Zap, Package } from "lucide-react";
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
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 220 }}
            className="fixed right-0 top-0 h-full w-full max-w-[420px] bg-[#0D0D0D] border-l border-[#1A1A1A] shadow-2xl z-[70] flex flex-col"
          >
            {/* Header */}
            <div className="px-6 py-5 flex justify-between items-center border-b border-[#1A1A1A]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#FF4F00] rounded-xl flex items-center justify-center">
                  <ShoppingBag className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h2 className="text-base font-black text-white tracking-tight">Your Bag</h2>
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{totalItems} item{totalItems !== 1 ? "s" : ""}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2.5 hover:bg-[#1A1A1A] rounded-xl transition-colors text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-grow overflow-y-auto px-6 py-4 space-y-5 no-scrollbar">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-5 py-20">
                  <div className="w-20 h-20 bg-[#1A1A1A] rounded-3xl flex items-center justify-center">
                    <ShoppingBag className="w-9 h-9 text-zinc-700" />
                  </div>
                  <div>
                    <p className="text-white font-black text-lg">Your bag is empty</p>
                    <p className="text-zinc-500 text-sm mt-1">Add some premium kicks to get started</p>
                  </div>
                  <button
                    onClick={onClose}
                    className="px-8 py-3 bg-[#FF4F00] text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#E64600] transition-colors"
                  >
                    Shop Collection
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
                    className="flex gap-4 p-4 bg-[#111] border border-[#1A1A1A] rounded-2xl hover:border-[#2A2A2A] transition-colors"
                  >
                    <div className="relative w-20 h-20 bg-[#1A1A1A] rounded-xl overflow-hidden flex-shrink-0 border border-[#2A2A2A]">
                      <Image src={item.image_url} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-grow flex flex-col justify-between min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="font-bold text-white leading-tight text-sm truncate">{item.name}</h3>
                        <span className="font-black text-[#FF4F00] text-sm flex-shrink-0">₹{(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-[10px] text-zinc-600 font-black uppercase tracking-widest bg-[#1A1A1A] px-2.5 py-1 rounded-lg">Qty: {item.quantity}</span>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-zinc-600 hover:text-red-400 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest transition-colors hover:bg-red-400/10 px-2 py-1 rounded-lg"
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
              <div className="px-6 py-5 border-t border-[#1A1A1A] space-y-4 bg-[#0D0D0D]">
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400 text-sm font-bold">Total</span>
                  <span className="font-black text-2xl text-white">₹{totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-[10px] text-zinc-600 font-bold uppercase tracking-widest">
                  <Package className="w-3 h-3" /> Free delivery • 7 day returns
                </div>
                <Link href="/checkout" onClick={onClose} className="block w-full">
                  <button className="w-full py-4 bg-[#FF4F00] text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-[#E64600] transition-all shadow-[0_8px_24px_rgba(255,79,0,0.2)] active:scale-[0.98] flex items-center justify-center gap-2">
                    <Zap className="w-5 h-5 fill-white" />
                    Proceed to Checkout
                  </button>
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
