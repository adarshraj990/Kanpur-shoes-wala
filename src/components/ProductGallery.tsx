"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import ShoeCard from "./ShoeCard";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";

interface Shoe {
  id: number;
  name: string;
  price: number;
  description: string;
  image_url: string;
  category?: string;
}

export default function ProductGallery() {
  const [shoes, setShoes] = useState<Shoe[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="rounded-2xl bg-[#f7f7f7] animate-pulse aspect-[4/5]" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Product Grid */}
      <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
        <AnimatePresence mode="popLayout">
          {shoes.map((shoe) => (
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
      {shoes.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-24 bg-[#f7f7f7] rounded-3xl"
        >
          <Search className="w-8 h-8 text-[#ccc] mx-auto mb-5" />
          <h3 className="text-xl font-bold text-black mb-2">No Products Found</h3>
          <p className="text-[#999] text-sm">We couldn't find any products in the collection right now.</p>
        </motion.div>
      )}
    </div>
  );
}
