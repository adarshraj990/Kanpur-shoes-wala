"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { 
  Package, ShoppingBag, 
  Clock, CheckCircle2, ArrowLeft, Loader2, Search, MapPin, Phone
} from "lucide-react";
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
  
  // Phone Search State
  const [phoneSearch, setPhoneSearch] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (!authLoading && user) {
      fetchOrders();
    } else if (!authLoading && !user) {
      setLoading(false);
    }
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

  const handlePhoneSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneSearch.length < 10) return;

    setIsSearching(true);
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*, shoes(name, image_url, price)")
        .eq("phone", phoneSearch)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (err) {
      console.error("Search failed:", err);
      alert("No orders found for this number.");
    } finally {
      setIsSearching(false);
    }
  };

  if (authLoading || (loading && user)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505]">
        <div className="w-8 h-8 bg-[#FDE68A] animate-pulse rounded-sm shadow-[0_0_15px_#FDE68A]"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#050505] text-[#FAFAFA] font-inter selection:bg-[#FDE68A] selection:text-black">
      <Navbar onCartClick={() => setIsCartOpen(true)} onAuthClick={() => setIsAuthOpen(true)} />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />

      <div className="pt-32 pb-24 px-6 sm:px-12 max-w-[1200px] mx-auto relative z-10">
        {/* Header */}
        <div className="mb-16">
          <Link href="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-[#FDE68A] transition-colors mb-8 text-[10px] font-bold uppercase tracking-[0.2em]">
            <ArrowLeft className="w-3 h-3" /> Return to Shop
          </Link>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
            <h1 className="text-4xl sm:text-6xl font-black tracking-tighter uppercase leading-[0.9] text-white">Order<br /><span className="text-gradient-gold">History.</span></h1>
            
            {/* Find by Phone Section */}
            {!user && orders.length === 0 && (
              <div className="w-full md:w-auto">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#FDE68A] mb-3">Track Guest Order</p>
                <form onSubmit={handlePhoneSearch} className="relative group">
                  <input 
                    type="tel" 
                    placeholder="Mobile Number" 
                    value={phoneSearch}
                    onChange={(e) => setPhoneSearch(e.target.value)}
                    className="w-full md:w-80 bg-[#0a0a0a] border border-white/10 rounded-full px-6 py-4 text-sm font-bold text-white focus:outline-none focus:border-[#FDE68A] focus:ring-1 focus:ring-[#FDE68A] transition-all placeholder:text-zinc-600"
                  />
                  <button 
                    disabled={isSearching}
                    className="absolute right-2 top-2 p-2 bg-[#FDE68A] rounded-full hover:bg-[#D97706] transition-colors disabled:opacity-50"
                  >
                    {isSearching ? <Loader2 className="w-5 h-5 animate-spin text-black" /> : <Search className="w-5 h-5 text-black" />}
                  </button>
                </form>
              </div>
            )}

            {orders.length > 0 && (
              <div className="flex items-center gap-4 bg-white/5 border border-white/10 px-6 py-4 rounded-full shadow-[0_0_15px_rgba(253,230,138,0.05)]">
                <Package className="w-4 h-4 text-[#FDE68A]" />
                <span className="font-bold text-sm uppercase tracking-widest text-white">{orders.length} Orders</span>
                {phoneSearch && (
                  <button onClick={() => {setOrders([]); setPhoneSearch("");}} className="ml-4 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 hover:text-[#FDE68A]">Clear</button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Orders List */}
        {!user && orders.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[#0a0a0a] border border-white/10 p-16 rounded-[2.5rem] text-center shadow-[0_0_30px_rgba(0,0,0,0.5)]">
            <div className="max-w-sm mx-auto flex flex-col items-center gap-6">
              <ShoppingBag className="w-12 h-12 text-zinc-600" />
              <div>
                <h2 className="text-2xl font-black uppercase tracking-tighter text-white">No Active Orders</h2>
                <p className="text-zinc-500 text-sm mt-3 font-medium">Log in to your account or search via phone number to view past orders.</p>
              </div>
              <button
                onClick={() => setIsAuthOpen(true)}
                className="w-full py-4 mt-4 bg-[#FDE68A] text-black rounded-full font-bold text-xs uppercase tracking-[0.2em] hover:bg-[#D97706] hover:scale-[1.02] transition-all shadow-[0_0_15px_rgba(253,230,138,0.2)]"
              >
                Access Account
              </button>
            </div>
          </motion.div>
        ) : orders.length > 0 ? (
          <div className="space-y-6">
            {orders.map((order, i) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 shadow-[0_0_30px_rgba(0,0,0,0.3)] hover:border-[#FDE68A]/30 transition-colors group"
              >
                <div className="flex gap-6 items-center w-full md:w-auto">
                  <div className="relative w-24 h-24 bg-[#050505] rounded-2xl border border-white/5 overflow-hidden flex-shrink-0">
                    <img 
                      src={order.shoes?.image_url || "/placeholder.png"} 
                      alt={order.shoes?.name} 
                      className="w-full h-full object-cover mix-blend-screen opacity-90 group-hover:scale-110 transition-transform duration-700" 
                    />
                  </div>
                  <div className="flex flex-col gap-3">
                    <h3 className="font-bold text-lg text-white uppercase tracking-tight group-hover:text-[#FDE68A] transition-colors">{order.shoes?.name || "Premium Footwear"}</h3>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Order #{order.id.toString().slice(-6).toUpperCase()}</span>
                      <span className="w-1 h-1 bg-zinc-600 rounded-full" />
                      <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">{new Date(order.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xs text-zinc-500 font-medium flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{order.city}</span>
                      <span className="text-xs text-zinc-500 font-medium flex items-center gap-1"><Phone className="w-3.5 h-3.5" />{order.phone}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto pt-6 md:pt-0 border-t md:border-t-0 border-white/5 gap-4">
                  <div className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 border ${
                    order.status === 'success' ? 'bg-[#FDE68A]/10 border-[#FDE68A]/20 text-[#FDE68A]' : 'bg-orange-500/10 border-orange-500/20 text-orange-400'
                  }`}>
                    {order.status === 'success' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                    {order.status === 'success' ? 'Confirmed' : order.status}
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-white">₹{order.amount.toLocaleString()}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-[#0a0a0a] rounded-[2.5rem] border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
             <Search className="w-10 h-10 text-zinc-600 mx-auto mb-6" />
             <p className="text-zinc-500 font-bold uppercase tracking-widest text-sm">No match found.</p>
          </div>
        )}
      </div>
    </main>
  );
}
