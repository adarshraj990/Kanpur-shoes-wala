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
    <main className="min-h-screen bg-white overflow-x-hidden">
      <Navbar
        onCartClick={() => setIsCartOpen(true)}
        onAuthClick={() => setIsAuthOpen(true)}
      />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />

      {/* ═══════════════════════ HERO ═══════════════════════ */}
      <section
        className="relative flex flex-col items-center justify-center text-center bg-[#F8F8F8] px-6 sm:px-8"
        style={{ minHeight: "100vh", paddingTop: "5rem", paddingBottom: "4rem" }}
      >
        {/* Background blobs */}
        <div
          className="pointer-events-none absolute top-0 right-0 rounded-full"
          style={{
            width: "min(500px, 70vw)",
            height: "min(500px, 70vw)",
            background: "rgba(255,69,0,0.06)",
            filter: "blur(100px)",
          }}
        />
        <div
          className="pointer-events-none absolute bottom-0 left-0 rounded-full"
          style={{
            width: "min(400px, 60vw)",
            height: "min(400px, 60vw)",
            background: "rgba(26,26,26,0.04)",
            filter: "blur(120px)",
          }}
        />

        {/* Content — using whileInView so animations ALWAYS fire */}
        <div
          className="relative w-full max-w-2xl mx-auto flex flex-col items-center gap-5"
          style={{ zIndex: 10 }}
        >
          {/* Pill badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.5 }}
          >
            <span
              className="inline-flex items-center gap-2 px-4 py-1.5 border border-[#FF4500]/30 rounded-full bg-[#FF4500]/6 text-[#FF4500]"
              style={{
                fontSize: "10px",
                fontFamily: "var(--font-montserrat)",
                fontWeight: 800,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
              }}
            >
              <span
                className="rounded-full animate-pulse"
                style={{ width: 6, height: 6, background: "#FF4500", display: "inline-block" }}
              />
              Kanpur Shoes Wala · D2C Brand
            </span>
          </motion.div>

          {/* H1 */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.6, delay: 0.08 }}
            style={{
              fontFamily: "var(--font-montserrat)",
              fontWeight: 900,
              letterSpacing: "-0.04em",
              lineHeight: 0.88,
              fontSize: "clamp(3rem, 14vw, 7rem)",
              color: "#1A1A1A",
            }}
          >
            PREMIUM
            <br />
            <span style={{ color: "#FF4500" }}>DIRECT</span>
            <br />
            TO YOU.
          </motion.h1>

          {/* Sub-heading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.5, delay: 0.18 }}
            className="text-base sm:text-lg leading-relaxed font-medium"
            style={{ color: "#6B7280", maxWidth: "28rem" }}
          >
            Handcrafted in Kanpur. No middlemen.
            <br />
            Premium shoes from{" "}
            <span style={{ color: "#FF4500", fontWeight: 700 }}>₹499</span>.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.5, delay: 0.26 }}
            className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto pt-2"
          >
            <a
              href="#gallery"
              className="flex items-center justify-center gap-2 rounded-full font-black uppercase hover:opacity-90 active:scale-95 transition-all"
              style={{
                fontFamily: "var(--font-montserrat)",
                fontSize: "14px",
                letterSpacing: "0.07em",
                background: "#FF4500",
                color: "#fff",
                padding: "14px 32px",
                minHeight: 52,
                boxShadow: "0 8px 24px rgba(255,69,0,0.30)",
              }}
            >
              Shop Collection
              <ArrowRight style={{ width: 16, height: 16 }} />
            </a>
            <a
              href="#about"
              className="flex items-center justify-center rounded-full font-black uppercase transition-all hover:bg-[#1A1A1A] hover:text-white active:scale-95"
              style={{
                fontFamily: "var(--font-montserrat)",
                fontSize: "14px",
                letterSpacing: "0.07em",
                border: "2px solid #1A1A1A",
                color: "#1A1A1A",
                padding: "14px 32px",
                minHeight: 52,
              }}
            >
              Our Story
            </a>
          </motion.div>

          {/* Social Proof */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.5, delay: 0.36 }}
            className="flex items-center gap-3 pt-1"
          >
            <div className="flex" style={{ gap: -8 }}>
              {["FF4500", "1A1A1A", "6B7280", "FF6B35"].map((c, i) => (
                <div
                  key={i}
                  className="rounded-full border-2 border-white"
                  style={{
                    width: 30,
                    height: 30,
                    background: `#${c}`,
                    marginLeft: i > 0 ? -8 : 0,
                  }}
                />
              ))}
            </div>
            <div className="text-left">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} style={{ width: 12, height: 12, fill: "#FF4500", color: "#FF4500" }} />
                ))}
              </div>
              <p style={{ fontSize: 11, color: "#6B7280", fontWeight: 500, marginTop: 2 }}>
                500+ happy customers
              </p>
            </div>
          </motion.div>
        </div>

        {/* Scroll cue */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
          className="absolute flex flex-col items-center gap-1.5 pointer-events-none"
          style={{ bottom: 28, left: "50%", transform: "translateX(-50%)" }}
        >
          <div
            style={{
              width: 1,
              height: 36,
              background: "linear-gradient(to bottom, rgba(26,26,26,0.25), transparent)",
            }}
          />
          <span
            style={{
              fontSize: 9,
              fontWeight: 800,
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "rgba(26,26,26,0.25)",
            }}
          >
            Scroll
          </span>
        </motion.div>
      </section>

      {/* ═══════════════════════ TRUST STRIP ═══════════════════════ */}
      <section
        className="bg-white"
        style={{ borderTop: "1px solid #E5E7EB", borderBottom: "1px solid #E5E7EB", padding: "32px 24px" }}
      >
        <div className="max-w-2xl mx-auto grid grid-cols-3 gap-4">
          {[
            { icon: Truck, label: "Free Shipping", sub: "Orders ₹999+" },
            { icon: Shield, label: "100% Genuine", sub: "Handcrafted" },
            { icon: RefreshCw, label: "Easy Returns", sub: "7-day policy" },
          ].map(({ icon: Icon, label, sub }) => (
            <div key={label} className="flex flex-col items-center text-center gap-2">
              <div
                className="flex items-center justify-center rounded-xl"
                style={{ width: 40, height: 40, background: "rgba(255,69,0,0.1)" }}
              >
                <Icon style={{ width: 20, height: 20, color: "#FF4500" }} />
              </div>
              <div>
                <p
                  style={{
                    fontFamily: "var(--font-montserrat)",
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#1A1A1A",
                    lineHeight: 1.3,
                  }}
                >
                  {label}
                </p>
                <p style={{ fontSize: 10, color: "#6B7280", marginTop: 1 }}>{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════ PRODUCTS ═══════════════════════ */}
      <div id="gallery" className="bg-white">
        <ProductGallery />
      </div>

      {/* ═══════════════════════ FOOTER ═══════════════════════ */}
      <footer
        id="about"
        style={{ background: "#1A1A1A", color: "#fff", padding: "64px 24px 40px" }}
      >
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between gap-12" style={{ marginBottom: 48 }}>
            {/* Brand */}
            <div style={{ maxWidth: 280 }}>
              <h2
                style={{
                  fontFamily: "var(--font-montserrat)",
                  fontWeight: 900,
                  fontSize: 16,
                  letterSpacing: "-0.02em",
                  marginBottom: 12,
                }}
              >
                KANPUR SHOES WALA
              </h2>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.7, marginBottom: 16 }}>
                Redefining luxury through direct craftsmanship. Born in Kanpur, designed for the world.
              </p>
              <div className="flex items-center gap-2">
                <span
                  style={{
                    background: "#FF4500",
                    color: "#fff",
                    fontSize: 9,
                    fontWeight: 800,
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    padding: "4px 10px",
                    borderRadius: 999,
                  }}
                >
                  D2C Brand
                </span>
                <span
                  style={{
                    background: "rgba(255,255,255,0.1)",
                    color: "rgba(255,255,255,0.6)",
                    fontSize: 9,
                    fontWeight: 800,
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    padding: "4px 10px",
                    borderRadius: 999,
                  }}
                >
                  Est. 2024
                </span>
              </div>
            </div>

            {/* Links */}
            <div className="grid grid-cols-2 gap-8">
              {[
                { heading: "Shop", links: ["All Shoes", "New Arrivals", "Best Sellers", "Slides"] },
                { heading: "Help", links: ["My Orders", "Size Guide", "Returns", "Contact"] },
              ].map(({ heading, links }) => (
                <div key={heading}>
                  <h4
                    style={{
                      fontFamily: "var(--font-montserrat)",
                      fontSize: 9,
                      fontWeight: 800,
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      color: "rgba(255,255,255,0.3)",
                      marginBottom: 14,
                    }}
                  >
                    {heading}
                  </h4>
                  <ul style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {links.map((item) => (
                      <li key={item}>
                        <a
                          href="#gallery"
                          style={{
                            fontSize: 13,
                            color: "rgba(255,255,255,0.55)",
                            textDecoration: "none",
                            display: "inline",
                          }}
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

          {/* Bottom */}
          <div
            className="flex flex-col sm:flex-row justify-between items-center gap-3"
            style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 28 }}
          >
            <p style={{ fontSize: 10, color: "rgba(255,255,255,0.2)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              © 2026 Kanpur Shoes Wala. All rights reserved.
            </p>
            <p style={{ fontSize: 10, color: "rgba(255,255,255,0.2)" }}>Made with ❤️ in Kanpur, UP</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
