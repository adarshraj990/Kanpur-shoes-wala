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
    <section className="py-12 sm:py-20 px-4 sm:px-8 lg:px-12 max-w-[1400px] mx-auto">
      <div className="flex flex-col mb-10 sm:mb-16 gap-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="max-w-xl">
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-xs font-bold uppercase tracking-[0.2em] text-[#FF4500] mb-3"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              Handcrafted Collection
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-4xl sm:text-5xl font-black text-[#1A1A1A] tracking-tighter"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              The Collection
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-4 text-[#6B7280] text-base font-medium leading-relaxed"
            >
              From premium leather shoes to casual slides, handcrafted for your journey.
            </motion.p>
          </div>

          <div className="relative w-full md:w-[350px] group">
            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[#6B7280] group-focus-within:text-[#FF4500] transition-colors">
              <Search className="w-4.5 h-4.5" />
            </div>
            <input
              type="text"
              placeholder="Search premium footwear..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-13 pr-12 py-4 bg-white border border-[#E5E7EB] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#FF4500]/20 focus:border-[#FF4500] transition-all text-sm font-medium text-[#1A1A1A] placeholder:text-[#6B7280]/60 shadow-sm group-hover:shadow-md"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="p-1.5 text-[#6B7280] hover:text-[#FF4500] transition-colors rounded-full hover:bg-orange-50 min-h-0 min-w-0"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <div className="w-[1px] h-4 bg-[#E5E7EB] mx-1" />
              <button className="p-1.5 text-[#1A1A1A] hover:text-[#FF4500] transition-colors min-h-0 min-w-0">
                <SlidersHorizontal className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`flex-shrink-0 px-4 sm:px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all min-h-[40px] ${
                selectedCategory === cat
                  ? "bg-[#FF4500] text-white shadow-lg shadow-orange-200"
                  : "bg-white border border-[#E5E7EB] text-[#6B7280] hover:border-[#FF4500] hover:text-[#FF4500]"
              }`}
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              {cat}
            </button>
          ))}
          <div className="ml-auto hidden md:block text-[10px] font-black uppercase tracking-[0.2em] text-[#6B7280]/50 whitespace-nowrap">
            {filteredShoes.length} results
          </div>
        </div>
      </div>

      <motion.div
        layout
        className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6 lg:gap-8"
      >
        <AnimatePresence mode="popLayout">
          {filteredShoes.map((shoe) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
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
          className="text-center py-32 bg-zinc-50 rounded-[3rem] border-2 border-dashed border-zinc-100"
        >
          <div className="max-w-xs mx-auto">
            <Search className="w-12 h-12 text-zinc-200 mx-auto mb-4" />
            <p className="text-zinc-500 font-bold mb-2">No items match your search</p>
            <p className="text-zinc-400 text-sm">Try adjusting your filters or search terms.</p>
            <button 
              onClick={() => { setSearchTerm(""); setSelectedCategory("All"); }}
              className="mt-6 text-sm font-black uppercase tracking-widest text-zinc-900 underline underline-offset-4"
            >
              Clear all filters
            </button>
          </div>
        </motion.div>
      )}
    </section>
  );
}
