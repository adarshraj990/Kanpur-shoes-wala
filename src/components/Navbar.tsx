"use client";

import React, { useState, useEffect, useRef } from "react";
import { ShoppingBag, LogOut, Menu, X, Search, Heart, User } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface NavbarProps {
  onCartClick: () => void;
  onAuthClick: () => void;
}

const NAV_LINKS = [
  { label: "Chelsea", href: "/#gallery" },
  { label: "Sneakers", href: "/#gallery" },
  { label: "Loafers", href: "/#gallery" },
  { label: "Formals", href: "/#gallery" },
  { label: "Sports", href: "/#gallery" },
  { label: "Sale", href: "/#gallery", accent: true },
];

export default function Navbar({ onCartClick, onAuthClick }: NavbarProps) {
  const { totalItems } = useCart();
  const { user, signOut } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (searchOpen && searchRef.current) {
      setTimeout(() => searchRef.current?.focus(), 100);
    }
  }, [searchOpen]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 bg-white transition-all duration-300 ${
          isScrolled ? "shadow-[0_1px_0_0_#e5e5e5]" : "border-b border-[#efefef]"
        }`}
      >
        {/* Top bar: logo + search + icons */}
        <div className="max-w-[1400px] mx-auto px-5 sm:px-10 h-[60px] flex items-center justify-between gap-4">

          {/* Brand logo */}
          <Link href="/" className="flex items-center gap-1.5 shrink-0 group">
            <span className="text-[20px] font-black tracking-tighter text-[#111] leading-none uppercase flex flex-col">
              <span>Kanpur Shoes</span>
              <span className="text-[10px] tracking-[0.4em] text-[#999] -mt-0.5">Wala</span>
            </span>
          </Link>

          {/* Desktop search */}
          <div className="hidden md:flex flex-1 max-w-sm mx-8 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#aaa]" />
            <input
              type="text"
              placeholder="Search for products, brands and more..."
              className="ksw-search text-[12px]"
              style={{ paddingLeft: "36px" }}
            />
          </div>

          {/* Desktop right icons */}
          <div className="flex items-center gap-1">
            {/* Mobile search toggle */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="md:hidden p-2.5 rounded-xl text-[#555] hover:bg-[#f7f7f7] hover:text-black transition-all"
            >
              <Search className="w-[18px] h-[18px]" />
            </button>

            {/* Cart */}
            <button
              onClick={onCartClick}
              className="relative p-2.5 rounded-xl text-[#555] hover:bg-[#f7f7f7] hover:text-black transition-all"
              aria-label="Open cart"
            >
              <ShoppingBag className="w-[18px] h-[18px]" strokeWidth={1.75} />
              <AnimatePresence>
                {totalItems > 0 && (
                  <motion.span
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="absolute -top-0.5 -right-0.5 bg-[#111] text-white text-[9px] font-bold w-[16px] h-[16px] flex items-center justify-center rounded-full"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            {/* Wishlist icon (static) */}
            <button className="hidden sm:flex p-2.5 rounded-xl text-[#555] hover:bg-[#f7f7f7] hover:text-black transition-all">
              <Heart className="w-[18px] h-[18px]" strokeWidth={1.75} />
            </button>

            {/* Account */}
            {user ? (
              <button
                onClick={signOut}
                className="hidden sm:flex p-2.5 rounded-xl text-[#555] hover:bg-[#f7f7f7] hover:text-[#e22] transition-all"
                title="Sign out"
              >
                <LogOut className="w-[18px] h-[18px]" strokeWidth={1.75} />
              </button>
            ) : (
              <button
                onClick={onAuthClick}
                className="hidden sm:flex p-2.5 rounded-xl text-[#555] hover:bg-[#f7f7f7] hover:text-black transition-all"
              >
                <User className="w-[18px] h-[18px]" strokeWidth={1.75} />
              </button>
            )}

            {/* Orders link */}
            <Link
              href="/orders"
              className="hidden md:flex items-center gap-1.5 px-4 py-2 ml-1 text-[11px] font-bold uppercase tracking-wider text-[#555] hover:bg-[#f7f7f7] hover:text-black rounded-xl transition-all"
            >
              Orders
            </Link>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2.5 rounded-xl text-[#555] hover:bg-[#f7f7f7] transition-all"
            >
              {mobileOpen ? <X className="w-[18px] h-[18px]" /> : <Menu className="w-[18px] h-[18px]" />}
            </button>
          </div>
        </div>

        {/* Secondary nav: category links */}
        <div className="hidden md:block border-t border-[#efefef]">
          <div className="max-w-[1400px] mx-auto px-10 h-[40px] flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={`text-[12px] font-semibold tracking-wide transition-colors ${
                  link.accent
                    ? "text-red-500 hover:text-red-600"
                    : "text-[#555] hover:text-black"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Mobile search bar */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden border-t border-[#efefef] overflow-hidden"
            >
              <div className="px-5 py-3 relative">
                <Search className="absolute left-9 top-1/2 -translate-y-1/2 w-4 h-4 text-[#aaa]" />
                <input
                  ref={searchRef}
                  type="text"
                  placeholder="Search products..."
                  className="ksw-search"
                  style={{ paddingLeft: "36px" }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Mobile Full-Screen Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed inset-0 z-40 bg-white pt-[100px] px-8 md:hidden flex flex-col"
          >
            <div className="flex flex-col gap-4">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`text-2xl font-black uppercase tracking-tight border-b border-[#efefef] pb-4 ${
                    link.accent ? "text-red-500" : "text-black"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/orders"
                onClick={() => setMobileOpen(false)}
                className="text-2xl font-black uppercase tracking-tight border-b border-[#efefef] pb-4 text-black"
              >
                Orders
              </Link>

              <div className="mt-6">
                {user ? (
                  <button
                    onClick={() => { signOut(); setMobileOpen(false); }}
                    className="w-full py-4 border border-[#e5e5e5] text-black rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-[#f7f7f7] transition-all"
                  >
                    Sign Out
                  </button>
                ) : (
                  <button
                    onClick={() => { onAuthClick(); setMobileOpen(false); }}
                    className="w-full py-4 bg-black text-white rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-zinc-800 transition-all"
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
