"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import {
  Package, ShoppingBag,
  Clock, CheckCircle2, ArrowLeft, Loader2, Search, MapPin, Phone, ChevronRight
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
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-6 h-6 bg-black animate-pulse rounded-sm" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white text-[#111] selection:bg-black selection:text-white">
      <Navbar onCartClick={() => setIsCartOpen(true)} onAuthClick={() => setIsAuthOpen(true)} />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />

      <div className="pt-[100px] md:pt-[116px] pb-24 px-5 sm:px-10 max-w-[1100px] mx-auto">

        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#999] hover:text-black transition-colors mb-8"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Return to Shop
        </Link>

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#999] block mb-2">Account</span>
            <h1 className="text-[3rem] font-black tracking-tight text-black leading-tight">Order History</h1>
          </div>

          {/* Guest phone search */}
          {!user && orders.length === 0 && (
            <div className="w-full md:w-auto">
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#555] mb-2">Track Guest Order</p>
              <form onSubmit={handlePhoneSearch} className="relative flex items-center gap-2">
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#aaa]" />
                  <input
                    type="tel"
                    placeholder="Mobile Number"
                    value={phoneSearch}
                    onChange={(e) => setPhoneSearch(e.target.value)}
                    className="ksw-search pr-4"
                    style={{ paddingLeft: "36px", width: "260px" }}
                  />
                </div>
                <button
                  disabled={isSearching}
                  className="btn-pill btn-pill-dark py-2.5 px-5 flex items-center gap-1.5"
                >
                  {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                  Find
                </button>
              </form>
            </div>
          )}

          {orders.length > 0 && (
            <div className="flex items-center gap-2 bg-[#f7f7f7] border border-[#efefef] px-4 py-2.5 rounded-full">
              <Package className="w-4 h-4 text-[#555]" />
              <span className="text-[12px] font-bold text-[#555]">{orders.length} Order{orders.length !== 1 ? "s" : ""}</span>
              {phoneSearch && (
                <button
                  onClick={() => { setOrders([]); setPhoneSearch(""); }}
                  className="ml-2 text-[11px] font-bold text-[#999] hover:text-black transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
          )}
        </div>

        {/* Orders Content */}
        {!user && orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#f7f7f7] rounded-[24px] p-16 text-center"
          >
            <div className="max-w-sm mx-auto flex flex-col items-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-white border border-[#e5e5e5] flex items-center justify-center">
                <ShoppingBag className="w-7 h-7 text-[#ccc]" strokeWidth={1.5} />
              </div>
              <div>
                <h2 className="text-[20px] font-black text-black">No Active Orders</h2>
                <p className="text-[#999] text-[13px] mt-2">Log in or search by phone number to view past orders.</p>
              </div>
              <button
                onClick={() => setIsAuthOpen(true)}
                className="btn-pill btn-pill-dark py-3.5 px-8 mt-2"
              >
                Sign In
              </button>
            </div>
          </motion.div>
        ) : orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order, i) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="bg-white border border-[#efefef] rounded-[20px] p-5 md:p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:border-[#ddd] hover:shadow-sm transition-all group"
              >
                <div className="flex gap-5 items-center w-full md:w-auto">
                  <div className="relative w-[80px] h-[80px] bg-[#f7f7f7] rounded-[14px] overflow-hidden shrink-0">
                    <img
                      src={order.shoes?.image_url || "/placeholder.png"}
                      alt={order.shoes?.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="font-bold text-[15px] text-black">{order.shoes?.name || "Premium Footwear"}</h3>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-bold text-[#999] uppercase tracking-wider">
                        #{order.id.toString().slice(-6).toUpperCase()}
                      </span>
                      <span className="w-1 h-1 bg-[#ddd] rounded-full" />
                      <span className="text-[10px] text-[#999]">
                        {new Date(order.created_at).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-[12px] text-[#777] flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />{order.city}
                      </span>
                      <span className="text-[12px] text-[#777] flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5" />{order.phone}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-3 pt-4 md:pt-0 border-t md:border-t-0 border-[#efefef]">
                  <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    order.status === "success"
                      ? "bg-green-50 text-green-600"
                      : "bg-orange-50 text-orange-500"
                  }`}>
                    {order.status === "success"
                      ? <CheckCircle2 className="w-3.5 h-3.5" />
                      : <Clock className="w-3.5 h-3.5" />}
                    {order.status === "success" ? "Confirmed" : order.status}
                  </div>
                  <span className="text-[20px] font-black text-black">₹{order.amount.toLocaleString()}</span>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-[#f7f7f7] rounded-[24px]">
            <Search className="w-10 h-10 text-[#ccc] mx-auto mb-4" />
            <p className="text-[14px] font-medium text-[#aaa]">No matching orders found.</p>
          </div>
        )}
      </div>
    </main>
  );
}
