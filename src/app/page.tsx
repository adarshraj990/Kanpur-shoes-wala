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
    <main className="min-h-screen bg-[#F9FAFB] overflow-x-hidden">
      <Navbar
        onCartClick={() => setIsCartOpen(true)}
        onAuthClick={() => setIsAuthOpen(true)}
      />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />

      {/* ─────────────────────── LUXURY HERO ─────────────────────── */}
      <section style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        minHeight: "100vh",
        paddingTop: "6rem",
        paddingBottom: "6rem",
        paddingLeft: "1.5rem",
        paddingRight: "1.5rem",
        background: "#F9FAFB",
        overflow: "hidden",
      }}>
        {/* Background Sophistication */}
        <div style={{
          position: "absolute", top: 0, right: 0, pointerEvents: "none",
          width: "min(600px,80vw)", height: "min(600px,80vw)",
          background: "rgba(255,79,0,0.05)", borderRadius: "50%", filter: "blur(120px)",
        }} />
        <div style={{
          position: "absolute", bottom: 0, left: 0, pointerEvents: "none",
          width: "min(500px,70vw)", height: "min(500px,70vw)",
          background: "rgba(18,18,18,0.03)", borderRadius: "50%", filter: "blur(150px)",
        }} />

        <div style={{
          position: "relative", zIndex: 10,
          display: "flex", flexDirection: "column", alignItems: "center",
          gap: "2rem", width: "100%", maxWidth: "48rem", margin: "0 auto",
        }}>

          {/* Badge */}
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "8px 20px",
            border: "1px solid rgba(255,79,0,0.2)",
            borderRadius: 999,
            background: "rgba(255,79,0,0.04)",
            color: "#FF4F00",
            fontSize: 11,
            fontFamily: "var(--font-montserrat)",
            fontWeight: 900,
            letterSpacing: "0.25em",
            textTransform: "uppercase",
          }}>
            <span style={{
              width: 6, height: 6, background: "#FF4F00",
              borderRadius: "50%", display: "inline-block",
            }} />
            Kanpur Shoes Wala · Elite Series
          </span>

          {/* H1 - High Impact Typography */}
          <h1 style={{
            fontFamily: "var(--font-montserrat)",
            fontWeight: 900,
            letterSpacing: "-0.05em",
            lineHeight: 0.85,
            fontSize: "clamp(3.5rem, 15vw, 8.5rem)",
            color: "#121212",
            margin: 0,
          }}>
            PREMIUM<br />
            <span style={{ color: "#FF4F00" }}>ELITE</span><br />
            SERIES.
          </h1>

          {/* Sub Headline - Sophisticated Line Height */}
          <p style={{
            fontSize: "clamp(1rem, 3.5vw, 1.25rem)",
            color: "#121212",
            opacity: 0.6,
            lineHeight: 1.8,
            fontWeight: 500,
            maxWidth: "32rem",
            margin: 0,
          }}>
            Handcrafted luxury direct from the heart of Kanpur. <br />
            Eliminating the middleman to bring you <br />
            artisanal quality from <span style={{ color: "#FF4F00", fontWeight: 800 }}>₹499</span>.
          </p>

          {/* CTAs - touch-friendly 48px+ */}
          <div style={{
            display: "flex", flexDirection: "column", gap: 16,
            width: "100%", maxWidth: 380, paddingTop: 16,
          }}>
            <a href="#gallery" style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 12,
              background: "#FF4F00", color: "#fff",
              borderRadius: 24, border: "none",
              padding: "18px 40px", minHeight: 60,
              fontFamily: "var(--font-montserrat)",
              fontSize: 14, fontWeight: 900,
              letterSpacing: "0.1em", textTransform: "uppercase",
              textDecoration: "none",
              boxShadow: "0 12px 32px rgba(255,79,0,0.3)",
              cursor: "pointer",
            }}>
              Discover Collection
              <ArrowRight style={{ width: 18, height: 18, flexShrink: 0 }} />
            </a>
            <a href="#about" style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              background: "transparent", color: "#121212",
              borderRadius: 24, border: "2.5px solid #121212",
              padding: "16px 40px", minHeight: 60,
              fontFamily: "var(--font-montserrat)",
              fontSize: 14, fontWeight: 900,
              letterSpacing: "0.1em", textTransform: "uppercase",
              textDecoration: "none", cursor: "pointer",
            }}>
              Our Legacy
            </a>
          </div>

          {/* Social proof */}
          <div style={{ display: "flex", alignItems: "center", gap: 16, paddingTop: 12 }}>
            <div style={{ display: "flex" }}>
              {["FF4F00", "121212", "6B7280", "E5E7EB"].map((c, i) => (
                <div key={i} style={{
                  width: 36, height: 36,
                  background: `#${c}`,
                  borderRadius: "50%",
                  border: "3px solid #F9FAFB",
                  marginLeft: i > 0 ? -12 : 0,
                  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                }} />
              ))}
            </div>
            <div style={{ textAlign: "left" }}>
              <div style={{ display: "flex", gap: 3 }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} style={{ width: 14, height: 14, fill: "#FF4F00", color: "#FF4F00" }} />
                ))}
              </div>
              <p style={{ fontSize: 12, color: "#121212", opacity: 0.5, fontWeight: 600, marginTop: 4 }}>
                1,200+ elite members
              </p>
            </div>
          </div>
        </div>

        {/* Scroll cue */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
          style={{
            position: "absolute", bottom: 32,
            left: "50%", transform: "translateX(-50%)",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
            pointerEvents: "none",
          }}
        >
          <div style={{
            width: 1, height: 48,
            background: "linear-gradient(to bottom, rgba(18,18,18,0.2), transparent)",
          }} />
          <span style={{
            fontSize: 10, fontWeight: 900,
            letterSpacing: "0.3em", textTransform: "uppercase",
            color: "rgba(18,18,18,0.2)",
          }}>Explore</span>
        </motion.div>
      </section>

      {/* ─────────────────────── TRUST STRIP ─────────────────────── */}
      <section style={{ 
        background: "#fff", 
        borderTop: "1px solid #E5E7EB", 
        borderBottom: "1px solid #E5E7EB", 
        padding: "48px 24px" 
      }}>
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-8">
          {[
            { icon: Truck, label: "Global Shipping", sub: "Priority delivery" },
            { icon: Shield, label: "Authentic", sub: "Handcrafted cert" },
            { icon: RefreshCw, label: "Concierge", sub: "Easy exchange" },
          ].map(({ icon: Icon, label, sub }) => (
            <div key={label} className="flex flex-col items-center text-center gap-4">
              <div style={{ 
                width: 56, height: 56, background: "rgba(255,79,0,0.08)", 
                borderRadius: 20, display: "flex", alignItems: "center", 
                justifyContent: "center" 
              }}>
                <Icon style={{ width: 24, height: 24, color: "#FF4F00" }} />
              </div>
              <div>
                <p style={{ 
                  fontFamily: "var(--font-montserrat)", fontSize: 13, 
                  fontWeight: 900, color: "#121212", textTransform: "uppercase",
                  letterSpacing: "0.05em"
                }}>{label}</p>
                <p style={{ fontSize: 11, color: "#121212", opacity: 0.4, marginTop: 4 }}>{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─────────────────────── PRODUCT GALLERY ─────────────────────── */}
      <div id="gallery" className="bg-[#F9FAFB]">
        <ProductGallery />
      </div>

      {/* ─────────────────────── FOOTER ─────────────────────── */}
      <footer id="about" style={{ background: "#121212", color: "#fff", padding: "80px 24px 48px" }}>
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col lg:flex-row justify-between gap-16" style={{ marginBottom: 64 }}>
            <div style={{ maxWidth: 320 }}>
              <h2 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 900, fontSize: 20, letterSpacing: "-0.03em", marginBottom: 16 }}>
                KANPUR<span style={{ color: "#FF4F00" }}>.</span>SHOES
              </h2>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", lineHeight: 1.8, marginBottom: 24 }}>
                The intersection of industrial heritage and contemporary luxury. Every pair tells a story of 100 years of Kanpur leather craftsmanship.
              </p>
              <div className="flex items-center gap-3">
                <span style={{ background: "#FF4F00", color: "#fff", fontSize: 10, fontWeight: 900, letterSpacing: "0.2em", textTransform: "uppercase", padding: "6px 14px", borderRadius: 999 }}>Elite Brand</span>
                <span style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.5)", fontSize: 10, fontWeight: 900, letterSpacing: "0.2em", textTransform: "uppercase", padding: "6px 14px", borderRadius: 999 }}>Since 2024</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-12 sm:gap-20">
              {[
                { heading: "Archive", links: ["All Shoes", "ELITE Series", "Collaborations", "Archive"] },
                { heading: "Support", links: ["Concierge", "Size Guide", "Exchanges", "Atelier"] },
              ].map(({ heading, links }) => (
                <div key={heading}>
                  <h4 style={{ fontFamily: "var(--font-montserrat)", fontSize: 10, fontWeight: 900, letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", marginBottom: 20 }}>{heading}</h4>
                  <ul style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {links.map((item) => (
                      <li key={item}><a href="#gallery" style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", textDecoration: "none", transition: "color 0.3s" }} className="hover:text-[#FF4F00]">{item}</a></li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4" style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 40 }}>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.15)", textTransform: "uppercase", letterSpacing: "0.2em" }}>© 2026 KANPUR SHOES WALA. ELITE HERITAGE.</p>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.15)" }}>Crafted in Kanpur Atelier</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
