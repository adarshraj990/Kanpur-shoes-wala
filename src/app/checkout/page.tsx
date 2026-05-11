"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShoppingBag, ShieldCheck, Truck, Lock, 
  MapPin, Phone, User, CreditCard, ArrowRight,
  ChevronLeft, Loader2
} from "lucide-react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

export default function Page() {
  const router = useRouter();
  const { cart, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    pincode: ""
  });

  useEffect(() => {
    if (cart.length === 0) {
      router.push("/");
    }
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.user_metadata?.full_name || "",
        email: user.email || ""
      }));
    }
  }, [cart, router, user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const createOrderRecord = async (paymentId: string) => {
    try {
      const { error } = await supabase.from("orders").insert([
        {
          user_id: user?.id || null,
          customer_name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          pincode: formData.pincode,
          amount: totalPrice,
          payment_id: paymentId,
          status: "paid",
          // For now, storing the first shoe ID if multiple items exist, 
          // or you might want to create an order_items table later
          shoe_id: cart[0]?.id
        }
      ]);

      if (error) throw error;
      return true;
    } catch (err) {
      console.error("Order record error:", err);
      return false;
    }
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Initialize Razorpay
      const res = await fetch("/api/razorpay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: totalPrice }),
      });
      const data = await res.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: "INR",
        name: "Kanpur Shoes Wala",
        description: "Premium Footwear Purchase",
        order_id: data.id,
        handler: async function (response: any) {
          const success = await createOrderRecord(response.razorpay_payment_id);
          if (success) {
            clearCart();
            router.push("/success");
          } else {
            alert("Payment successful but order recording failed. Please contact support.");
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },
        theme: { color: "#000000" },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Checkout error:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white font-inter selection:bg-[#FF4F00] selection:text-white pb-20">
      {/* Header */}
      <div className="pt-12 px-6 sm:px-12 max-w-[1400px] mx-auto flex items-center justify-between mb-16">
        <Link href="/" className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Store
        </Link>
        <div className="text-xl font-black tracking-tighter">
          KANPUR <span className="text-[#FF4F00]">SHOES</span> WALA
        </div>
        <div className="w-20"></div> {/* Spacer */}
      </div>

      <div className="px-6 sm:px-12 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Checkout Form */}
          <div className="lg:col-span-7 space-y-12">
            <div>
              <h1 className="text-4xl sm:text-6xl font-black tracking-tighter uppercase mb-4">Checkout</h1>
              <p className="text-zinc-500 font-medium">Complete your order by providing your shipping details.</p>
            </div>

            <form onSubmit={handleCheckout} className="space-y-10">
              {/* Shipping Information */}
              <section className="space-y-6">
                <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-[#FF4F00]">
                  <MapPin className="w-4 h-4" />
                  Shipping Information
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Full Name</label>
                    <input 
                      required name="name" value={formData.name} onChange={handleInputChange}
                      className="w-full bg-[#111] border border-[#1A1A1A] rounded-2xl px-6 py-4 focus:border-[#FF4F00] focus:ring-1 focus:ring-[#FF4F00] transition-all outline-none" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Phone Number</label>
                    <input 
                      required name="phone" value={formData.phone} onChange={handleInputChange}
                      className="w-full bg-[#111] border border-[#1A1A1A] rounded-2xl px-6 py-4 focus:border-[#FF4F00] focus:ring-1 focus:ring-[#FF4F00] transition-all outline-none" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Address</label>
                  <textarea 
                    required name="address" value={formData.address} onChange={handleInputChange} rows={3}
                    className="w-full bg-[#111] border border-[#1A1A1A] rounded-2xl px-6 py-4 focus:border-[#FF4F00] focus:ring-1 focus:ring-[#FF4F00] transition-all outline-none resize-none" 
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">City</label>
                    <input 
                      required name="city" value={formData.city} onChange={handleInputChange}
                      className="w-full bg-[#111] border border-[#1A1A1A] rounded-2xl px-6 py-4 focus:border-[#FF4F00] focus:ring-1 focus:ring-[#FF4F00] transition-all outline-none" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Pincode</label>
                    <input 
                      required name="pincode" value={formData.pincode} onChange={handleInputChange}
                      className="w-full bg-[#111] border border-[#1A1A1A] rounded-2xl px-6 py-4 focus:border-[#FF4F00] focus:ring-1 focus:ring-[#FF4F00] transition-all outline-none" 
                    />
                  </div>
                </div>
              </section>

              {/* Payment Info */}
              <section className="space-y-6 pt-6 border-t border-white/5">
                <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-[#FF4F00]">
                  <CreditCard className="w-4 h-4" />
                  Secure Payment
                </div>
                <div className="bg-[#111] border border-[#1A1A1A] rounded-[2.5rem] p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div className="space-y-1 text-center sm:text-left">
                    <p className="text-sm font-bold">Safe & Encrypted</p>
                    <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Powered by Razorpay</p>
                  </div>
                  <div className="flex gap-4 grayscale opacity-50">
                    <div className="h-6 w-10 bg-white/10 rounded"></div>
                    <div className="h-6 w-10 bg-white/10 rounded"></div>
                    <div className="h-6 w-10 bg-white/10 rounded"></div>
                  </div>
                </div>
              </section>

              <button 
                type="submit" disabled={loading}
                className="w-full py-6 bg-[#FF4F00] text-white rounded-full font-black text-sm uppercase tracking-[0.2em] hover:bg-[#E64600] transition-all shadow-[0_20px_40px_rgba(255,79,0,0.2)] flex items-center justify-center gap-3"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Pay ₹{totalPrice.toLocaleString()} <ArrowRight className="w-4 h-4" /></>}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-5">
            <div className="bg-[#111] border border-[#1A1A1A] rounded-[3rem] p-10 sticky top-12 space-y-10">
              <h3 className="text-xl font-black uppercase tracking-tight">Order Summary</h3>
              
              <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 no-scrollbar">
                {cart.map((item) => (
                  <div key={item.cartItemId} className="flex gap-6 group">
                    <div className="w-20 h-20 bg-[#1A1A1A] rounded-2xl overflow-hidden border border-[#2A2A2A] flex-shrink-0">
                      <img src={item.image_url} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <h4 className="font-bold text-white leading-tight">{item.name}</h4>
                      <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">{item.category || "Footwear"} • Size {item.selectedSize || "N/A"}</p>
                      <div className="flex justify-between items-end mt-2">
                        <p className="text-sm font-bold text-[#FF4F00]">₹{item.price.toLocaleString()}</p>
                        <p className="text-[10px] font-black text-zinc-500">Qty: {item.quantity}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4 pt-8 border-t border-white/5">
                <div className="flex justify-between text-sm font-medium text-zinc-500">
                  <span>Subtotal</span>
                  <span className="text-white">₹{totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm font-medium text-zinc-500">
                  <span>Shipping</span>
                  <span className="text-[#FF4F00] font-black uppercase tracking-widest text-[10px]">Free</span>
                </div>
                <div className="flex justify-between text-xl font-black pt-4 border-t border-white/5">
                  <span>Total</span>
                  <span className="text-[#FF4F00]">₹{totalPrice.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex flex-col gap-4 pt-4">
                <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/5">
                  <ShieldCheck className="w-5 h-5 text-[#FF4F00]" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 leading-tight">100% Authentic Product Guarantee</span>
                </div>
                <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/5">
                  <Truck className="w-5 h-5 text-[#FF4F00]" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 leading-tight">Express Delivery across India</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
