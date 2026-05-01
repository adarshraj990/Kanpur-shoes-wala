"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, ArrowRight, ShoppingBag, Truck, Package, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function SuccessPage() {
  const [latestOrder, setLatestOrder] = useState<any>(null);

  useEffect(() => {
    // Fetch the most recent order to show details
    const fetchLatestOrder = async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*, shoes(name, image_url, price)")
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (!error && data) {
        setLatestOrder(data);
      }
    };

    fetchLatestOrder();
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col items-center justify-center p-6 sm:p-10">
      <div className="max-w-2xl w-full text-center space-y-8">
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", damping: 12, stiffness: 200 }}
          className="w-24 h-24 bg-[#FF4F00] text-white rounded-[2.5rem] flex items-center justify-center mx-auto shadow-[0_0_50px_rgba(255,79,0,0.3)]"
        >
          <CheckCircle className="w-12 h-12" />
        </motion.div>

        <div className="space-y-4">
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl sm:text-7xl font-black tracking-tighter"
          >
            Order <span className="text-[#FF4F00]">Placed!</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-zinc-500 text-lg font-medium"
          >
            Thank you for shopping with Kanpur Shoes Wala.
          </motion.p>
        </div>

        {latestOrder && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-[#111] border border-[#1A1A1A] rounded-[2.5rem] p-8 text-left space-y-6"
          >
            <div className="flex items-center gap-4 pb-6 border-b border-[#1A1A1A]">
              <div className="w-16 h-16 bg-[#1A1A1A] rounded-2xl overflow-hidden border border-[#2A2A2A] flex-shrink-0">
                <img 
                  src={latestOrder.shoes?.image_url || "/placeholder.png"} 
                  alt={latestOrder.shoes?.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">Items Purchased</p>
                <h4 className="text-lg font-bold">{latestOrder.shoes?.name}</h4>
                <p className="text-[#FF4F00] font-black">₹{latestOrder.amount.toLocaleString()}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-zinc-500">
                  <MapPin className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Shipping To</span>
                </div>
                <p className="text-sm font-medium leading-relaxed">
                  {latestOrder.customer_name}<br />
                  {latestOrder.address}, {latestOrder.city}<br />
                  {latestOrder.pincode}
                </p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-zinc-500">
                  <Package className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Order ID</span>
                </div>
                <p className="text-sm font-black text-white">#{latestOrder.id.toString().slice(-8).toUpperCase()}</p>
                
                <div className="flex items-center gap-2 text-zinc-500 mt-4">
                  <Phone className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Contact</span>
                </div>
                <p className="text-sm font-medium">{latestOrder.phone}</p>
              </div>
            </div>
          </motion.div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
          <Link 
            href="/orders"
            className="w-full sm:w-auto px-10 py-5 bg-[#111] border border-[#1A1A1A] text-white rounded-full font-black text-sm uppercase tracking-widest hover:bg-[#1A1A1A] transition-all flex items-center justify-center gap-2"
          >
            <Package className="w-4 h-4" />
            View History
          </Link>
          <Link 
            href="/"
            className="w-full sm:w-auto px-10 py-5 bg-[#FF4F00] text-white rounded-full font-black text-sm uppercase tracking-widest hover:bg-[#E64600] transition-all shadow-[0_15px_30px_rgba(255,79,0,0.2)] flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" />
            Continue Shop
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
