"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, ShoppingBag, ChevronRight } from "lucide-react";
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
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[60]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-[400px] bg-white border-l border-[#efefef] shadow-2xl z-[70] flex flex-col"
          >
            {/* Header */}
            <div className="px-6 py-5 flex justify-between items-center border-b border-[#efefef]">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-black" strokeWidth={1.75} />
                <h2 className="text-[16px] font-black tracking-tight text-black">Your Cart</h2>
                {totalItems > 0 && (
                  <span className="text-[11px] font-bold text-[#999]">({totalItems} item{totalItems !== 1 ? "s" : ""})</span>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-2 text-[#999] hover:text-black hover:bg-[#f7f7f7] rounded-xl transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-grow overflow-y-auto px-6 py-5 space-y-4 no-scrollbar">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-[#f7f7f7] flex items-center justify-center">
                    <ShoppingBag className="w-7 h-7 text-[#ccc]" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-[15px] font-bold text-black">Your cart is empty</p>
                    <p className="text-[13px] text-[#999] mt-1">Add items to get started.</p>
                  </div>
                  <button
                    onClick={onClose}
                    className="mt-4 btn-pill btn-pill-outline text-[11px] py-3 px-8"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <motion.div
                    layout
                    key={item.cartItemId}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex gap-4 p-3.5 rounded-[14px] border border-[#efefef] hover:border-[#ddd] transition-colors group"
                  >
                    <div className="relative w-[72px] h-[72px] bg-[#f7f7f7] rounded-[10px] overflow-hidden shrink-0">
                      <Image
                        src={item.image_url}
                        alt={item.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="flex-grow flex flex-col justify-between min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="font-bold text-[13px] text-black leading-tight line-clamp-2">
                          {item.name}
                        </h3>
                        <button
                          onClick={() => removeFromCart(item.cartItemId)}
                          className="p-1 text-[#ccc] hover:text-red-400 transition-colors shrink-0"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex gap-1.5">
                          {item.selectedSize && (
                            <span className="text-[10px] font-bold bg-[#f7f7f7] text-[#555] px-2.5 py-1 rounded-lg uppercase">
                              UK {item.selectedSize}
                            </span>
                          )}
                          <span className="text-[10px] font-bold bg-[#f7f7f7] text-[#555] px-2.5 py-1 rounded-lg">
                            Qty {item.quantity}
                          </span>
                        </div>
                        <span className="text-[14px] font-black text-black">
                          ₹{(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="px-6 py-5 border-t border-[#efefef]">
                <div className="space-y-2 mb-5">
                  <div className="flex justify-between text-[13px]">
                    <span className="text-[#777]">Subtotal</span>
                    <span className="font-bold text-black">₹{totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-[13px]">
                    <span className="text-[#777]">Delivery</span>
                    <span className="font-bold text-green-600">Free</span>
                  </div>
                  <div className="ksw-divider" />
                  <div className="flex justify-between">
                    <span className="text-[15px] font-bold text-black">Total</span>
                    <span className="text-[18px] font-black text-black">₹{totalPrice.toLocaleString()}</span>
                  </div>
                </div>

                <Link href="/checkout" onClick={onClose} className="block">
                  <button className="w-full btn-pill btn-pill-dark py-4 flex items-center justify-center gap-2">
                    Proceed to Checkout
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </Link>
                <button
                  onClick={onClose}
                  className="w-full mt-3 btn-pill btn-pill-outline py-3 text-[11px]"
                >
                  Continue Shopping
                </button>
                <p className="text-center text-[10px] text-[#aaa] font-medium uppercase tracking-wider mt-4">
                  Free shipping on all orders
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
