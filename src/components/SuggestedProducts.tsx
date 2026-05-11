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
      <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-12">
        <h2 className="text-3xl sm:text-5xl font-black tracking-tighter uppercase">
          Curated<br />For You.
        </h2>
        <p className="text-xs font-bold uppercase tracking-widest text-zinc-400 max-w-xs text-right">
          More selections from our atelier collection.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {suggestions.map((shoe) => (
          <ShoeCard key={shoe.id} shoe={shoe} />
        ))}
      </div>
    </div>
  );
}
