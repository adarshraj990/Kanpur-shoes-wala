"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import ShoeCard from "./ShoeCard";
import { motion } from "framer-motion";

interface Shoe {
  id: number;
  name: string;
  price: number;
  description: string;
  image_url: string;
  category?: string;
}

export default function SuggestedProducts({ currentId, category }: { currentId: string, category?: string }) {
  const [suggestions, setSuggestions] = useState<Shoe[]>([]);

  useEffect(() => {
    async function fetchSuggestions() {
      try {
        let query = supabase
          .from("shoes")
          .select("*")
          .neq("id", currentId)
          .limit(4);

        if (category) {
          query = query.eq("category", category);
        }

        const { data, error } = await query;
        if (error) throw error;
        
        // If not enough products in same category, fetch random ones
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
    <div className="mt-24 pt-24 border-t border-zinc-100">
      <div className="flex flex-col gap-8 mb-12">
        <h2 
          className="text-3xl sm:text-5xl font-black text-[#121212] tracking-tighter"
          style={{ fontFamily: "var(--font-montserrat)" }}
        >
          You Might<br /><span className="text-[#FF4F00]">Also Like</span>
        </h2>
        <p className="text-[#121212]/50 font-medium max-w-sm">
          More curated picks from our elite collection, handcrafted for you.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
        {suggestions.map((shoe) => (
          <ShoeCard key={shoe.id} shoe={shoe} />
        ))}
      </div>
    </div>
  );
}
