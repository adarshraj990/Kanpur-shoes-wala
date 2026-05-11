"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, ShieldCheck, Loader2, Lock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Script from "next/script";
import Image from "next/image";

const inputCls = "w-full px-4 py-4 bg-[#0a0a0a] border-b-2 border-white/10 focus:outline-none focus:bg-white/5 focus:border-[#FDE68A] transition-all text-sm font-bold text-white placeholder:text-zinc-600 placeholder:font-medium";
const labelCls = "text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-2 block";

export default function CheckoutPage() {
  const { cart, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({ fullName: "", phone: "", address: "", city: "", pincode: "" });
  const [loading, setLoading] = useState(false);

  const RAZORPAY_KEY_ID = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_live_Skn8pohIYICSOS";

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
        payment_id: paymentId,
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
      name: "KANPUR SHOES WALA",
      description: "Premium Footwear Collection",
      handler: function (response: any) {
        createOrderRecord(response.razorpay_payment_id);
      },
      prefill: { name: formData.fullName, contact: formData.phone, email: user?.email || "" },
      theme: { color: "#FDE68A" },
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.on("payment.failed", () => { setLoading(false); alert("Payment failed. Please try again."); });
    rzp.open();
    setLoading(false);
  };

  if (cart.length === 0) return null;

  return (
    <div className="min-h-screen bg-[#050505] text-[#FAFAFA] pt-12 pb-24 px-6 sm:px-12 selection:bg-[#FDE68A] selection:text-black">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />

      <div className="max-w-[1200px] mx-auto relative z-10">
        <Link href="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-[#FDE68A] transition-colors mb-12 text-[10px] font-bold uppercase tracking-[0.2em]">
          <ArrowLeft className="w-3 h-3" /> Return to Shop
        </Link>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-16">
          <h1 className="text-4xl sm:text-6xl font-black tracking-tighter uppercase text-white">Secure<br /><span className="text-gradient-gold">Checkout.</span></h1>
          <div className="flex items-center gap-2 text-[#FDE68A]/70 text-xs font-bold uppercase tracking-[0.2em] bg-[#FDE68A]/10 px-4 py-2 rounded-full border border-[#FDE68A]/20">
            <Lock className="w-4 h-4" /> 256-bit Encryption
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
          
          {/* Left: Form */}
          <div className="lg:col-span-7 space-y-12">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-[0.2em] mb-8 pb-4 border-b border-white/5 text-white">Shipping Details</h2>
              
              <div className="space-y-6">
                <div>
                  <label className={labelCls}>Full Legal Name</label>
                  <input name="fullName" value={formData.fullName} onChange={handleInputChange} className={inputCls} placeholder="John Doe" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className={labelCls}>Mobile Number</label>
                    <input name="phone" value={formData.phone} onChange={handleInputChange} className={inputCls} placeholder="+91" />
                  </div>
                  <div>
                    <label className={labelCls}>Postal Code</label>
                    <input name="pincode" value={formData.pincode} onChange={handleInputChange} className={inputCls} placeholder="6-digit PIN" />
                  </div>
                </div>

                <div>
                  <label className={labelCls}>Delivery Address</label>
                  <textarea name="address" rows={2} value={formData.address} onChange={handleInputChange} className={inputCls + " resize-none"} placeholder="Street, Apartment, Locality..." />
                </div>

                <div>
                  <label className={labelCls}>City / District</label>
                  <input name="city" value={formData.city} onChange={handleInputChange} className={inputCls} placeholder="e.g. Kanpur" />
                </div>
              </div>
            </div>

            <div className="bg-white/5 p-6 rounded-3xl flex items-start gap-4 border border-white/10">
              <ShieldCheck className="w-6 h-6 text-[#FDE68A] shrink-0" />
              <div>
                <h4 className="font-bold text-sm uppercase tracking-[0.1em] mb-1 text-white">Buyer Protection</h4>
                <p className="text-xs text-zinc-400 font-medium leading-relaxed">Your payment information is processed securely through Razorpay. We do not store credit card details.</p>
              </div>
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-5 relative">
            <div className="sticky top-12 bg-[#0a0a0a] p-8 rounded-[2.5rem] border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
              <h2 className="text-sm font-bold uppercase tracking-[0.2em] mb-8 text-white">Order Summary</h2>

              <div className="space-y-6 mb-8 max-h-[300px] overflow-y-auto pr-2 no-scrollbar">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="relative w-20 h-20 bg-[#050505] rounded-2xl border border-white/5 overflow-hidden shrink-0">
                      <Image src={item.image_url} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex flex-col justify-center flex-1">
                      <h3 className="text-xs font-bold uppercase tracking-tight line-clamp-1 text-white">{item.name}</h3>
                      <p className="text-[10px] text-[#FDE68A] font-bold uppercase tracking-widest mt-1 bg-[#FDE68A]/10 w-fit px-2 py-0.5 rounded">Qty {item.quantity}</p>
                      <span className="font-black text-sm mt-2 text-white">₹{(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4 pt-6 border-t border-white/10">
                <div className="flex justify-between items-center text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
                  <span>Subtotal</span>
                  <span className="text-white">₹{totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
                  <span>Shipping</span>
                  <span className="text-[#FDE68A]">Complimentary</span>
                </div>
                <div className="flex justify-between items-end pt-4 border-t border-white/10 mt-4">
                  <span className="text-sm font-bold uppercase tracking-[0.2em] text-white">Total Due</span>
                  <span className="text-3xl font-black text-white">₹{totalPrice.toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={handlePayment}
                disabled={loading}
                className="w-full mt-10 py-5 bg-[#FDE68A] text-black rounded-full font-bold text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-[#D97706] transition-all shadow-[0_0_15px_rgba(253,230,138,0.2)] hover:scale-[1.02] disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Pay Securely <ArrowRight className="w-4 h-4" /></>}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
