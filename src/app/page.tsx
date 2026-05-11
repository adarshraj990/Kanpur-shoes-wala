"use client";

import React, { useState } from "react";
import ProductGallery from "@/components/ProductGallery";
import Navbar from "@/components/Navbar";
import CartDrawer from "@/components/CartDrawer";
import AuthModal from "@/components/AuthModal";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ShieldCheck, Truck, RefreshCcw, Hexagon, Star } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);

  return (
    <main className="min-h-screen bg-[#050505] selection:bg-[#FDE68A] selection:text-black overflow-x-hidden text-[#FAFAFA] font-inter">
      {/* Background ambient glow */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#D97706]/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#D97706]/5 blur-[150px] rounded-full" />
      </div>

      <Navbar
        onCartClick={() => setIsCartOpen(true)}
        onAuthClick={() => setIsAuthOpen(true)}
      />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />

      {/* ─────────────────────── IMMERSIVE HERO ─────────────────────── */}
      <section className="relative flex flex-col justify-center min-h-[100vh] px-6 sm:px-12 max-w-[1400px] mx-auto pt-24 pb-12 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center h-full">
          
          {/* Left Text */}
          <div className="flex flex-col gap-8 z-10 relative">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full w-fit glass"
            >
              <span className="w-2 h-2 rounded-full bg-[#FDE68A] animate-pulse shadow-[0_0_10px_#FDE68A]" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#FDE68A]">Kanpur's Finest</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-[4rem] sm:text-[6rem] lg:text-[7rem] font-black leading-[0.85] tracking-tighter"
            >
              PURE<br />
              <span className="text-gradient-gold">LEATHER.</span><br />
              NO BS.
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-lg sm:text-xl text-zinc-400 max-w-lg font-medium leading-relaxed"
            >
              Experience the true luxury of genuine, handcrafted footwear straight from the legendary tanneries of Kanpur. 
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-wrap items-center gap-6 pt-4"
            >
              <a href="#gallery" className="group relative flex items-center gap-4 bg-[#FAFAFA] text-black px-10 py-5 rounded-full text-sm font-black uppercase tracking-widest hover:scale-105 transition-all duration-300 shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                Shop Collection 
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              
              <div className="flex items-center gap-3 px-4">
                <div className="flex -space-x-3">
                  {[1,2,3].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-[#050505] bg-zinc-800 flex items-center justify-center overflow-hidden relative">
                       <Image src={`https://i.pravatar.cc/100?img=${i+10}`} alt="user" fill className="object-cover" />
                    </div>
                  ))}
                </div>
                <div className="flex flex-col">
                  <div className="flex text-[#FDE68A]">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-current" />)}
                  </div>
                  <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider mt-1">10k+ Happy Feet</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Visual */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            style={{ y }}
            className="relative h-[60vh] lg:h-[80vh] w-full rounded-[2.5rem] overflow-hidden group border border-white/10"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-[#D97706]/20 to-transparent z-10 pointer-events-none mix-blend-overlay" />
            <Image 
              src="https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=2012&auto=format&fit=crop" 
              alt="Premium Leather Shoe" 
              fill 
              className="object-cover scale-105 group-hover:scale-110 transition-transform duration-[3s] ease-out opacity-90"
              priority
            />
            
            {/* Floating Badge */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute top-10 right-10 z-20 glass px-6 py-4 rounded-2xl flex flex-col items-center border-white/10"
            >
              <Hexagon className="w-8 h-8 text-[#FDE68A] mb-2" strokeWidth={1.5} />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Genuine</span>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#FDE68A]">Leather</span>
            </motion.div>
          </motion.div>

        </div>
      </section>

      {/* ─────────────────────── VALUE PROPOSITION ─────────────────────── */}
      <section className="py-24 relative">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        
        <div className="max-w-[1400px] mx-auto px-6 sm:px-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: ShieldCheck, title: "Artisan Quality", desc: "Hand-stitched precision using genuine premium leather. Built to last a lifetime." },
            { icon: Truck, title: "Direct to Door", desc: "Express delivery across India directly from the manufacturer. Zero middlemen." },
            { icon: RefreshCcw, title: "Perfect Fit", desc: "Seamless 7-day return and exchange policy to ensure you get the absolute best fit." }
          ].map((feature, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="flex flex-col gap-6 p-10 rounded-[2rem] glass hover:bg-white/[0.05] transition-colors group"
            >
              <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 group-hover:border-[#FDE68A]/50 transition-all duration-500">
                <feature.icon className="w-8 h-8 text-[#FDE68A]" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-bold tracking-tight text-white">{feature.title}</h3>
              <p className="text-sm text-zinc-400 leading-relaxed font-medium">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─────────────────────── PRODUCT GALLERY ─────────────────────── */}
      <section id="gallery" className="py-32 relative z-10">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-12">
          <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-20">
            <div className="flex flex-col gap-4">
              <span className="text-sm font-bold uppercase tracking-[0.3em] text-[#FDE68A]">Curated Footwear</span>
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-white">THE COLLECTION.</h2>
            </div>
          </div>
          <ProductGallery />
        </div>
      </section>

      {/* ─────────────────────── PREMIUM FOOTER ─────────────────────── */}
      <footer id="about" className="relative pt-32 pb-12 px-6 sm:px-12 bg-[#020202] border-t border-white/5 overflow-hidden">
        {/* Large BG Text */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center opacity-[0.02] pointer-events-none">
          <span className="text-[20vw] font-black tracking-tighter whitespace-nowrap text-white">KANPUR</span>
        </div>

        <div className="max-w-[1400px] mx-auto relative z-10 grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-32">
          
          <div className="flex flex-col gap-8">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                <Hexagon className="w-6 h-6 text-[#FDE68A]" strokeWidth={2} />
              </div>
              <span className="text-3xl font-black tracking-tighter uppercase text-white">KanpurShoes</span>
            </Link>
            <p className="text-zinc-500 text-sm max-w-sm leading-relaxed font-medium">
              Redefining the footwear industry by bringing Kanpur's legendary craftsmanship directly to consumers. Premium quality, honest pricing.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div className="flex flex-col gap-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Company</h4>
              <Link href="#" className="text-sm text-zinc-400 hover:text-[#FDE68A] transition-colors">Our Story</Link>
              <Link href="#" className="text-sm text-zinc-400 hover:text-[#FDE68A] transition-colors">Atelier</Link>
              <Link href="#" className="text-sm text-zinc-400 hover:text-[#FDE68A] transition-colors">Sustainability</Link>
            </div>
            <div className="flex flex-col gap-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Support</h4>
              <Link href="#" className="text-sm text-zinc-400 hover:text-[#FDE68A] transition-colors">Contact</Link>
              <Link href="#" className="text-sm text-zinc-400 hover:text-[#FDE68A] transition-colors">Returns</Link>
              <Link href="#" className="text-sm text-zinc-400 hover:text-[#FDE68A] transition-colors">Size Guide</Link>
            </div>
          </div>
        </div>

        <div className="max-w-[1400px] mx-auto mt-32 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 relative z-10">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600">© 2026 KANPUR SHOES WALA.</p>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#FDE68A]">DESIGNED FOR EXCELLENCE</p>
        </div>
      </footer>
    </main>
  );
}
