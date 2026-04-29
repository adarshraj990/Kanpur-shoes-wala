"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { Package, ShoppingBag, ChevronRight, Clock, CheckCircle2, ArrowLeft, Loader2, Search, MapPin, Phone, Zap } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import CartDrawer from "@/components/CartDrawer";
import AuthModal from "@/components/AuthModal";

export default function OrderHistoryPage() {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  useEffect(() => {
    if (!authLoading && user) fetchOrders();
    else if (!authLoading && !user) setLoading(false);
  }, [user, authLoading]);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*, shoes(name, image_url, price)")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      setOrders(data || []);
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || (loading && user)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A]">
        <Loader2 className="w-10 h-10 animate-spin text-[#FF4F00]" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white">
      <Navbar onCartClick={() => setIsCartOpen(true)} onAuthClick={() => setIsAuthOpen(true)} />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />

      <div className="pt-32 pb-20 px-4 sm:px-10 lg:px-16 max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <Link href="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-6 text-xs font-black uppercase tracking-widest">
            <ArrowLeft className="w-4 h-4" /> Back to Shop
          </Link>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
            <div>
              <h1 className="text-5xl sm:text-7xl font-black tracking-tighter leading-none">Your<br /><span className="text-[#FF4F00]">Orders</span></h1>
            </div>
            {user && (
              <div className="flex items-center gap-3 px-5 py-3 bg-[#111] border border-[#1A1A1A] rounded-2xl">
                <Package className="w-5 h-5 text-[#FF4F00]" />
                <span className="font-black text-sm">{orders.length} Total</span>
              </div>
            )}
          </div>
        </div>

        {/* Not signed in */}
        {!user ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[#111] border border-[#1A1A1A] p-16 rounded-3xl text-center">
            <div className="max-w-xs mx-auto space-y-6">
              <div className="w-20 h-20 bg-[#1A1A1A] rounded-3xl flex items-center justify-center mx-auto">
                <ShoppingBag className="w-10 h-10 text-zinc-700" />
              </div>
              <div>
                <h2 className="text-2xl font-black">Sign In First</h2>
                <p className="text-zinc-500 text-sm mt-2">Access your order history and track deliveries.</p>
              </div>
              <button
                onClick={() => setIsAuthOpen(true)}
                className="w-full py-4 bg-[#FF4F00] text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-[#E64600] transition-all shadow-[0_8px_24px_rgba(255,79,0,0.2)]"
              >
                Sign In Now
              </button>
            </div>
          </motion.div>

        ) : orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order, i) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-[#111] border border-[#1A1A1A] hover:border-[#2A2A2A] rounded-3xl p-6 transition-all"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start gap-6">
                  <div className="flex gap-5 items-center">
                    <div className="relative w-20 h-20 bg-[#1A1A1A] rounded-2xl overflow-hidden border border-[#2A2A2A] flex-shrink-0">
                      <img src={order.shoes?.image_url || "/placeholder.png"} alt={order.shoes?.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h3 className="font-black text-lg text-white leading-tight">{order.shoes?.name || "Premium Footwear"}</h3>
                      <div className="flex items-center gap-3 mt-2 flex-wrap">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 ${order.status === "success" ? "bg-green-500/10 text-green-400" : "bg-orange-500/10 text-orange-400"}`}>
                          {order.status === "success" ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                          {order.status}
                        </span>
                        <span className="text-[10px] text-zinc-600 font-bold">#{order.id.toString().slice(-6).toUpperCase()}</span>
                        <span className="text-[10px] text-zinc-600 font-bold">{new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                      </div>
                      {(order.city || order.phone) && (
                        <div className="flex items-center gap-4 mt-2">
                          {order.city && <span className="text-[11px] text-zinc-500 flex items-center gap-1"><MapPin className="w-3 h-3" />{order.city}</span>}
                          {order.phone && <span className="text-[11px] text-zinc-500 flex items-center gap-1"><Phone className="w-3 h-3" />{order.phone}</span>}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between w-full sm:w-auto sm:flex-col sm:items-end gap-2">
                    <p className="text-3xl font-black text-[#FF4F00]">₹{order.amount.toLocaleString()}</p>
                    <span className="text-[10px] text-zinc-600 font-bold">Arriving in 3-5 days</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[#111] border border-[#1A1A1A] p-20 rounded-3xl text-center">
            <div className="max-w-xs mx-auto space-y-6">
              <div className="w-20 h-20 bg-[#1A1A1A] rounded-3xl flex items-center justify-center mx-auto">
                <Search className="w-10 h-10 text-zinc-700" />
              </div>
              <div>
                <h2 className="text-2xl font-black">No orders yet</h2>
                <p className="text-zinc-500 text-sm mt-2">Start shopping our latest collection!</p>
              </div>
              <Link href="/" className="block w-full py-4 bg-[#FF4F00] text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-[#E64600] transition-all text-center shadow-[0_8px_24px_rgba(255,79,0,0.2)]">
                Shop Now
              </Link>
            </div>
          </motion.div>
        )}

        {/* Support */}
        <div className="mt-16 p-8 bg-[#FF4F00] rounded-3xl flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h3 className="text-xl font-black">Need help with an order?</h3>
            <p className="text-orange-100 text-sm mt-1">Our support team is available 24/7 to assist you.</p>
          </div>
          <Link href="/" className="px-8 py-4 bg-white text-[#FF4F00] rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-orange-50 transition-all flex items-center gap-2 whitespace-nowrap">
            <Zap className="w-4 h-4 fill-[#FF4F00]" /> Contact Support
          </Link>
        </div>
      </div>
    </main>
  );
}
