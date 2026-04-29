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
      <section style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        minHeight: "100vh",
        paddingTop: "5rem",
        paddingBottom: "4rem",
        paddingLeft: "1.5rem",
        paddingRight: "1.5rem",
        background: "#F8F8F8",
        overflow: "hidden",
      }}>
        {/* Background blobs */}
        <div style={{
          position: "absolute", top: 0, right: 0, pointerEvents: "none",
          width: "min(500px,70vw)", height: "min(500px,70vw)",
          background: "rgba(255,69,0,0.06)", borderRadius: "50%", filter: "blur(100px)",
        }} />
        <div style={{
          position: "absolute", bottom: 0, left: 0, pointerEvents: "none",
          width: "min(400px,60vw)", height: "min(400px,60vw)",
          background: "rgba(26,26,26,0.04)", borderRadius: "50%", filter: "blur(120px)",
        }} />

        {/* Hero Content — NO animations, always visible */}
        <div style={{
          position: "relative", zIndex: 10,
          display: "flex", flexDirection: "column", alignItems: "center",
          gap: "1.25rem", width: "100%", maxWidth: "42rem", margin: "0 auto",
        }}>

          {/* Badge */}
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "6px 16px",
            border: "1px solid rgba(255,69,0,0.3)",
            borderRadius: 999,
            background: "rgba(255,69,0,0.06)",
            color: "#FF4500",
            fontSize: 10,
            fontFamily: "var(--font-montserrat)",
            fontWeight: 800,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
          }}>
            <span style={{
              width: 6, height: 6, background: "#FF4500",
              borderRadius: "50%", display: "inline-block",
            }} />
            Kanpur Shoes Wala · D2C Brand
          </span>

          {/* H1 */}
          <h1 style={{
            fontFamily: "var(--font-montserrat)",
            fontWeight: 900,
            letterSpacing: "-0.04em",
            lineHeight: 0.9,
            fontSize: "clamp(3.2rem, 14vw, 7rem)",
            color: "#1A1A1A",
            margin: 0,
          }}>
            PREMIUM<br />
            <span style={{ color: "#FF4500" }}>DIRECT</span><br />
            TO YOU.
          </h1>

          {/* Sub */}
          <p style={{
            fontSize: "clamp(0.95rem, 3vw, 1.1rem)",
            color: "#6B7280",
            lineHeight: 1.7,
            fontWeight: 500,
            maxWidth: "26rem",
            margin: 0,
          }}>
            Handcrafted in Kanpur. No middlemen.<br />
            Premium shoes from{" "}
            <span style={{ color: "#FF4500", fontWeight: 700 }}>₹499</span>.
          </p>

          {/* CTAs */}
          <div style={{
            display: "flex", flexDirection: "column", gap: 12,
            width: "100%", maxWidth: 340, paddingTop: 8,
          }}>
            <a href="#gallery" style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              background: "#FF4500", color: "#fff",
              borderRadius: 999, border: "none",
              padding: "15px 32px", minHeight: 52,
              fontFamily: "var(--font-montserrat)",
              fontSize: 13, fontWeight: 800,
              letterSpacing: "0.08em", textTransform: "uppercase",
              textDecoration: "none",
              boxShadow: "0 8px 24px rgba(255,69,0,0.35)",
              cursor: "pointer",
            }}>
              Shop Collection
              <ArrowRight style={{ width: 15, height: 15, flexShrink: 0 }} />
            </a>
            <a href="#about" style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              background: "transparent", color: "#1A1A1A",
              borderRadius: 999, border: "2px solid #1A1A1A",
              padding: "13px 32px", minHeight: 52,
              fontFamily: "var(--font-montserrat)",
              fontSize: 13, fontWeight: 800,
              letterSpacing: "0.08em", textTransform: "uppercase",
              textDecoration: "none", cursor: "pointer",
            }}>
              Our Story
            </a>
          </div>

          {/* Social proof */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, paddingTop: 4 }}>
            <div style={{ display: "flex" }}>
              {["FF4500", "1A1A1A", "6B7280", "FF6B35"].map((c, i) => (
                <div key={i} style={{
                  width: 28, height: 28,
                  background: `#${c}`,
                  borderRadius: "50%",
                  border: "2px solid #F8F8F8",
                  marginLeft: i > 0 ? -8 : 0,
                }} />
              ))}
            </div>
            <div style={{ textAlign: "left" }}>
              <div style={{ display: "flex", gap: 2 }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} style={{ width: 11, height: 11, fill: "#FF4500", color: "#FF4500" }} />
                ))}
              </div>
              <p style={{ fontSize: 10, color: "#6B7280", fontWeight: 500, marginTop: 2 }}>
                500+ happy customers
              </p>
            </div>
          </div>
        </div>

        {/* Scroll cue */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
          style={{
            position: "absolute", bottom: 24,
            left: "50%", transform: "translateX(-50%)",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
            pointerEvents: "none",
          }}
        >
          <div style={{
            width: 1, height: 32,
            background: "linear-gradient(to bottom, rgba(26,26,26,0.2), transparent)",
          }} />
          <span style={{
            fontSize: 8, fontWeight: 800,
            letterSpacing: "0.25em", textTransform: "uppercase",
            color: "rgba(26,26,26,0.2)",
          }}>Scroll</span>
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
