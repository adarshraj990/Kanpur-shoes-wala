"use client";

import React, { useState } from "react";
import ProductGallery from "@/components/ProductGallery";
import Navbar from "@/components/Navbar";
import CartDrawer from "@/components/CartDrawer";
import AuthModal from "@/components/AuthModal";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Truck, RefreshCcw, Star, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const CATEGORY_PREVIEWS = [
  { label: "Chelsea", img: "https://images.unsplash.com/photo-1638247025967-b4e38f787b76?auto=format&fit=crop&q=80&w=400" },
  { label: "Sneakers", img: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80&w=400" },
  { label: "Loafers", img: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&q=80&w=400" },
  { label: "Formals", img: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&q=80&w=400" },
  { label: "Sports", img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=400" },
];

export default function Home() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  return (
    <main className="min-h-screen bg-white text-[#111] font-inter selection:bg-black selection:text-white overflow-x-hidden">
      <Navbar onCartClick={() => setIsCartOpen(true)} onAuthClick={() => setIsAuthOpen(true)} />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />

      {/* ── HERO ── */}
      <section className="pt-[100px] md:pt-[116px]">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-10 py-8 md:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center min-h-[480px]">

            {/* Left: Text */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col gap-7 z-10"
            >
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#999]">New Collection</span>
              <h1 className="text-[3.5rem] sm:text-[5rem] lg:text-[5.5rem] font-black leading-[0.88] tracking-tight text-[#111]">
                Step Into<br />
                <span className="text-[#111]">The Future</span>
              </h1>
              <p className="text-[15px] text-[#666] max-w-sm leading-relaxed font-medium">
                Discover the latest styles and iconic sneakers. Handcrafted in Kanpur, delivered across India.
              </p>
              <div className="flex items-center gap-4 pt-2">
                <a
                  href="#gallery"
                  className="btn-pill btn-pill-dark"
                >
                  Shop Now
                </a>
                <div className="flex items-center gap-2">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 star-filled" />)}
                  </div>
                  <span className="text-[11px] text-[#999] font-medium">10k+ Happy Customers</span>
                </div>
              </div>
            </motion.div>

            {/* Right: Hero image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="relative h-[380px] md:h-[500px] rounded-[24px] overflow-hidden bg-[#f7f7f7]"
            >
              <Image
                src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1470&auto=format&fit=crop"
                alt="Premium Footwear"
                fill
                className="object-cover"
                priority
              />
              {/* Floating badge */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
                className="absolute bottom-6 left-6 bg-white rounded-2xl px-5 py-4 shadow-lg flex flex-col gap-1"
              >
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#999]">Kanpur's Finest</span>
                <span className="text-[15px] font-black text-black">Genuine Leather</span>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── VALUE STRIP ── */}
      <section className="border-y border-[#efefef] bg-white">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-10 py-5 grid grid-cols-2 md:grid-cols-4 gap-0 divide-x divide-[#efefef]">
          {[
            { icon: Truck, label: "Free Delivery", sub: "On orders over ₹500" },
            { icon: ShieldCheck, label: "Secure Payment", sub: "100% secured checkout" },
            { icon: RefreshCcw, label: "Easy Returns", sub: "30-day return policy" },
            { icon: "24h", label: "24/7 Support", sub: "Dedicated support" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 px-6 py-2 first:pl-0 last:pr-0">
              <div className="w-8 h-8 rounded-lg bg-[#f7f7f7] flex items-center justify-center shrink-0">
                {typeof item.icon === "string" ? (
                  <span className="text-[10px] font-black text-[#111]">{item.icon}</span>
                ) : (
                  <item.icon className="w-4 h-4 text-[#111]" strokeWidth={1.75} />
                )}
              </div>
              <div className="hidden sm:block">
                <p className="text-[12px] font-bold text-[#111] leading-tight">{item.label}</p>
                <p className="text-[10px] text-[#999]">{item.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── POPULAR CATEGORIES ── */}
      <section className="py-16">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-10">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-[22px] font-black tracking-tight text-black">Popular Categories</h2>
            <a href="#gallery" className="text-[12px] font-bold text-[#555] hover:text-black flex items-center gap-1 transition-colors">
              View all <ChevronRight className="w-3.5 h-3.5" />
            </a>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
            {CATEGORY_PREVIEWS.map((cat) => (
              <a key={cat.label} href="#gallery" className="flex flex-col items-center gap-3 group">
                <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-[#f7f7f7]">
                  <Image
                    src={cat.img}
                    alt={cat.label}
                    fill
                    sizes="20vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <span className="text-[12px] font-bold text-[#333] group-hover:text-black transition-colors">{cat.label}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRODUCT GALLERY ── */}
      <section id="gallery" className="pb-24">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-10">
          <div className="flex justify-between items-end mb-10">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#999] block mb-2">Best Selling</span>
              <h2 className="text-[28px] font-black tracking-tight text-black">The Collection</h2>
            </div>
            <a href="#gallery" className="text-[12px] font-bold text-[#555] hover:text-black flex items-center gap-1 transition-colors">
              View all <ChevronRight className="w-3.5 h-3.5" />
            </a>
          </div>
          <ProductGallery />
        </div>
      </section>

      {/* ── PROMO BANNER ── */}
      <section className="pb-24">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Banner 1 */}
            <div className="relative rounded-[20px] overflow-hidden bg-[#f0f0f0] h-[200px] flex flex-col justify-end p-8">
              <div className="absolute inset-0">
                <Image
                  src="https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&q=80&w=800"
                  alt="Sale"
                  fill
                  className="object-cover opacity-40"
                />
              </div>
              <div className="relative z-10">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#555]">Limited Time Offer</span>
                <h3 className="text-[28px] font-black text-black leading-tight mt-1">Get 20% Off</h3>
                <p className="text-[12px] text-[#666] mt-0.5">On selected items</p>
              </div>
              <a href="#gallery" className="absolute bottom-6 right-6 btn-pill btn-pill-dark text-[10px] py-2 px-5">
                Shop Now
              </a>
            </div>

            {/* Banner 2 */}
            <div className="relative rounded-[20px] overflow-hidden bg-[#111] h-[200px] flex flex-col justify-end p-8">
              <div className="absolute inset-0">
                <Image
                  src="https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80&w=800"
                  alt="New Arrivals"
                  fill
                  className="object-cover opacity-50"
                />
              </div>
              <div className="relative z-10">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60">New Arrivals</span>
                <h3 className="text-[28px] font-black text-white leading-tight mt-1">Fresh Styles<br />Just Dropped</h3>
              </div>
              <a href="#gallery" className="absolute bottom-6 right-6 btn-pill bg-white text-black text-[10px] py-2 px-5 hover:bg-gray-100 transition-colors">
                Explore Now
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-[#efefef] bg-white pt-14 pb-8">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

            {/* Brand */}
            <div className="lg:col-span-1">
              <Link href="/" className="flex items-center gap-1.5 mb-4">
                <span className="text-[20px] font-black tracking-tighter text-[#111] leading-none uppercase flex flex-col">
                  <span>Kanpur Shoes</span>
                  <span className="text-[10px] tracking-[0.4em] text-[#999] -mt-0.5">Wala</span>
                </span>
              </Link>
              <p className="text-[13px] text-[#777] leading-relaxed max-w-[220px]">
                Your destination for premium sneakers, apparel, and accessories. Fully curated, perfectly fitted.
              </p>
              {/* Social links */}
              <div className="flex gap-3 mt-5">
                {["tw", "ig", "fb", "yt"].map((s) => (
                  <a
                    key={s}
                    href="#"
                    className="w-8 h-8 rounded-lg bg-[#f7f7f7] hover:bg-[#111] flex items-center justify-center transition-all group"
                  >
                    <span className="text-[9px] font-black uppercase text-[#999] group-hover:text-white">{s}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Shop */}
            <div>
              <h4 className="text-[11px] font-black uppercase tracking-[0.18em] text-[#111] mb-4">Shop</h4>
              <ul className="space-y-3">
                {["Chelsea", "Sneakers", "Loafers", "Formals", "Sports", "Sale"].map((item) => (
                  <li key={item}>
                    <a href="#gallery" className="text-[13px] text-[#777] hover:text-black transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-[11px] font-black uppercase tracking-[0.18em] text-[#111] mb-4">Company</h4>
              <ul className="space-y-3">
                <li><Link href="/about" className="text-[13px] text-[#777] hover:text-black transition-colors">About us</Link></li>
                <li><Link href="#" className="text-[13px] text-[#777] hover:text-black transition-colors">Stores</Link></li>
                <li><Link href="#" className="text-[13px] text-[#777] hover:text-black transition-colors">News</Link></li>
                <li><Link href="#" className="text-[13px] text-[#777] hover:text-black transition-colors">Careers</Link></li>
                <li><Link href="#" className="text-[13px] text-[#777] hover:text-black transition-colors">Sustainability</Link></li>
              </ul>
            </div>

            {/* Support + Contacts */}
            <div>
              <h4 className="text-[11px] font-black uppercase tracking-[0.18em] text-[#111] mb-4">Support</h4>
              <ul className="space-y-3 mb-6">
                <li><Link href="#" className="text-[13px] text-[#777] hover:text-black transition-colors">Help</Link></li>
                <li><Link href="/shipping-policy" className="text-[13px] text-[#777] hover:text-black transition-colors">Delivery</Link></li>
                <li><Link href="/return-policy" className="text-[13px] text-[#777] hover:text-black transition-colors">Returns</Link></li>
                <li><Link href="#" className="text-[13px] text-[#777] hover:text-black transition-colors">Size Guide</Link></li>
                <li><Link href="#" className="text-[13px] text-[#777] hover:text-black transition-colors">Contact us</Link></li>
              </ul>
              <div className="space-y-1.5">
                <p className="text-[11px] font-bold text-[#111]">+91 9876 543 210</p>
                <p className="text-[12px] text-[#777]">hello@ksw.in</p>
                <p className="text-[12px] text-[#777]">123 Main St, Kanpur, UP 208001</p>
              </div>
            </div>
          </div>

          <div className="ksw-divider mb-6" />

          <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
            <p className="text-[11px] text-[#aaa] font-medium">© 2026 Kanpur Shoes Wala. All rights reserved.</p>
            <div className="flex gap-5">
              <Link href="/privacy-policy" className="text-[11px] text-[#aaa] hover:text-black transition-colors">Privacy Policy</Link>
              <Link href="/terms-and-conditions" className="text-[11px] text-[#aaa] hover:text-black transition-colors">Terms & Conditions</Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
