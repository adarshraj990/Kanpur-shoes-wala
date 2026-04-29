"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import ShoeCard from "./ShoeCard";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal, X } from "lucide-react";

interface Shoe {
  id: number;
  name: string;
  price: number;
  description: string;
  image_url: string;
  category?: string;
  brand?: string;
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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#121212]"></div>
      </div>
    );
  }

  return (
    <section className="py-24 sm:py-32 px-6 sm:px-10 lg:px-12 max-w-[1400px] mx-auto">
      {/* ── High-Impact Typography ── */}
      <div className="flex flex-col mb-16 sm:mb-24 gap-12">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10">
          <div className="max-w-2xl space-y-6">
            <div className="space-y-3">
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-[12px] font-black uppercase tracking-[0.3em] text-[#FF4F00]"
                style={{ fontFamily: "var(--font-montserrat)" }}
              >
                Artisanal Excellence
              </motion.p>
              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-5xl sm:text-7xl font-black text-[#121212] tracking-tighter leading-[0.9]"
                style={{ fontFamily: "var(--font-montserrat)" }}
              >
                The<br />Collection
              </motion.h2>
            </div>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="text-[#121212]/50 text-lg sm:text-xl font-medium leading-relaxed max-w-lg"
            >
              Born in Kanpur. Crafted for the global nomad. A fusion of heritage craftsmanship and modern silhouette.
            </motion.p>
          </div>

          {/* ── Search Experience ── */}
          <div className="relative w-full lg:w-[400px] group">
            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-[#121212]/40 group-focus-within:text-[#FF4F00] transition-colors z-10">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              placeholder="Find your aesthetic..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-15 pr-14 py-5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-[2rem] focus:outline-none focus:ring-4 focus:ring-[#FF4F00]/5 focus:border-[#FF4F00] transition-all text-[15px] font-medium text-[#121212] placeholder:text-[#121212]/30 shadow-inner"
            />
            <div className="absolute right-5 top-1/2 -translate-y-1/2 flex items-center gap-3 z-10">
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="p-1 text-[#121212]/20 hover:text-[#FF4F00] transition-colors rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
              <div className="w-[1px] h-6 bg-[#E5E7EB]" />
              <button className="p-1 text-[#121212] hover:text-[#FF4F00] transition-colors">
                <SlidersHorizontal className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* ── Category Navigation ── */}
        <div className="relative pt-4">
          <div className="flex items-center gap-4 overflow-x-auto pb-6 no-scrollbar scroll-smooth">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`flex-shrink-0 px-8 py-3 rounded-full text-[12px] font-black uppercase tracking-widest transition-all duration-300 min-h-[48px] border ${
                  selectedCategory === cat
                    ? "bg-[#FF4F00] text-white border-[#FF4F00] shadow-xl shadow-orange-100"
                    : "bg-white border-[#E5E7EB] text-[#121212]/40 hover:border-[#121212] hover:text-[#121212]"
                }`}
                style={{ fontFamily: "var(--font-montserrat)" }}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="lg:hidden absolute right-0 top-4 bottom-10 w-20 bg-gradient-to-l from-[#F9FAFB] to-transparent pointer-events-none" />
        </div>
      </div>

      {/* ── Product Grid (Luxury Spacing) ── */}
      <motion.div
        layout
        className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 lg:gap-10"
      >
        <AnimatePresence mode="popLayout">
          {filteredShoes.map((shoe) => (
            <motion.div
              layout
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              key={shoe.id}
            >
              <ShoeCard shoe={shoe} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {filteredShoes.length === 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-48 bg-[#F9FAFB] rounded-[4rem] border-2 border-dashed border-[#E5E7EB]"
        >
          <div className="max-w-xs mx-auto space-y-6">
            <Search className="w-16 h-16 text-[#E5E7EB] mx-auto" />
            <div className="space-y-2">
              <p className="text-[#121212] font-black text-xl">No Matches</p>
              <p className="text-[#121212]/40 text-sm font-medium">Refine your search aesthetic or filters.</p>
            </div>
            <button 
              onClick={() => { setSearchTerm(""); setSelectedCategory("All"); }}
              className="px-8 py-4 bg-[#121212] text-white text-[11px] font-black uppercase tracking-widest rounded-2xl hover:bg-[#FF4F00] transition-colors duration-500"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              Reset All
            </button>
          </div>
        </motion.div>
      )}
    </section>
  );
}
