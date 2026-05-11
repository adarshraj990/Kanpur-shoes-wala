"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";
import Link from "next/image";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white text-[#111] font-inter">
      <Navbar onCartClick={() => {}} onAuthClick={() => {}} />

      <section className="pt-[140px] pb-24">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center mb-20"
          >
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#999] block mb-4">Our Story</span>
            <h1 className="text-[3rem] sm:text-[4rem] font-black leading-[0.9] tracking-tight mb-8">
              Handcrafted in <span className="text-[#999]">Kanpur</span>. <br />
              Worn Worldwide.
            </h1>
            <p className="text-[16px] text-[#666] leading-relaxed">
              Kanpur Shoes Wala (KSW) started with a simple vision: to bring the legendary craftsmanship of Kanpur's leather artisans to the modern world. Every pair we create is a blend of traditional techniques and contemporary design.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center mb-24">
            <div className="relative aspect-square rounded-[32px] overflow-hidden bg-[#f7f7f7]">
              <img 
                src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800" 
                alt="Craftsmanship" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col gap-6">
              <h2 className="text-[2rem] font-black tracking-tight">The Heritage of Quality</h2>
              <p className="text-[15px] text-[#666] leading-relaxed">
                Kanpur has long been known as the Leather City of the World. Our mission is to preserve this heritage while innovating for the future. We work directly with local craftsmen, ensuring fair wages and ethical production for every stitch and sole.
              </p>
              <div className="grid grid-cols-2 gap-8 mt-4">
                <div>
                  <h4 className="text-[24px] font-black">100%</h4>
                  <p className="text-[12px] font-bold uppercase tracking-widest text-[#999]">Genuine Leather</p>
                </div>
                <div>
                  <h4 className="text-[24px] font-black">50+</h4>
                  <p className="text-[12px] font-bold uppercase tracking-widest text-[#999]">Master Artisans</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#111] text-white rounded-[40px] p-12 md:p-20 text-center">
            <h2 className="text-[2.5rem] md:text-[3.5rem] font-black leading-tight mb-8">
              Join the Movement <br />
              of Ethical Fashion
            </h2>
            <p className="text-white/60 text-[16px] max-w-xl mx-auto mb-10">
              We believe that quality should never come at the cost of the environment or the workers. That's why we use sustainable tanning processes and zero-waste manufacturing.
            </p>
            <a href="/#gallery" className="btn-pill bg-white text-black hover:bg-gray-100 transition-colors">
              Explore Collection
            </a>
          </div>
        </div>
      </section>

      <footer className="border-t border-[#efefef] bg-white py-12 text-center">
        <p className="text-[11px] text-[#aaa] font-medium uppercase tracking-widest">
          © 2026 Kanpur Shoes Wala. Crafting Excellence.
        </p>
      </footer>
    </main>
  );
}
