/* MASTER_LOG - APRIL 26, 2026 
- Project Status: Shopping Flow Implementation.
- Last Action: Created Minimalist Navbar with dynamic cart counter.
- Pending Tasks: Implement sliding Cart Drawer.
*/

"use client";

import React, { useState, useEffect } from "react";
import { ShoppingBag, User as UserIcon, LogOut } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

interface NavbarProps {
  onCartClick: () => void;
  onAuthClick: () => void;
}

export default function Navbar({ onCartClick, onAuthClick }: NavbarProps) {
  const { totalItems } = useCart();
  const { user, signOut } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? "bg-white/80 backdrop-blur-lg border-b border-zinc-100 py-4" 
          : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-[1800px] mx-auto px-6 sm:px-10 lg:px-20 flex justify-between items-center">
        <a href="/" className="text-xl font-bold tracking-tighter text-zinc-900 uppercase">
          Kanpur Shoes Wala
        </a>

        <div className="flex items-center gap-6 md:gap-8">
          <ul className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-500">
            <li><a href="#gallery" className="hover:text-zinc-900 transition-colors">Collection</a></li>
            {user && <li><a href="/orders" className="hover:text-zinc-900 transition-colors">My Orders</a></li>}
            <li><a href="#" className="hover:text-zinc-900 transition-colors">Our Story</a></li>
          </ul>

          <div className="flex items-center gap-2 md:gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <button className="p-2 text-zinc-900 hover:bg-zinc-100 rounded-full transition-all">
                  <UserIcon className="w-5 h-5" />
                </button>
                <button 
                  onClick={signOut}
                  className="hidden md:flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-zinc-900 transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            ) : (
              <button 
                onClick={onAuthClick}
                className="text-xs font-bold uppercase tracking-widest text-zinc-900 hover:opacity-70 transition-all px-4 py-2 border border-zinc-200 rounded-full"
              >
                Sign In
              </button>
            )}

            <button 
              onClick={onCartClick}
              className="group relative p-2 text-zinc-900 hover:bg-zinc-100 rounded-full transition-all duration-300"
            >
              <ShoppingBag className="w-6 h-6" />
              <AnimatePresence>
                {totalItems > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    key={totalItems}
                    className="absolute -top-0.5 -right-0.5 bg-zinc-900 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
