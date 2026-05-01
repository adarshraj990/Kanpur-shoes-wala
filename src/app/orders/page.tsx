"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Package, ShoppingBag, ChevronRight, 
  Clock, CheckCircle2, ArrowLeft, Loader2, Search, MapPin, Phone, Zap 
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
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
            <div>
              <h1 className="text-5xl sm:text-7xl font-black tracking-tighter leading-none">Your<br /><span className="text-[#FF4F00]">Orders</span></h1>
            </div>
            
            {/* Find by Phone Section */}
            {!user && orders.length === 0 && (
              <div className="w-full sm:w-auto mt-4 sm:mt-0">
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-3">Guest? Find your orders</p>
                <form onSubmit={handlePhoneSearch} className="relative group">
                  <input 
                    type="tel" 
                    placeholder="Enter Phone Number" 
                    value={phoneSearch}
                    onChange={(e) => setPhoneSearch(e.target.value)}
                    className="w-full sm:w-72 bg-[#111] border border-[#1A1A1A] rounded-2xl px-5 py-4 text-sm font-bold focus:outline-none focus:border-[#FF4F00] transition-all"
                  />
                  <button 
                    disabled={isSearching}
                    className="absolute right-2 top-2 p-2.5 bg-[#FF4F00] rounded-xl hover:bg-[#E64600] transition-colors disabled:opacity-50"
                  >
                    {isSearching ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : <Search className="w-4 h-4 text-white" />}
                  </button>
                </form>
              </div>
            )}

            {orders.length > 0 && (
              <div className="flex items-center gap-3 px-5 py-3 bg-[#111] border border-[#1A1A1A] rounded-2xl">
                <Package className="w-5 h-5 text-[#FF4F00]" />
                <span className="font-black text-sm">{orders.length} Total</span>
                {phoneSearch && (
                  <button onClick={() => {setOrders([]); setPhoneSearch("");}} className="ml-2 text-[10px] font-black uppercase text-zinc-500 hover:text-white">Clear</button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Orders List */}
        {!user && orders.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[#111] border border-[#1A1A1A] p-16 rounded-[3rem] text-center">
            <div className="max-w-xs mx-auto space-y-6">
              <div className="w-20 h-20 bg-[#1A1A1A] rounded-3xl flex items-center justify-center mx-auto text-zinc-700">
                <ShoppingBag className="w-10 h-10" />
              </div>
              <div>
                <h2 className="text-2xl font-black italic">No History Found</h2>
                <p className="text-zinc-500 text-sm mt-2">Sign in or use your phone number above to find your premium orders.</p>
              </div>
              <button
                onClick={() => setIsAuthOpen(true)}
                className="w-full py-4 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-zinc-200 transition-all shadow-xl shadow-white/5"
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
                className="bg-[#111] border border-[#1A1A1A] hover:border-[#2A2A2A] rounded-3xl p-6 transition-all group"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start gap-6">
                  <div className="flex gap-5 items-center">
                    <div className="relative w-24 h-24 bg-[#1A1A1A] rounded-2xl overflow-hidden border border-[#2A2A2A] flex-shrink-0">
                      <img 
                        src={order.shoes?.image_url || "/placeholder.png"} 
                        alt={order.shoes?.name} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                      />
                    </div>
                    <div>
                      <h3 className="font-black text-xl text-white leading-tight">{order.shoes?.name || "Premium Footwear"}</h3>
                      <div className="flex items-center gap-3 mt-3 flex-wrap">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 ${
                          order.status === 'success' ? 'bg-green-500/10 text-green-400' : 'bg-orange-500/10 text-orange-400'
                        }`}>
                          {order.status === 'success' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                          {order.status}
                        </span>
                        <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest bg-[#1A1A1A] px-2.5 py-1 rounded-lg">ID: #{order.id.toString().slice(-6).toUpperCase()}</span>
                        <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">{new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      </div>
                      <div className="flex items-center gap-4 mt-3">
                        <span className="text-[11px] text-zinc-500 flex items-center gap-1"><MapPin className="w-3 h-3" />{order.city}</span>
                        <span className="text-[11px] text-zinc-500 flex items-center gap-1"><Phone className="w-3 h-3" />{order.phone}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between w-full sm:w-auto sm:flex-col sm:items-end gap-2 pt-4 sm:pt-0 border-t sm:border-0 border-[#1A1A1A]">
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Amount Paid</p>
                    <p className="text-3xl font-black text-[#FF4F00]">₹{order.amount.toLocaleString()}</p>
                    <span className="text-[10px] text-green-500 font-black uppercase tracking-widest bg-green-500/5 px-3 py-1 rounded-lg mt-2">Free Delivery</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-[#111] rounded-[3rem] border border-[#1A1A1A]">
             <Package className="w-12 h-12 text-zinc-800 mx-auto mb-4" />
             <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">No results found for this search.</p>
          </div>
        )}

        {/* Support Section */}
        <div className="mt-16 p-8 bg-[#FF4F00] rounded-3xl flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-black italic">Need help with an order?</h3>
            <p className="text-orange-100 text-sm mt-1 font-medium">Our support team is available 24/7 to assist you.</p>
          </div>
          <Link href="/" className="px-10 py-4 bg-white text-[#FF4F00] rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-orange-50 transition-all flex items-center gap-2 whitespace-nowrap shadow-xl">
            <Zap className="w-4 h-4 fill-[#FF4F00]" /> Contact Support
          </Link>
        </div>
      </div>
    </main>
  );
}
