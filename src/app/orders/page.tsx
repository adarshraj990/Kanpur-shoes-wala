/* MASTER_LOG - APRIL 28, 2026 
- Project Status: Customer Experience.
- Last Action: Created premium Order History page for customers.
- Status: Secure /orders route active, Order tracking live for users.
*/

"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Package, ShoppingBag, ChevronRight, 
  Clock, CheckCircle2, ArrowLeft, Loader2, Search
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

  if (authLoading || (loading && user)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-10 h-10 animate-spin text-zinc-900" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#F9F9F9]">
      <Navbar onCartClick={() => setIsCartOpen(true)} onAuthClick={() => setIsAuthOpen(true)} />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />

      <div className="pt-32 pb-20 px-6 sm:px-10 lg:px-20 max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <Link href="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-zinc-900 transition-colors mb-4 text-xs font-bold uppercase tracking-widest">
              <ArrowLeft className="w-4 h-4" />
              Back to Shop
            </Link>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tighter text-zinc-900">Your Orders</h1>
          </div>
          <div className="px-5 py-3 bg-white rounded-2xl border border-zinc-100 shadow-sm flex items-center gap-3">
            <Package className="w-5 h-5 text-zinc-400" />
            <span className="font-bold text-sm">{orders.length} Total Orders</span>
          </div>
        </div>

        {!user ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-12 rounded-[3rem] text-center border border-zinc-100 shadow-sm"
          >
            <div className="max-w-xs mx-auto space-y-6">
              <div className="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center mx-auto text-zinc-300">
                <ShoppingBag className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-bold">Please sign in</h2>
              <p className="text-zinc-500 text-sm">Sign in to your account to view your order history and track your deliveries.</p>
              <button 
                onClick={() => setIsAuthOpen(true)}
                className="w-full py-4 bg-zinc-900 text-white rounded-full font-bold text-sm hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-200"
              >
                Sign In Now
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
                transition={{ delay: i * 0.05 }}
                className="group bg-white p-6 sm:p-8 rounded-[2.5rem] border border-zinc-100 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                  <div className="flex gap-6 items-center">
                    <div className="relative w-20 h-20 bg-zinc-50 rounded-2xl overflow-hidden border border-zinc-50 flex-shrink-0">
                      <img 
                        src={order.shoes?.image_url || "/placeholder.png"} 
                        alt={order.shoes?.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-bold text-lg text-zinc-900">{order.shoes?.name || "Premium Footwear"}</h3>
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1 ${
                          order.status === 'success' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'
                        }`}>
                          {order.status === 'success' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                          {order.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-xs font-medium text-zinc-400">
                        <span>Ordered on {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        <span>•</span>
                        <span>ID: #{order.id.toString().slice(-6).toUpperCase()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between w-full sm:w-auto sm:block text-right space-y-1">
                    <p className="text-xs font-bold uppercase tracking-widest text-zinc-400 sm:mb-1">Amount Paid</p>
                    <p className="text-2xl font-black text-zinc-900">₹{order.amount.toLocaleString()}</p>
                  </div>
                </div>
                
                <div className="mt-8 pt-8 border-t border-zinc-50 flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="flex items-center gap-6">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-300">Delivery Status</span>
                      <span className="text-sm font-bold text-zinc-600">Arriving in 3-5 days</span>
                    </div>
                  </div>
                  <button className="w-full sm:w-auto px-8 py-3 bg-zinc-50 hover:bg-zinc-100 text-zinc-900 rounded-full font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                    Order Details
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-20 rounded-[3rem] text-center border border-zinc-100 shadow-sm"
          >
            <div className="max-w-xs mx-auto space-y-6">
              <div className="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center mx-auto text-zinc-300">
                <Search className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-bold">No orders found</h2>
              <p className="text-zinc-500 text-sm">You haven't placed any orders yet. Start shopping our latest collection!</p>
              <Link 
                href="/"
                className="block w-full py-4 bg-zinc-900 text-white rounded-full font-bold text-sm hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-200"
              >
                Shop Now
              </Link>
            </div>
          </motion.div>
        )}

        {/* Support Section */}
        <div className="mt-20 p-10 bg-zinc-900 rounded-[3rem] text-white flex flex-col md:flex-row justify-between items-center gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-2">Need help with an order?</h3>
            <p className="text-zinc-400 text-sm">Our support team is available 24/7 to assist you.</p>
          </div>
          <button className="px-10 py-4 bg-white text-zinc-900 rounded-full font-bold text-sm hover:bg-zinc-100 transition-all shadow-xl">
            Contact Support
          </button>
        </div>
      </div>
    </main>
  );
}
