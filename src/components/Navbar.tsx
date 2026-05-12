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
              className="md:hidden p-2.5 rounded-xl text-[#111] hover:bg-[#f7f7f7] active:scale-95 transition-all"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
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
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-40 bg-white md:hidden flex flex-col"
          >
            <div className="pt-24 px-8 flex flex-col h-full">
              <div className="flex flex-col gap-1">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`text-[2.5rem] font-black uppercase tracking-tighter transition-all active:scale-95 ${
                      link.accent ? "text-red-500" : "text-black"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              <div className="mt-12 flex flex-col gap-6">
                <Link
                  href="/orders"
                  onClick={() => setMobileOpen(false)}
                  className="text-lg font-bold uppercase tracking-widest text-[#999] flex items-center gap-3"
                >
                  My Orders <ChevronRight className="w-4 h-4" />
                </Link>

                <div className="mt-auto pb-12">
                  {user ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-4 bg-[#f7f7f7] rounded-2xl">
                        <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white font-bold">
                          {user.email?.[0].toUpperCase()}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold text-[#999] uppercase">Logged in as</span>
                          <span className="text-sm font-bold text-black truncate max-w-[200px]">{user.email}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => { signOut(); setMobileOpen(false); }}
                        className="w-full py-4 border-2 border-[#111] text-black rounded-2xl font-black text-xs uppercase tracking-[0.2em] active:scale-95 transition-all"
                      >
                        Sign Out
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => { onAuthClick(); setMobileOpen(false); }}
                      className="w-full py-5 bg-black text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] active:scale-95 transition-all shadow-xl shadow-black/10"
                    >
                      Account Login
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
