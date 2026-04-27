/* MASTER_LOG - APRIL 26, 2026 
- Project Status: D2C Startup Phase - Minimalist Design.
- Last Action: Integrated ProductGallery into Main Page.
- Pending Tasks: Build Navigation bar, Add Cart functionality.
*/

"use client";

import React, { useState } from "react";
import ProductGallery from "@/components/ProductGallery";
import { MoveRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import CartDrawer from "@/components/CartDrawer";
import AuthModal from "@/components/AuthModal";

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
      
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden bg-[#F6F6F6]">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-zinc-200 rounded-full blur-[120px] opacity-50" />
        </div>
        
        <div className="container relative z-10 px-6 sm:px-10 lg:px-20 text-center">
          <span className="inline-block px-4 py-1.5 mb-6 text-[11px] font-bold tracking-[0.2em] uppercase text-zinc-500 border border-zinc-200 rounded-full bg-white/50 backdrop-blur-sm">
            Kanpur Shoes Wala &bull; Series 01
          </span>
          <h1 className="text-6xl sm:text-8xl lg:text-9xl font-bold text-zinc-900 tracking-tighter leading-[0.85]">
            DIRECT <br />
            <span className="text-zinc-400">TO YOU.</span>
          </h1>
          <p className="mt-10 text-lg sm:text-xl text-zinc-600 max-w-xl mx-auto font-medium leading-relaxed">
            Eliminating the middleman. Premium craftsmanship from Kanpur, delivered straight to your doorstep.
          </p>
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6">
            <a 
              href="#gallery" 
              className="group px-10 py-5 bg-zinc-900 text-white rounded-full font-semibold flex items-center gap-3 hover:bg-zinc-800 transition-all duration-300"
            >
              Shop Collection
              <MoveRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <button className="px-10 py-5 border border-zinc-200 text-zinc-900 rounded-full font-semibold hover:bg-white transition-all duration-300">
              Our Process
            </button>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <div id="gallery">
        <ProductGallery />
      </div>

      {/* Footer Placeholder */}
      <footer className="py-20 border-t border-zinc-100 px-10">
        <div className="max-w-[1800px] mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold tracking-tighter">KANPUR SHOES WALA</h2>
            <p className="text-zinc-500 max-w-xs">
              Redefining luxury through direct craftsmanship. Born in Kanpur, designed for the world.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-12 sm:gap-24">
            <div className="space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-widest text-zinc-400">Shop</h4>
              <ul className="space-y-2 text-zinc-600 text-sm">
                <li><a href="#" className="hover:text-zinc-900">All Shoes</a></li>
                <li><a href="#" className="hover:text-zinc-900">New Arrivals</a></li>
                <li><a href="#" className="hover:text-zinc-900">Best Sellers</a></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-widest text-zinc-400">About</h4>
              <ul className="space-y-2 text-zinc-600 text-sm">
                <li><a href="#" className="hover:text-zinc-900">Our Story</a></li>
                <li><a href="#" className="hover:text-zinc-900">Manufacturing</a></li>
                <li><a href="#" className="hover:text-zinc-900">Sustainability</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="max-w-[1800px] mx-auto mt-20 pt-10 border-t border-zinc-50 text-center text-xs text-zinc-400">
          &copy; 2026 KANPUR SHOES WALA. ALL RIGHTS RESERVED.
        </div>
      </footer>
    </main>
  );
}
