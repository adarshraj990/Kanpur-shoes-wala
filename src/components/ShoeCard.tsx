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
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] as any }}
      className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-[#E5E7EB] hover:border-[#FF4500]/40 hover:shadow-lg hover:shadow-orange-100/60 transition-all duration-400"
    >
      {/* ── Image ── */}
      <Link
        href={`/product/${shoe.id}`}
        className="relative overflow-hidden bg-[#F8F8F8] block aspect-square min-h-0 min-w-0"
      >
        <Image
          src={
            image_url ||
            "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800"
          }
          alt={name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-600 ease-in-out group-hover:scale-105"
        />

        {/* Category badge */}
        {category && (
          <span className="absolute top-2 left-2 px-2 py-0.5 bg-white/90 backdrop-blur-sm rounded-full text-[9px] font-black uppercase tracking-widest text-[#1A1A1A] leading-none">
            {category}
          </span>
        )}
      </Link>

      {/* ── Card Body ── */}
      <div className="flex flex-col gap-3 p-3 sm:p-4">
        {/* Name + Price */}
        <div className="flex items-start justify-between gap-2">
          <h3
            className="text-sm sm:text-[15px] font-bold text-[#1A1A1A] leading-snug tracking-tight line-clamp-2 flex-1"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            {name}
          </h3>
          <span
            className="text-base sm:text-lg font-black text-[#FF4500] whitespace-nowrap leading-none pt-0.5"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            ₹{price.toLocaleString()}
          </span>
        </div>

        {/* Description — hidden on very small screens */}
        <p className="hidden sm:block text-xs text-[#6B7280] leading-relaxed line-clamp-2">
          {description}
        </p>

        {/* ── Dual Buttons ── */}
        <div className="flex gap-2 mt-1">
          {/* Add to Bag (Outline) */}
          <button
            onClick={handleAddToCart}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[11px] sm:text-xs font-black uppercase tracking-wide border-2 transition-all duration-250 active:scale-95 min-h-[44px] ${
              added
                ? "bg-green-500 border-green-500 text-white"
                : "border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white"
            }`}
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            <ShoppingBag className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{added ? "Added!" : "Add"}</span>
          </button>

          {/* Buy Now (Solid Orange) */}
          <button
            onClick={handleBuyNow}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[11px] sm:text-xs font-black uppercase tracking-wide bg-[#FF4500] text-white border-2 border-[#FF4500] hover:bg-[#E63E00] hover:border-[#E63E00] hover:shadow-md hover:shadow-orange-200 transition-all duration-250 active:scale-95 min-h-[44px]"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            <Zap className="w-3.5 h-3.5 flex-shrink-0 fill-white" />
            <span>Buy Now</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
