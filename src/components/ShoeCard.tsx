"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
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
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="group flex flex-col h-full cursor-pointer relative"
    >
      {/* Background Glow Effect on Hover */}
      <div className="absolute inset-0 bg-[#FDE68A]/0 group-hover:bg-[#FDE68A]/5 blur-3xl rounded-3xl transition-colors duration-500 -z-10" />

      {/* Image Container */}
      <Link href={`/product/${shoe.id}`} className="relative bg-[#0a0a0a] border border-white/5 aspect-[4/5] rounded-3xl overflow-hidden mb-6">
        <Image
          src={image_url || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800"}
          alt={name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-all duration-[2s] ease-out group-hover:scale-110 group-hover:opacity-80"
        />
        
        {/* Floating Quick Action */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-center pb-8">
          <div className="flex gap-3 translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100">
            <button 
              onClick={handleAddToCart}
              className={`p-3.5 rounded-full backdrop-blur-xl border transition-all duration-300 ${
                added ? "bg-[#FDE68A] text-black border-[#FDE68A] shadow-[0_0_15px_#FDE68A]" : "bg-black/50 text-white border-white/20 hover:bg-[#FDE68A] hover:text-black hover:border-[#FDE68A]"
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
            </button>
            <button 
              onClick={handleBuyNow}
              className="px-8 py-3.5 rounded-full bg-[#FDE68A] text-black text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#D97706] hover:scale-105 transition-all shadow-[0_0_15px_rgba(253,230,138,0.2)]"
            >
              Buy Now
            </button>
          </div>
        </div>
      </Link>

      {/* Info Container */}
      <div className="flex flex-col flex-1 px-2">
        <div className="flex justify-between items-start gap-4 mb-2">
          <h3 className="text-lg font-black tracking-tighter text-white uppercase line-clamp-1 group-hover:text-[#FDE68A] transition-colors">
            {name}
          </h3>
          <span className="text-sm font-bold text-white shrink-0 bg-white/10 px-2 py-1 rounded-md backdrop-blur-sm border border-white/5">
            ₹{price.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between items-end mt-auto pt-2">
          <p className="text-xs text-zinc-400 font-medium line-clamp-1 max-w-[70%]">
            {description}
          </p>
          {category && (
            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#FDE68A]/70">
              {category}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
