/* MASTER_LOG - APRIL 26, 2026 
- Project Status: Database Debugging.
- Last Action: Improved fetch error logging, Env key verification.
- Pending Tasks: Fix RLS policies, Add Skeleton loaders.
*/

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
  brand?: string;
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
        console.error("Error fetching shoes:", {
          message: err.message,
          details: err.details,
          hint: err.hint,
          code: err.code
        });
      } finally {
        setLoading(false);
      }
    }

    fetchShoes();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-zinc-900"></div>
      </div>
    );
  }

  return (
    <section className="py-20 px-6 sm:px-10 lg:px-20 max-w-[1800px] mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
        <div>
          <motion.h2 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl sm:text-5xl font-bold text-zinc-900 tracking-tight"
          >
            The Collection
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-zinc-500 text-lg max-w-md"
          >
            Meticulously crafted footwear for the modern explorer. No noise, just quality.
          </motion.p>
        </div>
        <div className="flex items-center gap-4 text-sm font-medium text-zinc-500">
          <span>{shoes.length} Products</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
        {shoes.map((shoe) => (
          <ShoeCard
            key={shoe.id}
            shoe={shoe}
          />
        ))}
      </div>

      {shoes.length === 0 && (
        <div className="text-center py-20 bg-zinc-50 rounded-3xl border border-dashed border-zinc-200">
          <p className="text-zinc-500">No products found in the database. Please add some shoes to Supabase!</p>
        </div>
      )}
    </section>
  );
}
