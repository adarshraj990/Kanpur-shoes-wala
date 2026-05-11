"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import ShoeCard from "./ShoeCard";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, SlidersHorizontal } from "lucide-react";

interface Shoe {
  id: number;
  name: string;
  price: number;
  description: string;
  image_url: string;
  category?: string;
}

const CATEGORIES = ["All", "Chelsea", "Sneakers", "Loafers", "Formals", "Sports"];

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
    const matchesSearch =
      shoe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shoe.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || shoe.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="grid grid-cols-4 gap-6 w-full">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="rounded-2xl bg-[#f7f7f7] animate-pulse aspect-[4/5]" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Filter bar */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10">
        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`shrink-0 px-5 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-200 ${
                selectedCategory === cat
                  ? "bg-black text-white"
                  : "bg-[#f7f7f7] text-[#666] hover:bg-[#eeeeee] hover:text-black"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full lg:w-72 shrink-0">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#aaa]" />
          <input
            type="text"
            placeholder="Search collection..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="ksw-search"
            style={{ paddingLeft: "36px" }}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-0.5 text-[#999] hover:text-black transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Result count */}
      {(searchTerm || selectedCategory !== "All") && (
        <p className="text-[12px] text-[#999] font-medium mb-6">
          {filteredShoes.length} product{filteredShoes.length !== 1 ? "s" : ""} found
        </p>
      )}

      {/* Product Grid */}
      <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
        <AnimatePresence mode="popLayout">
          {filteredShoes.map((shoe) => (
            <motion.div
              layout
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
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
          className="text-center py-24 bg-[#f7f7f7] rounded-3xl"
        >
          <Search className="w-8 h-8 text-[#ccc] mx-auto mb-5" />
          <h3 className="text-xl font-bold text-black mb-2">No Products Found</h3>
          <p className="text-[#999] text-sm mb-6">We couldn't find anything matching your criteria.</p>
          <button
            onClick={() => { setSearchTerm(""); setSelectedCategory("All"); }}
            className="btn-pill btn-pill-dark"
          >
            Clear Filters
          </button>
        </motion.div>
      )}
    </div>
  );
}
