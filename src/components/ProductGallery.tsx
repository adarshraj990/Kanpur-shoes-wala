"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import ShoeCard from "./ShoeCard";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";

interface Shoe {
  id: number;
  name: string;
  price: number;
  description: string;
  image_url: string;
  category?: string;
}

const CATEGORIES = ["All", "Premium Shoes", "Sneakers", "Chelsea Boots", "Slides & Sandals", "Running & Sports", "Casual Wear"];

export default function ProductGallery() {
  const [shoes, setShoes] = useState<Shoe[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    async function fetchShoes() {
      try {
        const { data, error } = await supabase
          .from("shoes")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        setShoes(data || []);
      } catch (err: any) {
        console.error("Error fetching shoes:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchShoes();
  }, []);

  const filteredShoes = shoes.filter((shoe) => {
    const matchesSearch = shoe.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         shoe.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || shoe.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 bg-[#FDE68A] animate-pulse rounded-sm shadow-[0_0_15px_#FDE68A]"></div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Search & Filter Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12 mb-16">
        {/* Categories */}
        <div className="w-full lg:w-2/3 overflow-x-auto no-scrollbar mask-gradient">
          <div className="flex gap-3 pb-4">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-all duration-300 ${
                  selectedCategory === cat
                    ? "bg-[#FDE68A] text-black shadow-[0_0_20px_rgba(253,230,138,0.3)]"
                    : "bg-white/5 text-zinc-400 border border-white/10 hover:bg-white/10 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Search */}
        <div className="w-full lg:w-1/3 relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-[#FDE68A] transition-colors">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Search collection..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-12 py-4 bg-[#0a0a0a] border-b-2 border-white/10 focus:outline-none focus:bg-white/5 focus:border-[#FDE68A] transition-all text-sm font-bold text-white placeholder:text-zinc-600 placeholder:font-medium rounded-t-xl"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-zinc-500 hover:text-[#FDE68A] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Product Grid */}
      <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
        <AnimatePresence mode="popLayout">
          {filteredShoes.map((shoe) => (
            <motion.div
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              key={shoe.id}
            >
              <ShoeCard shoe={shoe} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Empty State */}
      {filteredShoes.length === 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-32 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-sm"
        >
          <Search className="w-8 h-8 text-[#FDE68A] mx-auto mb-6 opacity-50" />
          <h3 className="text-2xl font-black tracking-tighter uppercase mb-2 text-white">No Products Found</h3>
          <p className="text-zinc-500 font-medium mb-8 text-sm">We couldn't find anything matching your criteria.</p>
          <button 
            onClick={() => { setSearchTerm(""); setSelectedCategory("All"); }}
            className="px-8 py-4 bg-[#FDE68A] text-black text-xs font-bold uppercase tracking-widest rounded-full hover:bg-[#D97706] transition-colors"
          >
            Clear Filters
          </button>
        </motion.div>
      )}
    </div>
  );
}
