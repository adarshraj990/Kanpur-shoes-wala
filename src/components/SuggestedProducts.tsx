"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import ShoeCard from "./ShoeCard";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

interface Shoe {
  id: number;
  name: string;
  price: number;
  description: string;
  image_url: string;
  category?: string;
}

export default function SuggestedProducts({ currentId, category }: { currentId: string; category?: string }) {
  const [suggestions, setSuggestions] = useState<Shoe[]>([]);

  useEffect(() => {
    async function fetchSuggestions() {
      try {
        let query = supabase.from("shoes").select("*").neq("id", currentId).limit(4);

        if (category) {
          query = query.eq("category", category);
        }

        const { data, error } = await query;
        if (error) throw error;

        if (!data || data.length < 2) {
          const { data: fallbackData } = await supabase
            .from("shoes")
            .select("*")
            .neq("id", currentId)
            .limit(4);
          setSuggestions(fallbackData || []);
        } else {
          setSuggestions(data);
        }
      } catch (err) {
        console.error("Error fetching suggestions:", err);
      }
    }

    fetchSuggestions();
  }, [currentId, category]);

  if (suggestions.length === 0) return null;

  return (
    <div className="mt-20 pt-16 border-t border-[#efefef]">
      <div className="flex justify-between items-end mb-10">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#999] block mb-2">Related Products</span>
          <h2 className="text-[26px] font-black tracking-tight text-black">You May Also Like</h2>
        </div>
        <a href="/#gallery" className="text-[12px] font-bold text-[#555] hover:text-black flex items-center gap-1 transition-colors">
          View all <ChevronRight className="w-3.5 h-3.5" />
        </a>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
        {suggestions.map((shoe, i) => (
          <motion.div
            key={shoe.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.06 }}
          >
            <ShoeCard shoe={shoe} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
