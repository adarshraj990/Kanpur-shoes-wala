"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { ShoppingBag, Zap } from "lucide-react";
import { useState } from "react";

interface Shoe {
  id: number;
  name: string;
  price: number;
  description: string;
  image_url: string;
  category?: string;
}

export default function ShoeCard({ shoe }: { shoe: Shoe }) {
  const { addToCart, buyNow } = useCart();
  const { name, price, description, image_url, category } = shoe;
  const [added, setAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(shoe);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    buyNow(shoe);
  };

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="group flex flex-col bg-white rounded-[2rem] overflow-hidden border border-[#E5E7EB] hover:border-[#121212]/10 hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] transition-all duration-500 h-full"
    >
      {/* ── Image Container ── */}
      <Link
        href={`/product/${shoe.id}`}
        className="relative overflow-hidden bg-[#F9FAFB] block aspect-[1/1] min-h-0 min-w-0"
      >
        <Image
          src={
            image_url ||
            "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800"
          }
          alt={name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
        />

        {/* Floating Tag */}
        {category && (
          <div className="absolute top-5 left-5 z-10">
            <span className="px-4 py-1.5 bg-white/90 backdrop-blur-xl rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-[#121212] shadow-sm border border-[#121212]/5">
              {category}
            </span>
          </div>
        )}
      </Link>

      {/* ── Card Body ── */}
      <div className="flex flex-col flex-1 p-6 sm:p-8 gap-6">
        <div className="space-y-2 flex-1">
          <div className="flex justify-between items-start gap-4">
            <h3
              className="text-xl sm:text-2xl font-black text-[#121212] leading-[1.1] tracking-tighter"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              {name}
            </h3>
            <span
              className="text-xl sm:text-2xl font-black text-[#FF4F00] pt-1"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              ₹{price.toLocaleString()}
            </span>
          </div>
          <p className="text-[14px] text-[#121212]/50 leading-relaxed line-clamp-2 font-medium">
            {description}
          </p>
        </div>

        {/* ── CTA Actions (Luxury Style) ── */}
        <div className="flex gap-4">
          {/* Secondary: ADD (Outline) */}
          <button
            onClick={handleAddToCart}
            className={`flex-[0.45] flex items-center justify-center gap-2 h-14 rounded-2xl text-[12px] font-black uppercase tracking-widest border-2 transition-all duration-300 active:scale-95 ${
              added
                ? "bg-green-500 border-green-500 text-white"
                : "border-[#121212] text-[#121212] hover:bg-[#121212] hover:text-white"
            }`}
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            <ShoppingBag className="w-5 h-5 flex-shrink-0" />
            <span className="hidden sm:inline">{added ? "Done" : "Add"}</span>
          </button>

          {/* Primary: BUY NOW (Solid) */}
          <button
            onClick={handleBuyNow}
            className="flex-1 flex items-center justify-center gap-2 h-14 rounded-2xl text-[12px] font-black uppercase tracking-widest bg-[#FF4F00] text-white border-2 border-[#FF4F00] hover:bg-[#E64600] hover:border-[#E64600] shadow-[0_12px_24px_rgba(255,79,0,0.15)] hover:shadow-[0_16px_32px_rgba(255,79,0,0.25)] transition-all duration-300 active:scale-95"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            <Zap className="w-5 h-5 flex-shrink-0 fill-white" />
            <span>Buy Now</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
