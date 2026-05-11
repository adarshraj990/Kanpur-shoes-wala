"use client";

import React, { useState, useEffect } from "react";
import { ShoppingBag, LogOut, Menu, X, Hexagon } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface NavbarProps {
  onCartClick: () => void;
  onAuthClick: () => void;
}

export default function Navbar({ onCartClick, onAuthClick }: NavbarProps) {
  const { totalItems } = useCart();
  const { user, signOut } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-[#050505]/80 backdrop-blur-2xl border-b border-white/5 py-3 shadow-[0_4px_30px_rgba(0,0,0,0.5)]"
            : "bg-transparent py-6"
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-6 sm:px-10 flex justify-between items-center">
          
          {/* Left: Navigation Links */}
          <div className="flex-1 hidden md:flex items-center gap-8">
            <Link href="/#gallery" className="text-xs font-semibold tracking-widest uppercase text-zinc-400 hover:text-[#FDE68A] transition-colors">Shop</Link>
            <Link href="/orders" className="text-xs font-semibold tracking-widest uppercase text-zinc-400 hover:text-[#FDE68A] transition-colors">Orders</Link>
          </div>

          {/* Center: Brand Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center justify-center gap-2 group">
            <Hexagon className="w-6 h-6 text-[#FDE68A] group-hover:rotate-90 transition-transform duration-500 shadow-[0_0_10px_#FDE68A] rounded-full" strokeWidth={2.5} />
            <span className="text-xl font-black tracking-tighter text-white uppercase">
              Kanpur<span className="text-[#FDE68A]">Shoes</span>
            </span>
          </Link>

          {/* Right: Actions */}
          <div className="flex-1 flex justify-end items-center gap-4 sm:gap-6">
            <div className="hidden md:flex items-center gap-6">
              {user ? (
                <button
                  onClick={signOut}
                  className="text-xs font-semibold tracking-widest uppercase text-zinc-400 hover:text-[#FDE68A] transition-colors flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              ) : (
                <button
                  onClick={onAuthClick}
                  className="text-xs font-semibold tracking-widest uppercase text-zinc-400 hover:text-[#FDE68A] transition-colors"
                >
                  Account
                </button>
              )}
            </div>

            {/* Cart Button */}
            <button
              onClick={onCartClick}
              className="relative p-2 text-white hover:text-[#FDE68A] hover:scale-110 transition-all duration-300"
            >
              <ShoppingBag className="w-5 h-5" strokeWidth={2} />
              <AnimatePresence>
                {totalItems > 0 && (
                  <motion.span
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="absolute -top-1 -right-1 bg-[#FDE68A] text-black text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-white hover:text-[#FDE68A]"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Full-Screen Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-[#050505]/95 backdrop-blur-3xl pt-28 px-8 md:hidden flex flex-col"
          >
            <div className="flex justify-end mb-8">
              <button onClick={() => setMobileOpen(false)} className="p-2 text-white bg-white/10 hover:bg-white/20 transition-colors rounded-full border border-white/5">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex flex-col gap-6 text-center">
              <Link href="/#gallery" onClick={() => setMobileOpen(false)} className="text-3xl font-black uppercase tracking-tighter text-white hover:text-[#FDE68A] transition-colors">Shop</Link>
              <Link href="/orders" onClick={() => setMobileOpen(false)} className="text-3xl font-black uppercase tracking-tighter text-white hover:text-[#FDE68A] transition-colors">Orders</Link>
              
              <div className="mt-8 pt-8 border-t border-white/10">
                {user ? (
                  <button
                    onClick={() => { signOut(); setMobileOpen(false); }}
                    className="w-full py-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white transition-colors rounded-xl font-bold text-sm uppercase tracking-widest"
                  >
                    Logout
                  </button>
                ) : (
                  <button
                    onClick={() => { onAuthClick(); setMobileOpen(false); }}
                    className="w-full py-4 bg-[#FDE68A] text-black hover:bg-[#D97706] transition-colors rounded-xl font-bold text-sm uppercase tracking-widest"
                  >
                    Account Login
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
