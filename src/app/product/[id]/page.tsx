"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, ShoppingBag, ShieldCheck, 
  Truck, RotateCcw, Loader2, ChevronRight, ChevronLeft, Check
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
  
  // Size Selection State
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [sizeError, setSizeError] = useState(false);

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
        <div className="w-8 h-8 bg-black animate-pulse rounded-sm"></div>
      </div>
    );
  }

  if (!shoe) return null;

  const gallery = shoe.image_urls && shoe.image_urls.length > 0 
    ? shoe.image_urls 
    : [shoe.image_url];

  const availableSizes = shoe.sizes && shoe.sizes.length > 0 ? shoe.sizes : ["6", "7", "8", "9", "10", "11"];

  const handleAddToCart = () => {
    if (!selectedSize) {
      setSizeError(true);
      // Remove error animation after 2s
      setTimeout(() => setSizeError(false), 2000);
      return;
    }
    
    addToCart({ ...shoe, selectedSize });
    setIsCartOpen(true);
  };

  return (
    <main className="min-h-screen bg-white text-black font-inter selection:bg-black selection:text-white">
      <Navbar onCartClick={() => setIsCartOpen(true)} onAuthClick={() => setIsAuthOpen(true)} />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />

      <div className="pt-32 pb-24 px-6 sm:px-12 max-w-[1400px] mx-auto">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-12">
          <Link href="/" className="hover:text-black transition-colors">Shop</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-black">{shoe.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
          {/* Image Gallery */}
          <div className="lg:col-span-7 space-y-6">
            <div className="relative aspect-[4/5] bg-zinc-100 rounded-3xl overflow-hidden group border border-zinc-200/50">
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
                <div className="absolute inset-x-6 top-1/2 -translate-y-1/2 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => setActiveImage((prev) => (prev > 0 ? prev - 1 : gallery.length - 1))}
                    className="p-4 bg-white/90 backdrop-blur-md rounded-full shadow-lg hover:bg-white transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => setActiveImage((prev) => (prev < gallery.length - 1 ? prev + 1 : 0))}
                    className="p-4 bg-white/90 backdrop-blur-md rounded-full shadow-lg hover:bg-white transition-colors"
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
                    activeImage === i ? "border-black" : "border-transparent hover:border-zinc-300"
                  }`}
                >
                  <img src={url} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="lg:col-span-5 flex flex-col justify-center space-y-12">
            <div className="space-y-6">
              {shoe.category && (
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">
                  {shoe.category}
                </span>
              )}
              <h1 className="text-4xl sm:text-6xl font-black tracking-tighter uppercase leading-[0.9]">
                {shoe.name}
              </h1>
              <div className="flex items-center gap-6">
                <span className="text-3xl font-black">₹{shoe.price.toLocaleString()}</span>
              </div>
            </div>

            <p className="text-base text-zinc-500 font-medium leading-relaxed">
              {shoe.description}
            </p>

            {/* New Premium Size Selector */}
            <motion.div 
              animate={sizeError ? { x: [-10, 10, -10, 10, 0] } : {}}
              transition={{ duration: 0.4 }}
              className={`space-y-4 p-6 rounded-3xl transition-colors duration-300 ${sizeError ? 'bg-red-50 border border-red-200' : 'bg-zinc-50 border border-transparent'}`}
            >
              <div className="flex justify-between items-center">
                <span className={`text-xs font-bold uppercase tracking-widest ${sizeError ? 'text-red-500' : 'text-zinc-500'}`}>
                  {sizeError ? "Please Select a Size" : "Select Size (UK)"}
                </span>
                <button className="text-[10px] font-bold uppercase tracking-widest text-zinc-900 underline underline-offset-4 hover:text-zinc-600 transition-colors">
                  Size Guide
                </button>
              </div>
              
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                {availableSizes.map((size: string) => {
                  const isSelected = selectedSize === size;
                  return (
                    <button 
                      key={size}
                      onClick={() => {
                        setSelectedSize(size);
                        setSizeError(false);
                      }}
                      className={`relative py-4 rounded-2xl text-sm font-bold transition-all duration-300 overflow-hidden ${
                        isSelected 
                          ? "bg-black text-white shadow-lg scale-105" 
                          : "bg-white text-zinc-900 border border-zinc-200 hover:border-black hover:bg-zinc-50"
                      }`}
                    >
                      <span className="relative z-10">{size}</span>
                      {isSelected && (
                        <motion.div 
                          layoutId="activeSize"
                          className="absolute inset-0 bg-black rounded-2xl"
                          initial={false}
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>

            <button 
              onClick={handleAddToCart}
              className={`w-full py-6 rounded-full font-bold text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all duration-300 shadow-xl hover:shadow-2xl ${
                !selectedSize && sizeError 
                  ? "bg-red-600 text-white" 
                  : "bg-black text-white hover:bg-zinc-900 hover:-translate-y-1"
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              {sizeError ? "Select Size First" : "Add to Bag"}
            </button>

            {/* Product Details Accordion */}
            <div className="space-y-8 pt-8 border-t border-zinc-100">
              <div className="space-y-3">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-black">Materials & Care</h4>
                <p className="text-sm text-zinc-500 leading-relaxed font-medium">
                  {shoe.detailed_description || "Handcrafted with premium materials in Kanpur. Designed for long-lasting comfort and timeless style. Wipe clean with a soft, damp cloth."}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6">
                <div className="flex flex-col items-center justify-center p-6 bg-zinc-50 rounded-2xl gap-3">
                  <Truck className="w-5 h-5 text-black" />
                  <span className="text-[9px] font-bold uppercase tracking-widest text-center">Free Shipping</span>
                </div>
                <div className="flex flex-col items-center justify-center p-6 bg-zinc-50 rounded-2xl gap-3">
                  <RotateCcw className="w-5 h-5 text-black" />
                  <span className="text-[9px] font-bold uppercase tracking-widest text-center">7 Days Return</span>
                </div>
                <div className="flex flex-col items-center justify-center p-6 bg-zinc-50 rounded-2xl gap-3">
                  <ShieldCheck className="w-5 h-5 text-black" />
                  <span className="text-[9px] font-bold uppercase tracking-widest text-center">Authentic</span>
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
