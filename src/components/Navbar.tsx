"use client";

import React, { useState, useEffect } from "react";
import { ShoppingBag, User as UserIcon, LogOut, Menu, X, Zap } from "lucide-react";
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
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-white/80 backdrop-blur-xl border-b border-[#F3F4F6] py-3 shadow-sm"
            : "bg-transparent py-6"
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-6 sm:px-10 flex justify-between items-center relative">
          
          {/* Brand Name - Centered Design */}
          <div className="flex-1 hidden lg:flex items-center gap-8">
            <ul className="flex items-center gap-8 text-[11px] font-black uppercase tracking-[0.2em] text-[#121212]/60">
              <li><Link href="/#gallery" className="hover:text-[#FF4F00] transition-colors">Collection</Link></li>
              <li><Link href="/orders" className="hover:text-[#FF4F00] transition-colors">Orders</Link></li>
              <li><Link href="/#about" className="hover:text-[#FF4F00] transition-colors">Story</Link></li>
            </ul>
          </div>

          <Link
            href="/"
            className="flex items-center gap-2.5 group"
          >
            <div className="w-8 h-8 rounded-xl bg-[#FF4F00] flex items-center justify-center shadow-lg shadow-orange-200 group-hover:scale-110 transition-transform duration-300">
              <Zap className="w-4.5 h-4.5 text-white fill-white" />
            </div>
            <span
              className="text-lg sm:text-xl font-black tracking-tight text-[#121212] uppercase leading-none"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              Kanpur Shoes Wala
            </span>
          </Link>

          <div className="flex-1 flex justify-end items-center gap-2 sm:gap-4">
            {/* Desktop Auth */}
            <div className="hidden md:flex items-center gap-4">
              {user ? (
                <button
                  onClick={signOut}
                  className="p-2.5 text-[#121212]/40 hover:text-[#FF4F00] transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              ) : (
                <button
                  onClick={onAuthClick}
                  className="text-[11px] font-black uppercase tracking-[0.15em] text-[#121212] px-6 py-2.5 border-2 border-[#121212] rounded-full hover:bg-[#121212] hover:text-white transition-all duration-300"
                  style={{ fontFamily: "var(--font-montserrat)" }}
                >
                  Join
                </button>
              )}
            </div>

            {/* Cart */}
            <button
              onClick={onCartClick}
              className="relative p-2.5 text-[#121212] hover:text-[#FF4F00] hover:bg-orange-50 rounded-full transition-all duration-300"
            >
              <ShoppingBag className="w-6 h-6" />
              <AnimatePresence>
                {totalItems > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute top-1 right-1 bg-[#FF4F00] text-white text-[9px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-white shadow-sm"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            {/* Mobile Menu */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2.5 text-[#121212] hover:text-[#FF4F00] transition-all"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="fixed inset-0 z-40 bg-white pt-24 px-8 lg:hidden"
          >
            <div className="flex flex-col gap-8">
              <Link
                href="/#gallery"
                onClick={() => setMobileOpen(false)}
                className="text-4xl font-black text-[#121212] tracking-tighter"
                style={{ fontFamily: "var(--font-montserrat)" }}
              >
                Collection
              </Link>
              <Link
                href="/orders"
                onClick={() => setMobileOpen(false)}
                className="text-4xl font-black text-[#121212] tracking-tighter"
                style={{ fontFamily: "var(--font-montserrat)" }}
              >
                My Orders
              </Link>
              <Link
                href="/#about"
                onClick={() => setMobileOpen(false)}
                className="text-4xl font-black text-[#121212] tracking-tighter"
                style={{ fontFamily: "var(--font-montserrat)" }}
              >
                Our Story
              </Link>
              <div className="mt-8 pt-8 border-t border-zinc-100 flex flex-col gap-4">
                {user ? (
                  <button
                    onClick={() => { signOut(); setMobileOpen(false); }}
                    className="w-full py-5 bg-[#121212] text-white rounded-2xl font-black text-sm uppercase tracking-[0.2em]"
                  >
                    Sign Out
                  </button>
                ) : (
                  <button
                    onClick={() => { onAuthClick(); setMobileOpen(false); }}
                    className="w-full py-5 bg-[#FF4F00] text-white rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-orange-200"
                  >
                    Join Members
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
