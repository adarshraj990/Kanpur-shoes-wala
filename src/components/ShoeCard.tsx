"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { ShoppingBag, Eye } from "lucide-react";
import { useState } from "react";

interface Shoe {
  id: number;
  name: string;
  price: number;
  description: string;
  image_url: string;
  category?: string;
}

interface ShoeCardProps {
  shoe: Shoe;
}

export default function ShoeCard({ shoe }: ShoeCardProps) {
  const { addToCart } = useCart();
  const { name, price, description, image_url, category } = shoe;
  const [added, setAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(shoe);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex flex-col bg-white rounded-2xl overflow-hidden border border-[#E5E7EB] hover:border-[#FF4500]/30 hover:shadow-xl hover:shadow-orange-100/50 transition-all duration-500"
    >
      {/* Image Container */}
      <Link href={`/product/${shoe.id}`} className="relative overflow-hidden bg-[#F8F8F8] block aspect-square min-h-0 min-w-0">
        <Image
          src={image_url || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800"}
          alt={name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
        />
        
        {/* Category Badge */}
        {category && (
          <div className="absolute top-2 left-2 px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-full text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A]">
            {category}
          </div>
        )}

        {/* Quick View Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.05 }}
            className="opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white/95 backdrop-blur-sm text-[#1A1A1A] px-3 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-lg"
          >
            <Eye className="w-3.5 h-3.5" />
            Quick View
          </motion.div>
        </div>
      </Link>

      {/* Card Body */}
      <div className="p-3 sm:p-4 flex flex-col flex-1">
        {/* Name & Price */}
        <div className="flex justify-between items-start gap-2 mb-1">
          <h3
            className="text-sm sm:text-base font-bold text-[#1A1A1A] leading-tight line-clamp-1"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            {name}
          </h3>
          <span
            className="text-base sm:text-lg font-black text-[#FF4500] whitespace-nowrap"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            ₹{price.toLocaleString()}
          </span>
        </div>

        {/* Description */}
        <p className="text-xs sm:text-sm text-[#6B7280] line-clamp-2 leading-relaxed mb-3 flex-1">
          {description}
        </p>

        {/* CTA Button - Always visible on mobile, hover on desktop */}
        <button
          onClick={handleAddToCart}
          className={`w-full py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-300 min-h-[44px] ${
            added
              ? "bg-green-500 text-white scale-95"
              : "bg-[#FF4500] text-white hover:bg-[#E63E00] hover:shadow-lg hover:shadow-orange-200 active:scale-95 sm:opacity-0 sm:translate-y-2 sm:group-hover:opacity-100 sm:group-hover:translate-y-0"
          }`}
          style={{ fontFamily: "var(--font-montserrat)" }}
        >
          {added ? (
            "✓ Added!"
          ) : (
            <>
              <ShoppingBag className="w-3.5 h-3.5" />
              Add to Bag
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}
