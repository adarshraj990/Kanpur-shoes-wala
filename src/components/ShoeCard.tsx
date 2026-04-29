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
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] as any }}
      className="group flex flex-col bg-white rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden border border-[#E5E7EB] hover:border-[#121212]/10 hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] transition-all duration-500 h-full"
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
          <div className="absolute top-3 left-3 sm:top-5 sm:left-5 z-10">
            <span className="px-2.5 py-1 sm:px-4 sm:py-1.5 bg-white/90 backdrop-blur-xl rounded-full text-[8px] sm:text-[10px] font-black uppercase tracking-[0.1em] sm:tracking-[0.2em] text-[#121212] shadow-sm border border-[#121212]/5">
              {category}
            </span>
          </div>
        )}
      </Link>

      {/* ── Card Body ── */}
      <div className="flex flex-col flex-1 p-4 sm:p-7 gap-4 sm:gap-6">
        <div className="space-y-1.5 sm:space-y-2 flex-1">
          <div className="flex flex-col gap-1">
            <h3
              className="text-base sm:text-2xl font-black text-[#121212] leading-[1.1] tracking-tighter line-clamp-1 group-hover:text-[#FF4F00] transition-colors"
              style={{ fontFamily: "var(--font-montserrat)" }}
              title={name}
            >
              {name}
            </h3>
            <span
              className="text-base sm:text-2xl font-black text-[#FF4F00]"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              ₹{price.toLocaleString()}
            </span>
          </div>
          <p className="text-[11px] sm:text-[14px] text-[#121212]/50 leading-relaxed line-clamp-2 font-medium">
            {description}
          </p>
        </div>

        {/* ── CTA Actions (Luxury Style) ── */}
        <div className="flex gap-2 sm:gap-4 mt-auto">
          {/* Secondary: ADD (Outline) */}
          <button
            onClick={handleAddToCart}
            className={`flex-[0.4] flex items-center justify-center gap-1.5 sm:gap-2 h-11 sm:h-14 rounded-xl sm:rounded-2xl text-[9px] sm:text-[12px] font-black uppercase tracking-widest border-2 transition-all duration-300 active:scale-95 whitespace-nowrap px-2 ${
              added
                ? "bg-green-500 border-green-500 text-white"
                : "border-[#121212] text-[#121212] hover:bg-[#121212] hover:text-white"
            }`}
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            <ShoppingBag className="w-3.5 h-3.5 sm:w-5 sm:h-5 flex-shrink-0" />
            <span>{added ? "Done" : "Add"}</span>
          </button>

          {/* Primary: BUY NOW (Solid) */}
          <button
            onClick={handleBuyNow}
            className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2 h-11 sm:h-14 rounded-xl sm:rounded-2xl text-[9px] sm:text-[12px] font-black uppercase tracking-widest bg-[#FF4F00] text-white border-2 border-[#FF4F00] hover:bg-[#E64600] hover:border-[#E64600] shadow-[0_8px_16px_rgba(255,79,0,0.1)] hover:shadow-[0_12px_24px_rgba(255,79,0,0.2)] transition-all duration-300 active:scale-95 whitespace-nowrap px-2"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            <Zap className="w-3.5 h-3.5 sm:w-5 sm:h-5 flex-shrink-0 fill-white" />
            <span>Buy Now</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
