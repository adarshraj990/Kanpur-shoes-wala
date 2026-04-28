/* MASTER_LOG - APRIL 26, 2026 
- Project Status: D2C Startup Phase - Minimalist Design focus.
- Last Action: Created premium ShoeCard component with Framer Motion.
- Pending Tasks: Connect to Supabase for dynamic data fetching.
*/

"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import Link from "next/link";

interface Shoe {
  id: number;
  name: string;
  price: number;
  description: string;
  image_url: string;
}

interface ShoeCardProps {
  shoe: Shoe;
}

export default function ShoeCard({ shoe }: ShoeCardProps) {
  const { addToCart } = useCart();
  const { name, price, description, image_url } = shoe;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -10 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex flex-col bg-white overflow-hidden"
    >
      <Link href={`/product/${shoe.id}`} className="aspect-[4/5] relative overflow-hidden bg-[#F6F6F6] block">
        <Image
          src={image_url || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=1000"}
          alt={name}
          fill
          className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
      </Link>

      <div className="mt-6 flex flex-col space-y-2 px-1">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-medium text-zinc-900 tracking-tight">
            {name}
          </h3>
          <span className="text-lg font-semibold text-zinc-900">
            ₹{price.toLocaleString()}
          </span>
        </div>
        <p className="text-sm text-zinc-500 line-clamp-2 leading-relaxed">
          {description}
        </p>
        
        <button 
          onClick={() => addToCart(shoe)}
          className="mt-4 w-full py-3 bg-zinc-900 text-white text-sm font-medium rounded-full opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 active:scale-95"
        >
          Add to Bag
        </button>
      </div>
    </motion.div>
  );
}
