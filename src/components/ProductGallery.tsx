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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-zinc-900"></div>
      </div>
    );
  }

  return (
    <section className="py-16 sm:py-24 px-6 sm:px-10 lg:px-12 max-w-[1400px] mx-auto">
      <div className="flex flex-col mb-12 sm:mb-20 gap-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          <div className="max-w-xl space-y-5">
            <div>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#FF4500] mb-2"
                style={{ fontFamily: "var(--font-montserrat)" }}
              >
                Direct from Kanpur
              </motion.p>
              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-4xl sm:text-6xl font-black text-[#1A1A1A] tracking-tighter leading-none"
                style={{ fontFamily: "var(--font-montserrat)" }}
              >
                The Collection
              </motion.h2>
            </div>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="text-[#6B7280] text-base sm:text-lg font-medium leading-relaxed"
            >
              Discover artisanal excellence. Handcrafted footwear designed for style, built for comfort.
            </motion.p>
          </div>

          {/* Search Bar Refinement */}
          <div className="relative w-full md:w-[380px] group">
            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[#6B7280] group-focus-within:text-[#FF4500] transition-colors z-10">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              placeholder="Search our collection..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-12 py-4.5 bg-white border border-[#E5E7EB] rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#FF4500]/5 focus:border-[#FF4500] transition-all text-sm font-medium text-[#1A1A1A] placeholder:text-[#6B7280]/50 shadow-sm group-hover:shadow-md"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 z-10">
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="p-1.5 text-[#6B7280] hover:text-[#FF4500] transition-colors rounded-full hover:bg-orange-50 min-h-0 min-w-0"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <div className="w-[1px] h-5 bg-[#E5E7EB] mx-1" />
              <button className="p-1.5 text-[#1A1A1A] hover:text-[#FF4500] transition-colors min-h-0 min-w-0">
                <SlidersHorizontal className="w-4.5 h-4.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Category Tabs — Mobile Friendly */}
        <div className="relative">
          <div className="flex items-center gap-3 overflow-x-auto pb-4 no-scrollbar scroll-smooth">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`flex-shrink-0 px-6 py-2.5 rounded-full text-[11px] font-bold uppercase tracking-widest transition-all min-h-[44px] border ${
                  selectedCategory === cat
                    ? "bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-lg shadow-zinc-200"
                    : "bg-white border-[#E5E7EB] text-[#6B7280] hover:border-[#1A1A1A] hover:text-[#1A1A1A]"
                }`}
                style={{ fontFamily: "var(--font-montserrat)" }}
              >
                {cat}
              </button>
            ))}
          </div>
          {/* Subtle scroll indicator for mobile */}
          <div className="md:hidden absolute right-0 top-0 bottom-4 w-12 bg-gradient-to-l from-white to-transparent pointer-events-none" />
        </div>
      </div>

      {/* Product Grid — Premium Gap */}
      <motion.div
        layout
        className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8"
      >
        <AnimatePresence mode="popLayout">
          {filteredShoes.map((shoe) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
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
          className="text-center py-40 bg-[#F9F9F9] rounded-[3rem] border-2 border-dashed border-[#E5E7EB]"
        >
          <div className="max-w-xs mx-auto">
            <Search className="w-12 h-12 text-[#E5E7EB] mx-auto mb-6" />
            <p className="text-[#1A1A1A] font-bold text-lg mb-2">No shoes found</p>
            <p className="text-[#6B7280] text-sm">Try using different keywords or categories.</p>
            <button 
              onClick={() => { setSearchTerm(""); setSelectedCategory("All"); }}
              className="mt-8 text-xs font-black uppercase tracking-[0.2em] text-[#FF4500] hover:opacity-80 transition-opacity"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              Reset Filters
            </button>
          </div>
        </motion.div>
      )}
    </section>
  );
}
