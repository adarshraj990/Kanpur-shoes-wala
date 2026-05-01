"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, CreditCard, ShieldCheck, Truck, Loader2, Package, Zap } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Script from "next/script";
import Image from "next/image";

const inputCls = "w-full px-5 py-4 bg-[#111] border border-[#2A2A2A] rounded-2xl text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-[#FF4F00] transition-colors font-medium";
const labelCls = "text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500";

export default function CheckoutPage() {
  const { cart, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({ fullName: "", phone: "", address: "", city: "", pincode: "" });
  const [loading, setLoading] = useState(false);

  const RAZORPAY_KEY_ID = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_SjFNmFxvcYnqxU";

  useEffect(() => {
    if (cart.length === 0) router.push("/");
  }, [cart, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const createOrderRecord = async (paymentId: string) => {
    try {
      const orderEntries = cart.map(item => ({
        product_id: item.id,
        user_id: user?.id || null,
        amount: item.price * item.quantity,
        customer_name: formData.fullName,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        pincode: formData.pincode,
        status: "success",
        created_at: new Date().toISOString(),
      }));

      const { error } = await supabase.from("orders").insert(orderEntries);
      if (error) throw error;
      clearCart();
      router.push("/success");
    } catch (err) {
      console.error("Error saving order:", err);
      alert("Order placed but failed to sync. Contact support.");
    }
  };

  const handlePayment = async () => {
    if (!formData.fullName || !formData.phone || !formData.address || !formData.city || !formData.pincode) {
      alert("Please fill all delivery details.");
      return;
    }
    setLoading(true);

    const options = {
      key: RAZORPAY_KEY_ID,
      amount: totalPrice * 100,
      currency: "INR",
      name: "Kanpur Shoes Wala",
      description: "Handcrafted Premium Footwear",
      handler: function (response: any) {
        createOrderRecord(response.razorpay_payment_id);
      },
      prefill: { name: formData.fullName, contact: formData.phone, email: user?.email || "" },
      theme: { color: "#FF4F00" },
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.on("payment.failed", () => { setLoading(false); alert("Payment failed. Please try again."); });
    rzp.open();
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white pt-8 pb-20 px-4 sm:px-8 lg:px-16">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />

      <div className="max-w-6xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-10 text-xs font-bold uppercase tracking-widest">
          <ArrowLeft className="w-4 h-4" /> Back to Shop
        </Link>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tighter mb-12">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8">
          {/* Left: Delivery Form */}
          <div className="space-y-6">
            <div className="bg-[#111] border border-[#1A1A1A] rounded-3xl p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-[#FF4F00] rounded-xl flex items-center justify-center">
                  <Truck className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-lg font-black uppercase tracking-widest">Delivery Details</h2>
              </div>

              <div className="space-y-5">
                <div className="space-y-2">
                  <label className={labelCls}>Full Name</label>
                  <input name="fullName" value={formData.fullName} onChange={handleInputChange} className={inputCls} placeholder="Your Full Name" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className={labelCls}>Phone Number</label>
                    <input name="phone" value={formData.phone} onChange={handleInputChange} className={inputCls} placeholder="+91" />
                  </div>
                  <div className="space-y-2">
                    <label className={labelCls}>PIN Code</label>
                    <input name="pincode" value={formData.pincode} onChange={handleInputChange} className={inputCls} placeholder="6-digit code" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className={labelCls}>Full Address</label>
                  <textarea name="address" rows={3} value={formData.address} onChange={handleInputChange} className={inputCls + " resize-none"} placeholder="Street, Landmark, Area..." />
                </div>

                <div className="space-y-2">
                  <label className={labelCls}>City</label>
                  <input name="city" value={formData.city} onChange={handleInputChange} className={inputCls} placeholder="City Name" />
                </div>
              </div>
            </div>

            <div className="bg-[#111] border border-[#1A1A1A] rounded-3xl p-5 flex items-center gap-4">
              <ShieldCheck className="w-8 h-8 text-[#FF4F00] flex-shrink-0" />
              <div>
                <h4 className="font-black text-sm">100% Secure Checkout</h4>
                <p className="text-xs text-zinc-500 mt-0.5">Payment encrypted & processed by Razorpay. Your data is safe.</p>
              </div>
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="bg-[#111] border border-[#1A1A1A] rounded-3xl p-6 sm:p-8 h-fit sticky top-6">
            <h2 className="text-sm font-black uppercase tracking-widest text-zinc-400 mb-6">Order Summary</h2>

            <div className="space-y-4 mb-6 max-h-[260px] overflow-y-auto pr-1 no-scrollbar">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-4 items-center">
                  <div className="relative w-16 h-16 bg-[#1A1A1A] rounded-xl overflow-hidden flex-shrink-0 border border-[#2A2A2A]">
                    <Image src={item.image_url} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-white truncate">{item.name}</h3>
                    <p className="text-xs text-zinc-500 mt-0.5">Qty: {item.quantity}</p>
                  </div>
                  <span className="font-black text-sm text-[#FF4F00] flex-shrink-0">₹{(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>

            <div className="space-y-3 pt-6 border-t border-[#1A1A1A]">
              <div className="flex justify-between text-sm text-zinc-500">
                <span>Shipping</span>
                <span className="text-green-400 font-black text-[10px] uppercase tracking-widest">Free</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-zinc-400 text-sm font-bold">Total</span>
                <span className="text-3xl font-black text-white">₹{totalPrice.toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={handlePayment}
              disabled={loading}
              className="w-full mt-8 py-5 bg-[#FF4F00] text-white rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-[#E64600] transition-all shadow-[0_16px_32px_rgba(255,79,0,0.2)] active:scale-[0.98] disabled:opacity-40"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Zap className="w-5 h-5 fill-white" />Pay ₹{totalPrice.toLocaleString()}</>}
            </button>

            <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-zinc-600 font-bold uppercase tracking-widest">
              <Package className="w-3 h-3" /> Free shipping • 7 day returns
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
