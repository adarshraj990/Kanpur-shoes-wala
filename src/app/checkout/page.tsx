/* MASTER_LOG - APRIL 27, 2026 
- Project Status: Payment Gateway Implementation.
- Last Action: Checkout UI ready, Razorpay logic scaffolded with placeholders.
- Pending Tasks: Paste real Razorpay keys, Implement Order Confirmation Email.
*/

"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, CreditCard, ShieldCheck, Truck, Loader2, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Script from "next/script";
import Image from "next/image";

export default function CheckoutPage() {
  const { cart, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  // Form State
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  });

  const [loading, setLoading] = useState(false);
  const [isMockMode, setIsMockMode] = useState(true); // TOGGLE THIS FOR PRODUCTION

  // Razorpay Key Placeholder
  const RAZORPAY_KEY_ID = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_YOUR_KEY_HERE";

  useEffect(() => {
    if (cart.length === 0) {
      router.push("/");
    }
  }, [cart, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const createOrderRecord = async (paymentId: string) => {
    try {
      // Add each item in cart as an order entry (or handle as batch)
      const orderEntries = cart.map(item => ({
        product_id: item.id,
        amount: item.price * item.quantity,
        customer_name: formData.fullName,
        status: "success",
        created_at: new Date().toISOString(),
      }));

      const { error } = await supabase.from("orders").insert(orderEntries);
      if (error) throw error;
      
      clearCart();
      router.push("/success");
    } catch (err) {
      console.error("Error saving order:", err);
      alert("Order saved locally but failed to sync with database.");
    }
  };

  const handlePayment = async () => {
    if (!formData.fullName || !formData.phone || !formData.address) {
      alert("Please fill in all delivery details.");
      return;
    }

    setLoading(true);

    if (isMockMode) {
      // Simulate Razorpay Delay
      setTimeout(() => {
        setLoading(false);
        createOrderRecord("MOCK_PAYMENT_ID_" + Date.now());
      }, 2000);
      return;
    }

    // PRODUCTION RAZORPAY LOGIC
    const options = {
      key: RAZORPAY_KEY_ID,
      amount: totalPrice * 100, // Amount in paise
      currency: "INR",
      name: "Kanpur Shoes Wala",
      description: "Direct-to-Consumer Shoes",
      handler: function (response: any) {
        createOrderRecord(response.razorpay_payment_id);
      },
      prefill: {
        name: formData.fullName,
        contact: formData.phone,
        email: user?.email || "",
      },
      theme: {
        color: "#09090b",
      },
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.open();
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#F9F9F9] pt-24 pb-20 px-6 sm:px-10 lg:px-20">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      
      <div className="max-w-6xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-zinc-900 transition-colors mb-10 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Shopping
        </Link>

        <h1 className="text-4xl sm:text-5xl font-bold tracking-tighter text-zinc-900 mb-12">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left Column: Delivery Form */}
          <div className="space-y-12">
            <section className="space-y-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center text-white">
                  <Truck className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold">Delivery Details</h2>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Full Name</label>
                  <input
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-5 py-4 bg-white border border-zinc-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-zinc-900 transition-all shadow-sm"
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Phone Number</label>
                    <input
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-5 py-4 bg-white border border-zinc-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-zinc-900 transition-all shadow-sm"
                      placeholder="+91"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">PIN Code</label>
                    <input
                      name="pincode"
                      required
                      value={formData.pincode}
                      onChange={handleInputChange}
                      className="w-full px-5 py-4 bg-white border border-zinc-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-zinc-900 transition-all shadow-sm"
                      placeholder="6-digit code"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Full Address</label>
                  <textarea
                    name="address"
                    required
                    rows={4}
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-5 py-4 bg-white border border-zinc-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-zinc-900 transition-all shadow-sm"
                    placeholder="Street, Landmark, Area..."
                  />
                </div>
              </div>
            </section>

            <div className="p-6 bg-zinc-50 border border-zinc-100 rounded-3xl flex items-center gap-4">
              <ShieldCheck className="w-8 h-8 text-zinc-900" />
              <div>
                <h4 className="font-bold text-sm">Secure Checkout</h4>
                <p className="text-xs text-zinc-500">Your payment information is encrypted and processed by Razorpay.</p>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="bg-white p-8 sm:p-12 rounded-[2.5rem] shadow-sm border border-zinc-100 h-fit sticky top-32">
            <h2 className="text-xl font-bold mb-8">Order Summary</h2>
            
            <div className="space-y-6 mb-10 max-h-[300px] overflow-y-auto no-scrollbar">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="relative w-16 h-16 bg-zinc-50 rounded-xl overflow-hidden flex-shrink-0">
                    <Image src={item.image_url} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="flex-grow flex justify-between items-center">
                    <div>
                      <h3 className="text-sm font-medium text-zinc-900 leading-tight">{item.name}</h3>
                      <p className="text-xs text-zinc-500 mt-0.5">Quantity: {item.quantity}</p>
                    </div>
                    <span className="font-bold text-sm">₹{item.price.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4 pt-8 border-t border-zinc-100">
              <div className="flex justify-between items-center text-sm text-zinc-500">
                <span>Shipping</span>
                <span className="text-green-600 font-bold uppercase tracking-widest text-[10px]">Free</span>
              </div>
              <div className="flex justify-between items-center text-2xl font-black pt-2">
                <span className="text-zinc-900">Total</span>
                <span className="text-zinc-900">₹{totalPrice.toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={handlePayment}
              disabled={loading}
              className="w-full mt-10 py-5 bg-zinc-900 text-white rounded-full font-bold text-lg flex items-center justify-center gap-3 hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-200 active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  <CreditCard className="w-5 h-5" />
                  {isMockMode ? "Test Payment" : "Pay Now"}
                </>
              )}
            </button>

            {isMockMode && (
              <div className="mt-4 text-center">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-orange-500 bg-orange-50 py-2 rounded-lg">
                  🚧 Development Mode: Payment will be simulated
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
