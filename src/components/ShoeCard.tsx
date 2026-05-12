"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { ShoppingBag, Heart } from "lucide-react";
import { useState } from "react";
import { Star } from "lucide-react";

interface Shoe {
  id: number;
  name: string;
  price: number;
  description: string;
  image_url: string;
  category?: string;
  sizes?: string[];
}

export default function ShoeCard({ shoe }: { shoe: Shoe }) {
  const { addToCart } = useCart();
  const { name, price, description, image_url, category } = shoe;
  const [wishlisted, setWishlisted] = useState(false);
  const [added, setAdded] = useState(false);
  const [showSizes, setShowSizes] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const availableSizes = shoe.sizes && shoe.sizes.length > 0
    ? shoe.sizes
    : ["6", "7", "8", "9", "10", "11"];

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!selectedSize) {
      setShowSizes(true);
      return;
    }

    addToCart({ ...shoe, selectedSize });
    setAdded(true);
    setShowSizes(false);
    setSelectedSize(null);
    setTimeout(() => setAdded(false), 1600);
  };

  const handleSizeClick = (e: React.MouseEvent, size: string) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedSize(size);
    // Auto-add after selecting size for better UX
    addToCart({ ...shoe, selectedSize: size });
    setAdded(true);
    setShowSizes(false);
    setSelectedSize(null);
    setTimeout(() => setAdded(false), 1600);
  };

  // Derive a display rating (static visual per card)
  const rating = 4.5;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="group flex flex-col h-full cursor-pointer"
    >
      {/* Image Container */}
      <div className="relative block bg-[#f7f7f7] rounded-2xl overflow-hidden mb-4 aspect-[4/5]">
        <Link href={`/product/${shoe.id}`} className="block w-full h-full">
          <Image
            src={image_url || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800"}
            alt={name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </Link>

        {/* Overlay actions */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none group-hover:pointer-events-auto">
          {/* Wishlist */}
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setWishlisted(!wishlisted); }}
            className={`absolute top-3 right-3 p-2 rounded-full bg-white shadow-sm transition-all pointer-events-auto md:opacity-0 md:group-hover:opacity-100 ${wishlisted ? "text-red-500" : "text-[#999]"}`}
          >
            <Heart className={`w-4 h-4 ${wishlisted ? "fill-red-500" : ""}`} />
          </button>

          {/* Add to Cart / Size Picker */}
          <div className="absolute bottom-3 inset-x-3 pointer-events-auto md:opacity-0 md:group-hover:opacity-100">
            {showSizes ? (
              <div 
                className="bg-white/95 backdrop-blur-md p-3 rounded-xl shadow-xl animate-in fade-in slide-in-from-bottom-2 duration-300"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-black">Select Size</span>
                  <button 
                    onClick={() => setShowSizes(false)}
                    className="text-[9px] font-bold text-[#999] hover:text-black"
                  >
                    Cancel
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {availableSizes.map((size) => (
                    <button
                      key={size}
                      onClick={(e) => handleSizeClick(e, size)}
                      className="w-8 h-8 rounded-lg border border-[#eee] flex items-center justify-center text-[10px] font-bold hover:bg-black hover:text-white transition-all"
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <button
                onClick={handleAddToCart}
                className={`w-full py-3 rounded-xl text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md ${
                  added
                    ? "bg-black text-white"
                    : "bg-white text-black hover:bg-black hover:text-white"
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                {added ? "Added!" : "Add to Cart"}
              </button>
            )}
          </div>
        </div>

        {/* Mobile Always-Visible Action (Icon only) */}
        <div className="md:hidden absolute top-3 right-3 flex flex-col gap-2 z-10">
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setWishlisted(!wishlisted); }}
            className={`p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-sm transition-all ${wishlisted ? "text-red-500" : "text-[#999]"}`}
          >
            <Heart className={`w-3.5 h-3.5 ${wishlisted ? "fill-red-500" : ""}`} />
          </button>
        </div>
        
        <div className="md:hidden absolute bottom-3 right-3 z-10">
          <button
            onClick={handleAddToCart}
            className={`p-2.5 rounded-full shadow-lg transition-all ${
              added ? "bg-green-500 text-white" : "bg-black text-white"
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>

        {/* Category badge */}
        {category && (
          <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-[9px] font-bold uppercase tracking-widest text-[#555] px-3 py-1 rounded-full">
            {category}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1 px-1">
        <Link href={`/product/${shoe.id}`}>
          <h3 className="text-[14px] font-bold text-[#111] leading-tight mb-1 line-clamp-1 group-hover:text-[#333] transition-colors">
            {name}
          </h3>
        </Link>

        {/* Star rating */}
        <div className="flex items-center gap-1.5 mb-2">
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                className={`w-3 h-3 ${rating >= s ? "star-filled" : "star-empty"}`}
              />
            ))}
          </div>
          <span className="text-[10px] text-[#999] font-medium">{rating}</span>
        </div>

        <p className="text-[12px] text-[#999] line-clamp-1 mb-3">{description}</p>

        <div className="flex items-center justify-between mt-auto">
          <span className="text-[15px] font-bold text-[#111]">₹{price.toLocaleString()}</span>
          <Link
            href={`/product/${shoe.id}`}
            className="text-[10px] font-bold uppercase tracking-wider text-[#555] hover:text-black transition-colors"
          >
            View Details →
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
