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
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] as any }}
      className="group flex flex-col bg-white rounded-[2rem] overflow-hidden border border-[#F3F4F6] hover:border-[#FF4500]/20 hover:shadow-[0_20px_50px_rgba(0,0,0,0.04)] transition-all duration-500 h-full"
    >
      {/* ── Image Container ── */}
      <Link
        href={`/product/${shoe.id}`}
        className="relative overflow-hidden bg-[#F9F9F9] block aspect-[1/1] min-h-0 min-w-0"
      >
        <Image
          src={
            image_url ||
            "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800"
          }
          alt={name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />

        {/* Floating Category Badge */}
        {category && (
          <div className="absolute top-4 left-4 z-10">
            <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[9px] font-black uppercase tracking-[0.15em] text-[#1A1A1A] shadow-sm">
              {category}
            </span>
          </div>
        )}
      </Link>

      {/* ── Card Content ── */}
      <div className="flex flex-col flex-1 p-5 sm:p-6 gap-4">
        <div className="space-y-1.5 flex-1">
          <div className="flex justify-between items-start gap-4">
            <h3
              className="text-lg sm:text-xl font-bold text-[#1A1A1A] leading-tight tracking-tight line-clamp-2"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              {name}
            </h3>
            <span
              className="text-lg sm:text-xl font-black text-[#FF4500] whitespace-nowrap pt-0.5"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              ₹{price.toLocaleString()}
            </span>
          </div>
          <p className="text-sm text-[#6B7280] leading-relaxed line-clamp-2 font-medium opacity-80">
            {description}
          </p>
        </div>

        {/* ── Action Buttons ── */}
        <div className="flex gap-3 mt-2">
          {/* Add Button */}
          <button
            onClick={handleAddToCart}
            className={`flex-[0.45] flex items-center justify-center gap-2 h-12 sm:h-14 rounded-2xl text-[11px] font-black uppercase tracking-widest border-2 transition-all duration-300 active:scale-95 ${
              added
                ? "bg-green-500 border-green-500 text-white"
                : "border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white"
            }`}
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            <ShoppingBag className="w-4 h-4 flex-shrink-0" />
            <span className="hidden sm:inline">{added ? "Done" : "Add"}</span>
          </button>

          {/* Buy Now Button */}
          <button
            onClick={handleBuyNow}
            className="flex-1 flex items-center justify-center gap-2 h-12 sm:h-14 rounded-2xl text-[11px] font-black uppercase tracking-widest bg-[#FF4500] text-white border-2 border-[#FF4500] hover:bg-[#E63E00] hover:border-[#E63E00] shadow-[0_8px_20px_rgba(255,69,0,0.2)] hover:shadow-[0_12px_25px_rgba(255,69,0,0.3)] transition-all duration-300 active:scale-95"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            <Zap className="w-4 h-4 flex-shrink-0 fill-white" />
            <span>Buy Now</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
