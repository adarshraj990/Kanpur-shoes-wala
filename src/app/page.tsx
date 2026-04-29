"use client";

import React, { useState } from "react";
import ProductGallery from "@/components/ProductGallery";
import Navbar from "@/components/Navbar";
import CartDrawer from "@/components/CartDrawer";
import AuthModal from "@/components/AuthModal";
import { motion } from "framer-motion";
import { ArrowRight, Shield, Truck, RefreshCw, Star } from "lucide-react";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
});

export default function Home() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  return (
    <main className="min-h-screen bg-white overflow-x-hidden">
      <Navbar
        onCartClick={() => setIsCartOpen(true)}
        onAuthClick={() => setIsAuthOpen(true)}
      />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />

      {/* ─────────────────────── HERO ─────────────────────── */}
      <section className="relative min-h-[100svh] flex flex-col items-center justify-center pt-20 pb-16 px-6 sm:px-8 overflow-hidden bg-[#F8F8F8]">
        {/* Blobs */}
        <div className="pointer-events-none absolute top-0 right-0 w-72 sm:w-[500px] h-72 sm:h-[500px] bg-[#FF4500]/6 rounded-full blur-[100px]" />
        <div className="pointer-events-none absolute bottom-0 left-0 w-60 sm:w-[400px] h-60 sm:h-[400px] bg-[#1A1A1A]/4 rounded-full blur-[120px]" />

        <div className="relative z-10 w-full max-w-3xl mx-auto flex flex-col items-center text-center gap-6">

          {/* Pill badge */}
          <motion.div {...fadeUp(0)}>
            <span
              className="inline-flex items-center gap-2 px-4 py-1.5 text-[10px] font-black tracking-[0.2em] uppercase text-[#FF4500] border border-[#FF4500]/30 rounded-full bg-[#FF4500]/6"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              <span className="w-1.5 h-1.5 bg-[#FF4500] rounded-full animate-pulse" />
              Kanpur Shoes Wala · D2C Brand
            </span>
          </motion.div>

          {/* H1 */}
          <motion.h1
            {...fadeUp(0.1)}
            className="text-[clamp(3rem,12vw,7rem)] font-black text-[#1A1A1A] tracking-tighter leading-[0.88]"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            PREMIUM
            <br />
            <span className="text-[#FF4500]">DIRECT</span>
            <br />
            TO YOU.
          </motion.h1>

          {/* Sub */}
          <motion.p
            {...fadeUp(0.2)}
            className="text-base sm:text-lg text-[#6B7280] max-w-sm leading-relaxed font-medium"
          >
            Handcrafted in Kanpur. No middlemen.
            <br />
            Premium shoes from{" "}
            <span className="text-[#FF4500] font-bold">₹499</span>.
          </motion.p>

          {/* CTAs */}
          <motion.div
            {...fadeUp(0.3)}
            className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto"
          >
            <a
              href="#gallery"
              className="flex items-center justify-center gap-2 px-8 py-4 bg-[#FF4500] text-white rounded-full text-sm font-black uppercase tracking-wide hover:bg-[#E63E00] hover:shadow-xl hover:shadow-orange-200/70 active:scale-[0.98] transition-all duration-300"
              style={{ fontFamily: "var(--font-montserrat)", minHeight: 52 }}
            >
              Shop Collection
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="#about"
              className="flex items-center justify-center gap-2 px-8 py-4 border-2 border-[#1A1A1A] text-[#1A1A1A] rounded-full text-sm font-black uppercase tracking-wide hover:bg-[#1A1A1A] hover:text-white active:scale-[0.98] transition-all duration-300"
              style={{ fontFamily: "var(--font-montserrat)", minHeight: 52 }}
            >
              Our Story
            </a>
          </motion.div>

          {/* Social proof */}
          <motion.div {...fadeUp(0.4)} className="flex items-center gap-3 pt-2">
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
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-[#FF4500] text-[#FF4500]" />
                ))}
              </div>
              <p className="text-[11px] text-[#6B7280] font-medium mt-0.5">
                500+ happy customers
              </p>
            </div>
          </motion.div>
        </div>

        {/* Scroll cue */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
        >
          <div className="w-px h-10 bg-gradient-to-b from-[#1A1A1A]/25 to-transparent" />
          <span className="text-[9px] font-black uppercase tracking-[0.25em] text-[#1A1A1A]/25">
            Scroll
          </span>
        </motion.div>
      </section>

      {/* ─────────────────────── TRUST STRIP ─────────────────────── */}
      <section className="py-8 sm:py-10 border-y border-[#E5E7EB] bg-white">
        <div className="max-w-4xl mx-auto px-6 sm:px-8">
          <div className="grid grid-cols-3 gap-4">
            {[
              { icon: Truck, label: "Free Shipping", sub: "Orders ₹999+" },
              { icon: Shield, label: "100% Genuine", sub: "Handcrafted" },
              { icon: RefreshCw, label: "Easy Returns", sub: "7-day policy" },
            ].map(({ icon: Icon, label, sub }) => (
              <div
                key={label}
                className="flex flex-col items-center text-center gap-2"
              >
                <div className="w-10 h-10 bg-[#FF4500]/10 rounded-xl flex items-center justify-center">
                  <Icon className="w-5 h-5 text-[#FF4500]" />
                </div>
                <div>
                  <p
                    className="text-[11px] sm:text-xs font-bold text-[#1A1A1A] leading-tight"
                    style={{ fontFamily: "var(--font-montserrat)" }}
                  >
                    {label}
                  </p>
                  <p className="text-[10px] sm:text-[11px] text-[#6B7280]">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────── PRODUCT GALLERY ─────────────────────── */}
      <div id="gallery" className="bg-white">
        <ProductGallery />
      </div>

      {/* ─────────────────────── FOOTER ─────────────────────── */}
      <footer id="about" className="bg-[#1A1A1A] text-white pt-16 pb-10 px-6 sm:px-8 mt-0">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between gap-12 mb-12">

            {/* Brand */}
            <div className="max-w-xs space-y-4">
              <h2
                className="text-lg font-black tracking-tight"
                style={{ fontFamily: "var(--font-montserrat)" }}
              >
                KANPUR SHOES WALA
              </h2>
              <p className="text-sm text-white/50 leading-relaxed">
                Redefining luxury through direct craftsmanship. Born in Kanpur,
                designed for the world.
              </p>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-[#FF4500] text-white text-[9px] font-black uppercase tracking-widest rounded-full">
                  D2C Brand
                </span>
                <span className="px-3 py-1 bg-white/10 text-white/60 text-[9px] font-black uppercase tracking-widest rounded-full">
                  Est. 2024
                </span>
              </div>
            </div>

            {/* Links grid */}
            <div className="grid grid-cols-2 gap-8 sm:gap-12">
              {[
                {
                  heading: "Shop",
                  links: ["All Shoes", "New Arrivals", "Best Sellers", "Slides"],
                },
                {
                  heading: "Help",
                  links: ["My Orders", "Size Guide", "Returns", "Contact"],
                },
              ].map(({ heading, links }) => (
                <div key={heading} className="space-y-4">
                  <h4
                    className="text-[9px] font-black uppercase tracking-[0.2em] text-white/35"
                    style={{ fontFamily: "var(--font-montserrat)" }}
                  >
                    {heading}
                  </h4>
                  <ul className="space-y-2.5">
                    {links.map((item) => (
                      <li key={item}>
                        <a
                          href="#gallery"
                          className="text-sm text-white/55 hover:text-[#FF4500] transition-colors inline min-h-0 min-w-0"
                        >
                          {item}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-3">
            <p className="text-[10px] text-white/25 uppercase tracking-widest">
              © 2026 Kanpur Shoes Wala. All rights reserved.
            </p>
            <p className="text-[10px] text-white/25">Made with ❤️ in Kanpur, UP</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
