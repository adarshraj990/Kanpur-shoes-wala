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
      {/* Main Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "glass shadow-sm py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 flex justify-between items-center">
          
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 min-h-0 min-w-0"
          >
            <span className="w-7 h-7 rounded-lg bg-[#FF4500] flex items-center justify-center">
              <Zap className="w-4 h-4 text-white fill-white" />
            </span>
            <span
              className="text-base sm:text-lg font-black tracking-tight text-[#1A1A1A] uppercase"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              Kanpur Shoes Wala
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <ul className="hidden md:flex items-center gap-8 text-sm font-semibold text-[#1A1A1A]/60">
            <li>
              <a
                href="#gallery"
                className="hover:text-[#FF4500] transition-colors duration-200 relative group min-h-0 min-w-0 inline"
              >
                Collection
                <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-[#FF4500] group-hover:w-full transition-all duration-300" />
              </a>
            </li>
            {user && (
              <li>
                <Link
                  href="/orders"
                  className="hover:text-[#FF4500] transition-colors duration-200 min-h-0 min-w-0 inline"
                >
                  My Orders
                </Link>
              </li>
            )}
            <li>
              <a href="#" className="hover:text-[#FF4500] transition-colors duration-200 min-h-0 min-w-0 inline">
                Our Story
              </a>
            </li>
          </ul>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Desktop Auth */}
            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <>
                  <button className="p-2 text-[#1A1A1A] hover:text-[#FF4500] hover:bg-orange-50 rounded-full transition-all">
                    <UserIcon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={signOut}
                    className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#1A1A1A]/40 hover:text-[#FF4500] transition-all min-h-0 min-w-0"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={onAuthClick}
                  className="text-xs font-bold uppercase tracking-widest text-white bg-[#1A1A1A] hover:bg-[#FF4500] px-5 py-2.5 rounded-full transition-all duration-300"
                  style={{ fontFamily: "var(--font-montserrat)" }}
                >
                  Sign In
                </button>
              )}
            </div>

            {/* Cart */}
            <button
              onClick={onCartClick}
              className="group relative p-2.5 text-[#1A1A1A] hover:text-[#FF4500] hover:bg-orange-50 rounded-full transition-all duration-300"
            >
              <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />
              <AnimatePresence>
                {totalItems > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    key={totalItems}
                    className="absolute -top-0.5 -right-0.5 bg-[#FF4500] text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-white min-h-0 min-w-0"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2.5 text-[#1A1A1A] hover:text-[#FF4500] hover:bg-orange-50 rounded-full transition-all"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-0 z-40 glass pt-20 pb-8 px-6 md:hidden shadow-2xl border-b border-zinc-100"
          >
            <div className="flex flex-col gap-1">
              <a
                href="#gallery"
                onClick={() => setMobileOpen(false)}
                className="py-4 text-lg font-bold text-[#1A1A1A] border-b border-zinc-100 hover:text-[#FF4500] transition-colors min-h-0 min-w-0 justify-start"
                style={{ fontFamily: "var(--font-montserrat)" }}
              >
                Collection
              </a>
              {user && (
                <Link
                  href="/orders"
                  onClick={() => setMobileOpen(false)}
                  className="py-4 text-lg font-bold text-[#1A1A1A] border-b border-zinc-100 hover:text-[#FF4500] transition-colors min-h-0 min-w-0 justify-start"
                  style={{ fontFamily: "var(--font-montserrat)" }}
                >
                  My Orders
                </Link>
              )}
              <a
                href="#"
                onClick={() => setMobileOpen(false)}
                className="py-4 text-lg font-bold text-[#1A1A1A] border-b border-zinc-100 hover:text-[#FF4500] transition-colors min-h-0 min-w-0 justify-start"
                style={{ fontFamily: "var(--font-montserrat)" }}
              >
                Our Story
              </a>

              <div className="mt-4 flex flex-col gap-3">
                {user ? (
                  <button
                    onClick={() => { signOut(); setMobileOpen(false); }}
                    className="w-full py-4 border-2 border-[#1A1A1A] text-[#1A1A1A] rounded-full font-bold text-sm uppercase tracking-widest hover:bg-[#1A1A1A] hover:text-white transition-all"
                    style={{ fontFamily: "var(--font-montserrat)" }}
                  >
                    Logout
                  </button>
                ) : (
                  <button
                    onClick={() => { onAuthClick(); setMobileOpen(false); }}
                    className="w-full py-4 bg-[#FF4500] text-white rounded-full font-black text-sm uppercase tracking-widest hover:bg-[#E63E00] transition-all"
                    style={{ fontFamily: "var(--font-montserrat)" }}
                  >
                    Sign In
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/20 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </>
  );
}
