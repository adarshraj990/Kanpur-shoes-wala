"use client";

import React, { useState } from "react";
import ProductGallery from "@/components/ProductGallery";
import Navbar from "@/components/Navbar";
import CartDrawer from "@/components/CartDrawer";
import AuthModal from "@/components/AuthModal";
import { motion } from "framer-motion";
import { ArrowRight, Shield, Truck, RefreshCw, Star } from "lucide-react";

export default function Home() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  return (
    <main className="min-h-screen bg-white">
      <Navbar
        onCartClick={() => setIsCartOpen(true)}
        onAuthClick={() => setIsAuthOpen(true)}
      />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />

      {/* ─── HERO SECTION ─── */}
      <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden bg-[#F8F8F8] pt-20">
        {/* Decorative blobs */}
        <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-[#FF4500]/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#1A1A1A]/3 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 w-full flex flex-col items-center text-center relative z-10 py-16">
          
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 mb-8 text-[11px] font-bold tracking-[0.2em] uppercase text-[#FF4500] border border-[#FF4500]/30 rounded-full bg-[#FF4500]/5">
              <span className="w-1.5 h-1.5 bg-[#FF4500] rounded-full animate-pulse" />
              Kanpur Shoes Wala · Direct to Consumer
            </span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl sm:text-7xl lg:text-8xl font-black text-[#1A1A1A] tracking-tighter leading-[0.9] mb-6"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            PREMIUM
            <br />
            <span className="text-[#FF4500]">DIRECT</span>
            <br />
            TO YOU.
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-4 text-base sm:text-lg text-[#6B7280] max-w-md mx-auto font-medium leading-relaxed"
          >
            Handcrafted in Kanpur. No middlemen. Premium quality starting at{" "}
            <span className="text-[#FF4500] font-bold">₹499</span>.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-sm sm:max-w-none"
          >
            <a
              href="#gallery"
              className="btn-brand w-full sm:w-auto px-8 py-4 rounded-full text-sm font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-orange-200/60"
              style={{ fontFamily: "var(--font-montserrat)", minHeight: '52px' }}
            >
              Shop Collection
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="#"
              className="w-full sm:w-auto px-8 py-4 border-2 border-[#1A1A1A] text-[#1A1A1A] rounded-full text-sm font-black uppercase tracking-wider hover:bg-[#1A1A1A] hover:text-white transition-all duration-300 flex items-center justify-center"
              style={{ fontFamily: "var(--font-montserrat)", minHeight: '52px' }}
            >
              Our Story
            </a>
          </motion.div>

          {/* Social Proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-12 flex items-center gap-3"
          >
            <div className="flex -space-x-2">
              {["FF4500", "1A1A1A", "6B7280", "FF6B35"].map((c, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full border-2 border-white"
                  style={{ backgroundColor: `#${c}` }}
                />
              ))}
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-[#FF4500] text-[#FF4500]" />
                ))}
              </div>
              <p className="text-xs text-[#6B7280] font-medium">500+ happy customers</p>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <div className="w-px h-12 bg-gradient-to-b from-[#1A1A1A]/30 to-transparent" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#1A1A1A]/30">Scroll</span>
        </motion.div>
      </section>

      {/* ─── TRUST BADGES ─── */}
      <section className="py-10 border-y border-[#E5E7EB] bg-white overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-3 sm:grid-cols-3 gap-4 sm:gap-8">
            {[
              { icon: Truck, label: "Free Shipping", sub: "Orders above ₹999" },
              { icon: Shield, label: "100% Genuine", sub: "Handcrafted quality" },
              { icon: RefreshCw, label: "Easy Returns", sub: "7-day policy" },
            ].map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#FF4500]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-[#FF4500]" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-bold text-[#1A1A1A]" style={{ fontFamily: "var(--font-montserrat)" }}>
                    {label}
                  </p>
                  <p className="text-[10px] sm:text-xs text-[#6B7280]">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PRODUCT GALLERY ─── */}
      <div id="gallery">
        <ProductGallery />
      </div>

      {/* ─── FOOTER ─── */}
      <footer className="py-16 sm:py-20 border-t border-[#E5E7EB] bg-[#1A1A1A] text-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12">
          <div className="flex flex-col md:flex-row justify-between items-start gap-10">
            
            {/* Brand */}
            <div className="space-y-4 max-w-xs">
              <h2
                className="text-xl font-black tracking-tighter text-white"
                style={{ fontFamily: "var(--font-montserrat)" }}
              >
                KANPUR SHOES WALA
              </h2>
              <p className="text-sm text-white/50 leading-relaxed">
                Redefining luxury through direct craftsmanship. Born in Kanpur, designed for the world.
              </p>
              <div className="flex items-center gap-2 pt-2">
                <span className="px-3 py-1 bg-[#FF4500] text-white text-[10px] font-bold uppercase tracking-widest rounded-full">
                  D2C Brand
                </span>
                <span className="px-3 py-1 bg-white/10 text-white/70 text-[10px] font-bold uppercase tracking-widest rounded-full">
                  Est. 2024
                </span>
              </div>
            </div>

            {/* Links */}
            <div className="grid grid-cols-2 gap-10">
              <div className="space-y-4">
                <h4
                  className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40"
                  style={{ fontFamily: "var(--font-montserrat)" }}
                >
                  Shop
                </h4>
                <ul className="space-y-3 text-sm text-white/60">
                  {["All Shoes", "New Arrivals", "Best Sellers", "Slides & Sandals"].map((item) => (
                    <li key={item}>
                      <a href="#gallery" className="hover:text-[#FF4500] transition-colors inline min-h-0 min-w-0">
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-4">
                <h4
                  className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40"
                  style={{ fontFamily: "var(--font-montserrat)" }}
                >
                  Help
                </h4>
                <ul className="space-y-3 text-sm text-white/60">
                  {["My Orders", "Size Guide", "Returns", "Contact Us"].map((item) => (
                    <li key={item}>
                      <a href="#" className="hover:text-[#FF4500] transition-colors inline min-h-0 min-w-0">
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-white/30">© 2026 KANPUR SHOES WALA. ALL RIGHTS RESERVED.</p>
            <p className="text-xs text-white/30">Made with ❤️ in Kanpur, UP</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
