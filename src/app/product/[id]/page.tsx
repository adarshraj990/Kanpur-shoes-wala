/* MASTER_LOG - APRIL 27, 2026 
- Project Status: Advanced E-commerce Features.
- Last Action: Created high-end Product Detail Page with image gallery.
*/

"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, ShoppingBag, ShieldCheck, 
  Truck, RotateCcw, Loader2, ChevronRight, ChevronLeft 
} from "lucide-react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import Navbar from "@/components/Navbar";
import CartDrawer from "@/components/CartDrawer";
import AuthModal from "@/components/AuthModal";
import ReviewSection from "@/components/ReviewSection";
import SuggestedProducts from "@/components/SuggestedProducts";

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const [shoe, setShoe] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  useEffect(() => {
    const fetchShoe = async () => {
      try {
        const { data, error } = await supabase
          .from("shoes")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;
        setShoe(data);
      } catch (err) {
        console.error("Error fetching product:", err);
        router.push("/");
      } finally {
        setLoading(false);
      }
    };

    fetchShoe();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-10 h-10 animate-spin text-zinc-900" />
      </div>
    );
  }

  const gallery = shoe.image_urls && shoe.image_urls.length > 0 
    ? shoe.image_urls 
    : [shoe.image_url];

  return (
    <main className="min-h-screen bg-white">
      <Navbar onCartClick={() => setIsCartOpen(true)} onAuthClick={() => setIsAuthOpen(true)} />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />

      <div className="pt-24 pb-20 px-6 sm:px-10 lg:px-20 max-w-[1800px] mx-auto">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-400 mb-10">
          <Link href="/" className="hover:text-zinc-900 transition-colors">Shop</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-zinc-900">{shoe.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Image Gallery */}
          <div className="lg:col-span-7 space-y-6">
            <div className="relative aspect-[4/5] bg-[#F6F6F6] rounded-[2.5rem] overflow-hidden group">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImage}
                  src={gallery[activeImage]}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>
              
              {gallery.length > 1 && (
                <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => setActiveImage((prev) => (prev > 0 ? prev - 1 : gallery.length - 1))}
                    className="p-3 bg-white/90 rounded-full shadow-lg hover:bg-white"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => setActiveImage((prev) => (prev < gallery.length - 1 ? prev + 1 : 0))}
                    className="p-3 bg-white/90 rounded-full shadow-lg hover:bg-white"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>

            {/* Thumbnails */}
            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
              {gallery.map((url: string, i: number) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`relative w-24 aspect-square rounded-2xl overflow-hidden bg-zinc-50 border-2 transition-all flex-shrink-0 ${
                    activeImage === i ? "border-zinc-900" : "border-transparent"
                  }`}
                >
                  <img src={url} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="lg:col-span-5 space-y-10">
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl font-black tracking-tighter text-zinc-900 leading-[1.1]">
                {shoe.name}
              </h1>
              <div className="flex items-center gap-4">
                <span className="text-2xl font-bold text-zinc-900">₹{shoe.price.toLocaleString()}</span>
                <span className="px-3 py-1 bg-zinc-100 text-[10px] font-bold uppercase tracking-widest rounded-full">In Stock</span>
              </div>
            </div>

            <p className="text-lg text-zinc-500 leading-relaxed">
              {shoe.description}
            </p>

            {/* Size Selector (Mock) */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">Select Size (UK)</span>
                <button className="text-[10px] font-bold uppercase tracking-widest text-zinc-900 underline underline-offset-4">Size Guide</button>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {["7", "8", "9", "10"].map((size) => (
                  <button key={size} className="py-4 border border-zinc-200 rounded-2xl text-sm font-bold hover:border-zinc-900 transition-all">
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4 pt-6">
              <button 
                onClick={() => { addToCart(shoe); setIsCartOpen(true); }}
                className="w-full py-5 bg-zinc-900 text-white rounded-full font-bold text-lg flex items-center justify-center gap-3 hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-200 active:scale-[0.98]"
              >
                <ShoppingBag className="w-5 h-5" />
                Add to Bag
              </button>
            </div>

            {/* Product Details Accordin */}
            <div className="space-y-6 pt-10 border-t border-zinc-100">
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-900">Materials & Care</h4>
                <p className="text-sm text-zinc-500 leading-relaxed">
                  {shoe.detailed_description || "Handcrafted with premium materials in Kanpur. Designed for long-lasting comfort and timeless style. Wipe clean with a soft, damp cloth."}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6">
                <div className="flex flex-col items-center text-center gap-2">
                  <Truck className="w-5 h-5 text-zinc-400" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Free Shipping</span>
                </div>
                <div className="flex flex-col items-center text-center gap-2">
                  <RotateCcw className="w-5 h-5 text-zinc-400" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">7 Days Return</span>
                </div>
                <div className="flex flex-col items-center text-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-zinc-400" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Authentic</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <ReviewSection productId={id as string} />

        {/* Suggested Products Section */}
        <SuggestedProducts currentId={id as string} category={shoe.category} />
      </div>
    </main>
  );
}
